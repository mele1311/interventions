CREATE DATABASE IF NOT EXISTS interventions_db;
USE interventions_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'technicien', 'directeur') DEFAULT 'technicien',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interventions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  problem_description TEXT NOT NULL,
  location VARCHAR(200) NOT NULL,
  actions_taken TEXT NOT NULL,
  date_of_intervention DATE NOT NULL,
  is_solved TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Créer un admin par défaut (mot de passe: admin123)
-- Le hash ci-dessous correspond à "admin123" avec bcryptjs
INSERT INTO users (username, full_name, email, password, role) VALUES
('admin', 'Administrateur', 'admin@example.com', '$2a$10$8K1p/a0dL1LXMw0gV0bDe.jHZSJBqVKyr1HGvSRkH3YmrhLqaREMi', 'admin');
