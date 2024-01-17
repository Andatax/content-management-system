INSERT INTO departments (id, name) VALUES
  (1,'Sales'),
  (2,'Marketing'),
  (3,'Finance'),
  (4,'Human Resources');

INSERT INTO roles (id, title, salary, department_id) VALUES
  (1,'Sales Representative', 50000.00, 1),
  (2,'Sales Manager', 80000.00, 1),
  (3,'Marketing Specialist', 60000.00, 2),
  (4,'Financial Analyst', 70000.00, 3),
  (5,'HR Coordinator', 55000.00, 4);

INSERT INTO employees (id, first_name, last_name,role_id, manager_id) VALUES
  (1,'John', 'Smith', 1, null),
  (2,'Jane', 'Smith', 2, 1),
  (3,'Bob', 'Johnson', 3, 3),
  (4,'Alice', 'Williams', 4, null),
  (5,'Charlie', 'Brown', 5, 1);