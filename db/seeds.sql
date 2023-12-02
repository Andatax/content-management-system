
INSERT INTO departments (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Finance'),
  ('Human Resources');

INSERT INTO roles (title, salary, department_id) VALUES
  ('Sales Representative', 50000.00, 1),
  ('Sales Manager', 80000.00, 1),
  ('Marketing Specialist', 60000.00, 2),
  ('Financial Analyst', 70000.00, 3),
  ('HR Coordinator', 55000.00, 4);

INSERT INTO employees (first_name, last_name, role_id) VALUES
  ('John', 'Smith', 1),
  ('Jane', 'Smith', 2),
  ('Bob', 'Johnson', 3),
  ('Alice', 'Williams', 4),
  ('Charlie', 'Brown', 5);

SET @john_id = LAST_INSERT_ID();
SET @jane_id = LAST_INSERT_ID();
SET @bob_id = LAST_INSERT_ID();
SET @alice_id = LAST_INSERT_ID();

UPDATE employees SET manager_id = NULL WHERE id = @john_id;
UPDATE employees SET manager_id = @john_id WHERE id = @jane_id;
UPDATE employees SET manager_id = @jane_id WHERE id = @bob_id;
UPDATE employees SET manager_id = NULL WHERE id = @alice_id;

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('David', 'Smith', 1, @john_id),
  ('Eva', 'Johnson', 2, @jane_id),
  ('Frank', 'Brown', 3, @bob_id);
