DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db_db;

USE employees_db;

CREATE TABLE students (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  enrolled BOOLEAN NOT NULL
);