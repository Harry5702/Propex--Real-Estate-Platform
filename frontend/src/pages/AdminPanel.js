import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const [formData, setFormData] = useState({
    title: '', description: '', price: '', property_type: 'house',
    bedrooms: 0, bathrooms: 0, area_sqft: 0, address: '', area: '',
    main_image_url: ''
  });
  
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/properties');
      setProperties(res.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load properties');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing property
        await axios.put(`http://localhost:5000/api/properties/${editingId}`, {
          price: formData.price,
          description: formData.description,
          main_image_url: formData.main_image_url
        });
      } else {
        // Create new property
        await axios.post('http://localhost:5000/api/properties', formData);
      }
      
      // Reset form & refresh
      setFormData({
        title: '', description: '', price: '', property_type: 'house',
        bedrooms: 0, bathrooms: 0, area_sqft: 0, address: '', area: '',
        main_image_url: ''
      });
      setEditingId(null);
      fetchProperties();
    } catch (err) {
      alert('Error saving property: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (prop) => {
    setEditingId(prop.id);
    setFormData({
      title: prop.title,
      description: prop.description,
      price: prop.price,
      property_type: prop.property_type,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      area_sqft: prop.area_sqft,
      address: prop.address,
      area: prop.area,
      main_image_url: prop.main_image_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`http://localhost:5000/api/properties/${id}`);
        fetchProperties();
      } catch (err) {
        alert('Failed to delete property');
      }
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid admin credentials. Use admin / admin123');
    }
  };

  if (!isAuthenticated) return (
    <div className="admin-container auth-wrapper">
      <div className="auth-card">
        <h2>Admin Authentication</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Enter admin username" value={credentials.username} onChange={e => setCredentials({...credentials, username: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter administrator password" value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }}>Access Dashboard</button>
        </form>
      </div>
    </div>
  );

  if (loading) return <div className="admin-container">Loading...</div>;

  return (
    <div className="admin-container">
      <h1>Admin Panel - Property Management</h1>
      {error && <div className="error-msg">{error}</div>}
      
      <div className="admin-form-card">
        <h2>{editingId ? 'Update Property' : 'Add New Property'}</h2>
        <p className="form-info">{editingId && 'Note: For updates, only Price, Description and Image URL are updated per requirements.'}</p>
        
        <form onSubmit={handleSubmit}>
          {!editingId && (
            <>
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select name="property_type" value={formData.property_type} onChange={handleInputChange}>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Bathrooms</label>
                  <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Area (Region)</label>
                  <input type="text" name="area" value={formData.area} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Sqft</label>
                  <input type="number" name="area_sqft" value={formData.area_sqft} onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label>Price (PKR)</label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" required></textarea>
          </div>
          <div className="form-group">
            <label>Main Image URL</label>
            <input type="text" name="main_image_url" value={formData.main_image_url} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Property' : 'Save Property'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={() => {
                setEditingId(null);
                setFormData({
                   title: '', description: '', price: '', property_type: 'house',
                   bedrooms: 0, bathrooms: 0, area_sqft: 0, address: '', area: '',
                   main_image_url: ''
                });
              }}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="properties-list">
        <h2>Manage Properties</h2>
        <div className="admin-grid">
          {properties.map(prop => (
            <div key={prop.id} className="admin-card">
              {prop.main_image_url && <img src={prop.main_image_url} alt={prop.title} />}
              <div className="admin-card-body">
                <h3>{prop.title}</h3>
                <p><strong>Price:</strong> {Number(prop.price).toLocaleString()} PKR</p>
                <p className="desc-preview">{prop.description?.substring(0, 100)}...</p>
                <div className="card-actions">
                  <button onClick={() => handleEdit(prop)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(prop.id)} className="btn-delete">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {properties.length === 0 && <p>No properties found.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;