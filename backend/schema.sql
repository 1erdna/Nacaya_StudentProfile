-- Activity 7 database schema
CREATE DATABASE IF NOT EXISTS nacaya_student_profile
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE nacaya_student_profile;

CREATE TABLE IF NOT EXISTS users (
    user_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(80) NOT NULL,
    email VARCHAR(160) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uq_users_username (username),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS student_profiles (
    profile_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    course VARCHAR(120) NOT NULL,
    year_level VARCHAR(40) NOT NULL,
    bio TEXT NULL,
    skills TEXT NULL,
    profile_image MEDIUMTEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (profile_id),
    UNIQUE KEY uq_student_profiles_user (user_id),
    CONSTRAINT fk_student_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS profile_test_records (
    record_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id INT UNSIGNED NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (record_id),
    KEY idx_profile_test_records_user (user_id),
    CONSTRAINT fk_profile_test_records_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
