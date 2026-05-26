-- Pakistani Real Estate Management System Database Schema
-- PostgreSQL Database Schema

-- Create database (run this command separately)
-- CREATE DATABASE pakistani_real_estate;

-- Use the database
-- \c pakistani_real_estate;

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table for authentication
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Properties table with comprehensive Pakistani real estate data
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PKR',
    property_type VARCHAR(50) NOT NULL, -- 'house', 'villa', 'penthouse', 'apartment'
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'sold', 'pending', 'inactive'
    
    -- Property specifications
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    area_sqft INTEGER NOT NULL,
    parking_spaces INTEGER DEFAULT 0,
    floor_number INTEGER,
    total_floors INTEGER,
    
    -- Location details
    address TEXT NOT NULL,
    city VARCHAR(50) DEFAULT 'Islamabad',
    area VARCHAR(100) NOT NULL, -- F-11, DHA, Bahria Town, etc.
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Media and features
    main_image_url TEXT,
    image_urls TEXT[], -- Array of image URLs
    features TEXT[], -- Array of features like 'Swimming Pool', 'Gym', etc.
    
    -- Agent information
    agent_name VARCHAR(100) NOT NULL,
    agent_phone VARCHAR(20) NOT NULL,
    agent_email VARCHAR(100),
    agent_whatsapp VARCHAR(20),
    
    -- SEO and metadata
    slug VARCHAR(200) UNIQUE,
    meta_title VARCHAR(200),
    meta_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES admin_users(id),
    updated_by UUID REFERENCES admin_users(id)
);

-- Property views tracking table for analytics
CREATE TABLE property_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    
    -- Visitor information
    visitor_ip VARCHAR(45), -- IPv4 or IPv6
    user_agent TEXT,
    referrer TEXT,
    
    -- Geographic data
    country VARCHAR(50),
    city VARCHAR(50),
    region VARCHAR(50),
    
    -- Device information
    device_type VARCHAR(20), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(50),
    operating_system VARCHAR(50),
    
    -- Session data
    session_id VARCHAR(100),
    visit_duration INTEGER, -- in seconds
    
    -- Timestamps
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Property inquiries table
CREATE TABLE property_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    
    -- Customer information
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    customer_message TEXT,
    
    -- Inquiry details
    inquiry_type VARCHAR(50) DEFAULT 'general', -- 'general', 'viewing', 'pricing', 'financing'
    preferred_contact_method VARCHAR(20) DEFAULT 'email', -- 'email', 'phone', 'whatsapp'
    preferred_contact_time VARCHAR(100),
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'new', -- 'new', 'contacted', 'scheduled', 'closed'
    admin_notes TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    responded_by UUID REFERENCES admin_users(id),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Website analytics table
CREATE TABLE website_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Page information
    page_url TEXT NOT NULL,
    page_title VARCHAR(200),
    
    -- Visitor information
    visitor_ip VARCHAR(45),
    user_agent TEXT,
    referrer TEXT,
    
    -- Geographic data
    country VARCHAR(50),
    city VARCHAR(50),
    region VARCHAR(50),
    
    -- Device information
    device_type VARCHAR(20),
    browser VARCHAR(50),
    operating_system VARCHAR(50),
    screen_resolution VARCHAR(20),
    
    -- Session data
    session_id VARCHAR(100),
    is_new_visitor BOOLEAN DEFAULT true,
    visit_duration INTEGER,
    pages_visited INTEGER DEFAULT 1,
    
    -- Timestamps
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Property categories table (for better organization)
CREATE TABLE property_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon_class VARCHAR(50), -- CSS class for icons
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin activity logs for audit trail
CREATE TABLE admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admin_users(id),
    action VARCHAR(100) NOT NULL, -- 'login', 'logout', 'create_property', 'update_property', etc.
    table_name VARCHAR(50),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city_area ON properties(city, area);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_created_at ON properties(created_at);
CREATE INDEX idx_properties_slug ON properties(slug);

CREATE INDEX idx_property_views_property_id ON property_views(property_id);
CREATE INDEX idx_property_views_viewed_at ON property_views(viewed_at);
CREATE INDEX idx_property_views_visitor_ip ON property_views(visitor_ip);

CREATE INDEX idx_property_inquiries_property_id ON property_inquiries(property_id);
CREATE INDEX idx_property_inquiries_status ON property_inquiries(status);
CREATE INDEX idx_property_inquiries_created_at ON property_inquiries(created_at);

CREATE INDEX idx_website_analytics_visited_at ON website_analytics(visited_at);
CREATE INDEX idx_website_analytics_page_url ON website_analytics(page_url);
CREATE INDEX idx_website_analytics_session_id ON website_analytics(session_id);

CREATE INDEX idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX idx_admin_activity_logs_created_at ON admin_activity_logs(created_at);
CREATE INDEX idx_admin_activity_logs_action ON admin_activity_logs(action);

-- Insert default admin user (password: admin123 - should be hashed in production)
INSERT INTO admin_users (username, password_hash, email, full_name) VALUES 
('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewDFrmhzlJ3E.KSa', 'admin@realestate.pk', 'System Administrator');

-- Insert default property categories
INSERT INTO property_categories (name, slug, description, icon_class, display_order) VALUES
('House', 'house', 'Independent houses and bungalows', 'fa-home', 1),
('Villa', 'villa', 'Luxury villas and estates', 'fa-building', 2),
('Penthouse', 'penthouse', 'Premium penthouse apartments', 'fa-city', 3),
('Apartment', 'apartment', 'Residential apartments and flats', 'fa-building-o', 4);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_inquiries_updated_at BEFORE UPDATE ON property_inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common analytics queries
CREATE VIEW property_analytics AS
SELECT 
    p.id,
    p.title,
    p.property_type,
    p.price,
    p.area,
    p.status,
    COUNT(pv.id) as total_views,
    COUNT(DISTINCT pv.visitor_ip) as unique_views,
    COUNT(pi.id) as total_inquiries,
    p.created_at,
    p.updated_at
FROM properties p
LEFT JOIN property_views pv ON p.id = pv.property_id
LEFT JOIN property_inquiries pi ON p.id = pi.property_id
GROUP BY p.id, p.title, p.property_type, p.price, p.area, p.status, p.created_at, p.updated_at;

CREATE VIEW daily_analytics AS
SELECT 
    DATE(visited_at) as date,
    COUNT(*) as total_visits,
    COUNT(DISTINCT visitor_ip) as unique_visitors,
    COUNT(CASE WHEN device_type = 'mobile' THEN 1 END) as mobile_visits,
    COUNT(CASE WHEN device_type = 'desktop' THEN 1 END) as desktop_visits,
    AVG(visit_duration) as avg_visit_duration
FROM website_analytics
GROUP BY DATE(visited_at)
ORDER BY date DESC;

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;