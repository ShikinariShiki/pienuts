-- Database schema for the kawaii site
-- Run this script to create the necessary tables

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create sessions table for persistent login
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Insert some sample data
INSERT INTO users (username, email, password) VALUES
('kawaii_user', 'kawaii@example.com', '$2y$10$abcdefghijklmnopqrstuv'), -- Replace with actual hashed password
('cute_visitor', 'cute@example.com', '$2y$10$abcdefghijklmnopqrstuv');

INSERT INTO messages (message, user_id) VALUES
('Your art is so cute! I love your style so much! ♡', 1),
('Can you teach me how to draw like you? I\'m a big fan!', 2),
('I saw your cosplay photos, they\'re amazing! What\'s your next costume?', 1),
('Do you play Genshin Impact? What\'s your UID?', NULL),
('Your kawaii style is so inspiring! Keep up the great work!', 2);
