const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Data Directory for JSON Storage ────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ─── Uploads Directory ───────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Multer config — store files locally with unique names
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  }
});

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|avif/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) &&
      allowed.test(file.mimetype.replace('image/', ''))) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, png, gif, webp, avif)'));
  }
};

const upload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

const DEFAULT_HERO_SLIDES = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    subtitle: "Experience premium living in the heart of Islamabad",
    price: "PKR 4.5 Crore",
    location: "DHA Phase 6, Islamabad",
    features: ["4 Beds", "3 Baths", "3,200 sq ft"],
    gradient: "linear-gradient(135deg, #2d5a27, #4a7c59)",
    image_url: "",
    icon: "🏡"
  },
  {
    id: 2,
    title: "Premium Penthouse",
    subtitle: "Sky-high living with panoramic city views",
    price: "PKR 8 Crore",
    location: "Bahria Town, Rawalpindi",
    features: ["3 Beds", "2 Baths", "2,100 sq ft"],
    gradient: "linear-gradient(135deg, #ff6b35, #d4af37)",
    image_url: "",
    icon: "🏢"
  },
  {
    id: 3,
    title: "Luxury Apartment",
    subtitle: "Contemporary design meets elegant comfort",
    price: "PKR 2.5 Crore",
    location: "F-10, Islamabad",
    features: ["2 Beds", "2 Baths", "1,800 sq ft"],
    gradient: "linear-gradient(135deg, #4a7c59, #2d5a27)",
    image_url: "",
    icon: "🏠"
  }
];

const readJson = (filename, defaultData) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) { console.error(`Error reading ${filename}:`, e.message); }
  return defaultData;
};

const writeJson = (filename, data) => {
  const filePath = path.join(DATA_DIR, filename);
  try { fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); }
  catch (e) { console.error(`Error writing ${filename}:`, e.message); }
};

// ─── Database Connection ─────────────────────────────────────────────────────
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.connect((err, client, release) => {
  if (err) console.error('Error connecting to database:', err.stack);
  else { console.log('✅ Database connected successfully'); release(); }
});

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 200
});
app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static Uploads ──────────────────────────────────────────────────────────
// Helmet sets Cross-Origin-Resource-Policy: same-origin by default, which
// blocks the React dev server (localhost:3000) from loading images from the
// API server (localhost:5000). Override it to 'cross-origin' for /uploads.
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(UPLOADS_DIR));

// ─── Health Checks ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Propex API is running', timestamp: new Date().toISOString() });
});

app.get('/api/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    res.status(200).json({ status: 'OK', message: 'Database connection is healthy', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed', error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// IMAGE UPLOAD API
// ═══════════════════════════════════════════════════════════════════════════

// POST /api/upload  — single image, field name "image"
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(201).json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// DELETE /api/upload/:filename  — remove an uploaded file
app.delete('/api/upload/:filename', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }
  fs.unlinkSync(filePath);
  res.json({ success: true, message: 'File deleted' });
});

// ═══════════════════════════════════════════════════════════════════════════
// PROPERTIES API
// ═══════════════════════════════════════════════════════════════════════════

// GET all properties
app.get('/api/properties', async (req, res) => {
  try {
    const { type, limit = 100, offset = 0 } = req.query;
    let query = `
      SELECT id, title, description, price, property_type, status,
             bedrooms, bathrooms, area_sqft, address, area,
             agent_name, agent_phone, main_image_url, features, created_at
      FROM properties
    `;
    const params = [];
    if (type && type !== 'all') {
      query += ` WHERE property_type = $1`;
      params.push(type);
    }
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch properties', error: error.message });
  }
});

// GET single property
app.get('/api/properties/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM properties WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Property not found' });
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch property', error: error.message });
  }
});

// POST create property
app.post('/api/properties', async (req, res) => {
  try {
    const {
      title, description, price, property_type, bedrooms, bathrooms,
      area_sqft, address, area, agent_name, agent_phone, main_image_url
    } = req.body;

    const result = await pool.query(
      `INSERT INTO properties (
        title, description, price, property_type,
        bedrooms, bathrooms, area_sqft, address, area,
        agent_name, agent_phone, main_image_url, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'available') RETURNING *`,
      [
        title, description, price, property_type || 'house',
        bedrooms || 0, bathrooms || 0, area_sqft || 0,
        address || '', area || '',
        agent_name || 'Admin', agent_phone || '', main_image_url || ''
      ]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create property', error: error.message });
  }
});

// PUT update property (full update)
app.put('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allowedFields = [
      'title', 'description', 'price', 'property_type', 'status',
      'bedrooms', 'bathrooms', 'area_sqft', 'address', 'area',
      'main_image_url', 'agent_name', 'agent_phone'
    ];

    const updates = [];
    const values = [];
    let idx = 1;

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${idx++}`);
        values.push(req.body[field]);
      }
    }

    if (updates.length === 0)
      return res.status(400).json({ success: false, message: 'No fields to update' });

    values.push(id);
    const query = `UPDATE properties SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Property not found' });

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update property', error: error.message });
  }
});

// DELETE property
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Property not found' });
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete property', error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// HERO SLIDES API  (JSON file storage)
// ═══════════════════════════════════════════════════════════════════════════

