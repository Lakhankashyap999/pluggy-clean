-- =============================================================================
-- PLUGGY 2.0 PRODUCTION SQL DATABASE SCHEMA (PostgreSQL / MySQL / SQLite)
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    wallet_balance DECIMAL(10, 2) DEFAULT 250.00,
    city VARCHAR(80) DEFAULT 'Delhi NCR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS engineers (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(120),
    password_hash VARCHAR(255) NOT NULL,
    specialization VARCHAR(160) NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 4.90,
    completed_count INT DEFAULT 0,
    is_online BOOLEAN DEFAULT TRUE,
    area VARCHAR(120),
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(64) DEFAULT 'DISPATCH_EXECUTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_requests (
    id BIGINT PRIMARY KEY,
    transaction_id VARCHAR(32) UNIQUE NOT NULL,
    user_id VARCHAR(32),
    user_name VARCHAR(120) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    service VARCHAR(200) NOT NULL,
    issue TEXT,
    address TEXT NOT NULL,
    booking_mode VARCHAR(40) DEFAULT 'STANDARD',
    priority VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(40) DEFAULT 'PENDING_EXECUTIVE',
    assigned_engineer_id VARCHAR(32),
    assigned_engineer VARCHAR(120),
    assigned_engineer_phone VARCHAR(20),
    required_kit TEXT,
    executive_note TEXT,
    start_otp CHAR(4) NOT NULL,
    happy_otp CHAR(4) NOT NULL,
    base_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    parts_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_status VARCHAR(40) DEFAULT 'PAID_ESCROW',
    payment_method VARCHAR(40) DEFAULT 'UPI',
    appliance_qr_id VARCHAR(40),
    warranty_valid_till TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    txn_id VARCHAR(40) PRIMARY KEY,
    booking_id BIGINT,
    user_name VARCHAR(120) NOT NULL,
    user_phone VARCHAR(20),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(40) NOT NULL,
    payment_channel VARCHAR(80),
    payment_type VARCHAR(40) DEFAULT 'SERVICE_BOOKING',
    status VARCHAR(32) DEFAULT 'SUCCESS',
    escrow_state VARCHAR(40) DEFAULT 'HELD_UNTIL_HAPPY_PIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_history_logs (
    log_id VARCHAR(40) PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    transaction_id VARCHAR(32),
    actor_role VARCHAR(32) NOT NULL,
    actor_name VARCHAR(120) NOT NULL,
    action VARCHAR(80) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
