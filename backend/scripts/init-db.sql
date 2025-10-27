-- Initialize PostgreSQL database for Rubber Plantation Management System
-- This script runs when the PostgreSQL container starts for the first time

-- Create PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create additional extensions for better performance
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS btree_gin;

-- Set timezone
SET timezone = 'Asia/Colombo';

-- Create a read-only user for reporting
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'rubber_readonly') THEN
        CREATE ROLE rubber_readonly;
    END IF;
END
$$;

-- Grant necessary permissions
GRANT CONNECT ON DATABASE rubber_plantation TO rubber_readonly;
GRANT USAGE ON SCHEMA public TO rubber_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO rubber_readonly;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO rubber_readonly;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO rubber_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO rubber_readonly;

-- Create indexes for better performance (will be created after tables are created by Sequelize)
-- These will be added by the migration script

-- Log the initialization
INSERT INTO pg_stat_statements_info (dealloc) VALUES (0) ON CONFLICT DO NOTHING;