app.get('/api/hero-slides', (req, res) => {
  const slides = readJson('hero-slides.json', DEFAULT_HERO_SLIDES);
  res.json({ success: true, data: slides });
});

app.post('/api/hero-slides', (req, res) => {
  const slides = readJson('hero-slides.json', DEFAULT_HERO_SLIDES);
  const newSlide = {
    ...req.body,
    id: Date.now(),
    icon: req.body.icon || '🏠'
  };
  slides.push(newSlide);
  writeJson('hero-slides.json', slides);
  res.status(201).json({ success: true, data: newSlide });
});

app.put('/api/hero-slides/:id', (req, res) => {
  const slides = readJson('hero-slides.json', DEFAULT_HERO_SLIDES);
  const idx = slides.findIndex(s => String(s.id) === String(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Slide not found' });
  slides[idx] = { ...slides[idx], ...req.body, id: slides[idx].id };
  writeJson('hero-slides.json', slides);
  res.json({ success: true, data: slides[idx] });
});

app.delete('/api/hero-slides/:id', (req, res) => {
  let slides = readJson('hero-slides.json', DEFAULT_HERO_SLIDES);
  const before = slides.length;
  slides = slides.filter(s => String(s.id) !== String(req.params.id));
  if (slides.length === before)
    return res.status(404).json({ success: false, message: 'Slide not found' });
  writeJson('hero-slides.json', slides);
  res.json({ success: true, message: 'Slide deleted' });
});

// Reorder hero slides
app.put('/api/hero-slides/reorder', (req, res) => {
  const { ids } = req.body;
  const slides = readJson('hero-slides.json', DEFAULT_HERO_SLIDES);
  const reordered = ids.map(id => slides.find(s => String(s.id) === String(id))).filter(Boolean);
  writeJson('hero-slides.json', reordered);
  res.json({ success: true, data: reordered });
});

// ═══════════════════════════════════════════════════════════════════════════
// FEATURED PROPERTIES API  (JSON file stores selected IDs)
// ═══════════════════════════════════════════════════════════════════════════

app.get('/api/featured-properties', async (req, res) => {
  try {
    const featuredIds = readJson('featured-properties.json', []);
    let result;
    if (featuredIds.length === 0) {
      result = await pool.query(
        `SELECT id, title, description, price, property_type, bedrooms, bathrooms,
                area_sqft, address, area, main_image_url, features
         FROM properties ORDER BY created_at DESC LIMIT 6`
      );
    } else {
      result = await pool.query(
        `SELECT id, title, description, price, property_type, bedrooms, bathrooms,
                area_sqft, address, area, main_image_url, features
         FROM properties WHERE id = ANY($1::int[]) ORDER BY created_at DESC`,
        [featuredIds]
      );
    }
    res.json({ success: true, data: result.rows, featuredIds });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update which properties are featured
app.put('/api/featured-properties', (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids))
    return res.status(400).json({ success: false, message: 'ids must be an array' });
  writeJson('featured-properties.json', ids);
  res.json({ success: true, message: 'Featured properties updated', count: ids.length });
});

// ═══════════════════════════════════════════════════════════════════════════
// LISTING PAGE SETTINGS API  (JSON file storage)
// ═══════════════════════════════════════════════════════════════════════════

const DEFAULT_LISTING_SETTINGS = {
  pageTitle: "Premium Properties in Islamabad",
  pageSubtitle: "Discover luxury homes in Pakistan's capital city",
  bannerImageUrl: "",
  showFilters: true,
  propertiesPerPage: 12
};

app.get('/api/settings/listing', (req, res) => {
  const settings = readJson('listing-settings.json', DEFAULT_LISTING_SETTINGS);
  res.json({ success: true, data: settings });
});

app.put('/api/settings/listing', (req, res) => {
  const current = readJson('listing-settings.json', DEFAULT_LISTING_SETTINGS);
  const updated = { ...current, ...req.body };
  writeJson('listing-settings.json', updated);
  res.json({ success: true, data: updated });
});

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS API
// ═══════════════════════════════════════════════════════════════════════════

app.get('/api/analytics/properties', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM property_analytics ORDER BY total_views DESC LIMIT 10`
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
  }
});

// Dashboard stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const propertiesResult = await pool.query('SELECT COUNT(*) as total FROM properties');
    const typeResult = await pool.query(
      `SELECT property_type, COUNT(*) as count FROM properties GROUP BY property_type`
    );
    const featuredIds = readJson('featured-properties.json', []);
    const heroSlides = readJson('hero-slides.json', DEFAULT_HERO_SLIDES);

    res.json({
      success: true,
      data: {
        totalProperties: parseInt(propertiesResult.rows[0].total),
        featuredCount: featuredIds.length,
        heroSlidesCount: heroSlides.length,
        byType: typeResult.rows
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Error Handlers ──────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Propex API running on port ${PORT}`);
  console.log(`🏠 Properties:  http://localhost:${PORT}/api/properties`);
  console.log(`🎬 Hero Slides: http://localhost:${PORT}/api/hero-slides`);
  console.log(`⭐ Featured:    http://localhost:${PORT}/api/featured-properties`);
  console.log(`📊 Stats:       http://localhost:${PORT}/api/admin/stats`);
});

process.on('SIGTERM', () => {
  pool.end(() => { console.log('Database pool closed'); process.exit(0); });
});

module.exports = app;
