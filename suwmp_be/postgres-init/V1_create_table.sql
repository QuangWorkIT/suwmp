-- ===========================================
-- EXTENSIONS
-- ===========================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===========================================
-- DROP ALL TABLES (CLEAN INIT)
-- ===========================================
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- ===========================================
-- CORE IDENTITY & ACCESS MANAGEMENT
-- ===========================================

CREATE TABLE roles (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- CITIZEN, COLLECTOR, ENTERPRISE, ADMIN
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL REFERENCES roles(id),
    image_url VARCHAR(255),
    status VARCHAR(20) CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- ENTERPRISE & COLLECTOR MANAGEMENT
-- ===========================================

CREATE TABLE enterprises (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_area (
    id BIGSERIAL PRIMARY KEY,
    enterprise_id BIGINT NOT NULL REFERENCES enterprises(id),
    longitude DECIMAL(10,6),
    latitude DECIMAL(10,6),
    radius BIGINT
);

CREATE TABLE enterprise_collectors (
    id BIGSERIAL PRIMARY KEY,
    enterprise_id BIGINT NOT NULL REFERENCES enterprises(id),
    collector_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- ===========================================
-- WASTE CATEGORIES & CAPACITY
-- ===========================================

CREATE TABLE waste_types (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Organic, Recyclable, Hazardous
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE enterprise_capacity (
    id BIGSERIAL PRIMARY KEY,
    enterprise_id BIGINT NOT NULL REFERENCES enterprises(id),
    waste_type_id INT NOT NULL REFERENCES waste_types(id),
    daily_capacity_kg INT NOT NULL
);

-- ===========================================
-- WASTE REPORTING (CORE FEATURE)
-- ===========================================

CREATE TABLE waste_reports (
    id BIGSERIAL PRIMARY KEY,
    citizen_id UUID NOT NULL REFERENCES users(id),
    waste_type_id INT NOT NULL REFERENCES waste_types(id),
    description TEXT,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    photo_url VARCHAR(500),
    status VARCHAR(20) CHECK (
        status IN ('PENDING', 'ACCEPTED', 'ASSIGNED', 'COLLECTED')
    ),
    ai_suggested_type_id INT REFERENCES waste_types(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- COLLECTION ASSIGNMENT & STATUS TRACKING
-- ===========================================

CREATE TABLE collection_assignments (
    id BIGSERIAL PRIMARY KEY,
    waste_report_id BIGINT NOT NULL REFERENCES waste_reports(id),
    enterprise_id BIGINT NOT NULL REFERENCES enterprises(id),
    collector_id UUID NOT NULL REFERENCES users(id),
    assigned_at TIMESTAMP,
    start_collect_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP,
    photo_url VARCHAR(500)
);

CREATE TABLE report_collection_status_logs (
    id BIGSERIAL PRIMARY KEY,
    waste_report_id BIGINT NOT NULL REFERENCES waste_reports(id),
    collection_assignment_id BIGINT NOT NULL REFERENCES collection_assignments(id),
    status VARCHAR(30) CHECK (
        status IN ('ASSIGNED', 'ON_THE_WAY', 'COLLECTED')
    ),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- REWARD & GAMIFICATION SYSTEM
-- ===========================================

CREATE TABLE reward_rules (
    id BIGSERIAL PRIMARY KEY,
    enterprise_id BIGINT NOT NULL REFERENCES enterprises(id),
    waste_type_id INT NOT NULL REFERENCES waste_types(id),
    base_points INT NOT NULL,
    quality_multiplier DECIMAL(3,2),
    time_bonus INT,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE reward_transactions (
    id BIGSERIAL PRIMARY KEY,
    citizen_id UUID NOT NULL REFERENCES users(id),
    waste_report_id BIGINT NOT NULL REFERENCES waste_reports(id),
    points INT NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- FEEDBACK, COMPLAINTS & DISPUTES
-- ===========================================

CREATE TABLE complaints (
    id BIGSERIAL PRIMARY KEY,
    citizen_id UUID NOT NULL REFERENCES users(id),
    waste_report_id BIGINT NOT NULL REFERENCES waste_reports(id),
    description TEXT,
    photo_url VARCHAR(500),
    status VARCHAR(20) CHECK (
        status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED')
    ),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ===========================================
-- SEED DATA: ROLES
-- ===========================================

INSERT INTO roles (id, name) VALUES
(1, 'CITIZEN'),
(2, 'ENTERPRISE'),
(3, 'COLLECTOR'),
(4, 'ADMIN'),
(5, 'GUEST');


-- ===========================================
-- SEED DATA: WASTE TYPES
-- ===========================================

INSERT INTO waste_types (
    id,
    name,
    description,
    created_at,
    updated_at,
    deleted_at
) VALUES
(1, 'ORGANIC', 'Biodegradable waste such as food scraps and garden waste', NOW(), NOW(), NULL),
(2, 'RECYCLABLE', 'Waste materials that can be recycled such as plastic, paper, and metal', NOW(), NOW(), NULL),
(3, 'HAZARDOUS', 'Waste that poses a risk to health or the environment, including chemicals and batteries', NOW(), NOW(), NULL);