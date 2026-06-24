-- TravelRoute AI Database Schema
-- Compatible with both PostgreSQL and MongoDB (as reference)

-- =============================================
-- USERS COLLECTION / TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    avatar TEXT DEFAULT '',
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);

-- =============================================
-- TRIPS COLLECTION / TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) DEFAULT 'My Trip',
    source_name VARCHAR(200) NOT NULL,
    source_lat DOUBLE PRECISION,
    source_lng DOUBLE PRECISION,
    destination_name VARCHAR(200) NOT NULL,
    destination_lat DOUBLE PRECISION,
    destination_lng DOUBLE PRECISION,
    travel_date DATE NOT NULL,
    return_date DATE,
    travelers INTEGER DEFAULT 1 CHECK (travelers >= 1),
    route_distance DOUBLE PRECISION,
    route_duration DOUBLE PRECISION,
    route_polyline TEXT,
    notes TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_created_at ON trips(created_at DESC);
CREATE INDEX idx_trips_source_destination ON trips(source_name, destination_name);

-- =============================================
-- ATTRACTIONS COLLECTION / TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS attractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    place_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT,
    rating DOUBLE PRECISION DEFAULT 0,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    time_required VARCHAR(100),
    entry_fee VARCHAR(100),
    best_time_to_visit VARCHAR(100),
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_attractions_trip_id ON attractions(trip_id);

-- =============================================
-- WEATHER COLLECTION / TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS weather_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    city VARCHAR(200),
    forecast_date DATE,
    temperature DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    wind_speed DOUBLE PRECISION,
    rain_probability DOUBLE PRECISION,
    uv_index DOUBLE PRECISION,
    condition VARCHAR(100),
    icon VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_weather_trip_id ON weather_forecasts(trip_id);

-- =============================================
-- COST ESTIMATES COLLECTION / TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS cost_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    mode_type VARCHAR(20) NOT NULL CHECK (mode_type IN ('car', 'bus', 'train', 'flight')),
    total_cost DOUBLE PRECISION,
    duration_minutes INTEGER,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cost_trip_id ON cost_estimates(trip_id);

-- =============================================
-- SEARCHES COLLECTION / TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    source VARCHAR(200) NOT NULL,
    destination VARCHAR(200) NOT NULL,
    travel_date DATE,
    return_date DATE,
    travelers INTEGER DEFAULT 1,
    results_found BOOLEAN DEFAULT false,
    ip_address VARCHAR(45),
    response_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_searches_user_id ON searches(user_id);
CREATE INDEX idx_searches_created_at ON searches(created_at DESC);
CREATE INDEX idx_searches_popular ON searches(source, destination);

-- =============================================
-- HOTELS COLLECTION / TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    place_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    image TEXT,
    price DOUBLE PRECISION,
    rating DOUBLE PRECISION,
    amenities TEXT[],
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_hotels_trip_id ON hotels(trip_id);

-- =============================================
-- RESTAURANTS COLLECTION / TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    place_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    rating DOUBLE PRECISION,
    cuisine VARCHAR(255),
    cost_for_two DOUBLE PRECISION,
    image TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_restaurants_trip_id ON restaurants(trip_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VIEWS
-- =============================================

-- Popular routes view
CREATE OR REPLACE VIEW popular_routes AS
SELECT 
    source,
    destination,
    COUNT(*) as search_count,
    MAX(created_at) as last_searched
FROM searches
GROUP BY source, destination
ORDER BY search_count DESC;

-- User activity view
CREATE OR REPLACE VIEW user_activity AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    COUNT(DISTINCT t.id) as trip_count,
    COUNT(DISTINCT s.id) as search_count,
    MAX(s.created_at) as last_activity
FROM users u
LEFT JOIN trips t ON t.user_id = u.id
LEFT JOIN searches s ON s.user_id = u.id
GROUP BY u.id, u.name, u.email;

-- =============================================
-- MongoDB EQUIVALENT SCHEMA (for reference)
-- =============================================
-- 
-- // User Collection
-- db.createCollection("users", {
--   validator: {
--     $jsonSchema: {
--       bsonType: "object",
--       required: ["name", "email"],
--       properties: {
--         name: { bsonType: "string" },
--         email: { bsonType: "string" },
--         password: { bsonType: "string" },
--         googleId: { bsonType: "string" },
--         avatar: { bsonType: "string" },
--         role: { enum: ["user", "admin"] },
--         savedTrips: { bsonType: "array", items: { bsonType: "objectId" } },
--         searchHistory: { bsonType: "array" },
--         isActive: { bsonType: "bool" }
--       }
--     }
--   }
-- })
-- db.users.createIndex({ email: 1 }, { unique: true })
-- db.users.createIndex({ googleId: 1 })
--
-- // Trip Collection (see Mongoose model for full schema)
-- db.trips.createIndex({ user: 1, createdAt: -1 })
-- db.trips.createIndex({ "source.name": "text", "destination.name": "text" })
--
-- // Search Collection
-- db.searches.createIndex({ createdAt: -1 })
-- db.searches.createIndex({ source: 1, destination: 1 })
