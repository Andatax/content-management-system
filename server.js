const mysql = require("mysql2/promise");
const PORT = process.env.PORT || 3001;
const inquirer = require("inquirer");
require("dotenv").config();
let connection;
const {
	viewAllDepartments,
	viewAllRoles,
	viewAllEmployees,
	insertDepartment,
	insertRole,
	insertEmployee,
} = {
	viewAllDepartments: "SELECT * FROM departments",
	viewAllRoles:
		"SELECT roles.id, title, salary, name AS department FROM roles JOIN departments ON roles.department_id = departments.id",
	viewAllEmployees: `
      SELECT employees.id, employees.first_name, employees.last_name, 
             roles.title, departments.name AS department, roles.salary, 
             CONCAT(manager.first_name, " ", manager.last_name) AS manager
      FROM employees
      LEFT JOIN roles ON employees.role_id = roles.id
      LEFT JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees AS manager ON employees.manager_id = manager.id
    `,
	insertDepartment: "INSERT INTO departments (name) VALUES (?)",
	insertRole: "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
	insertEmployee:
		"INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
};

async function mainMenu() {
	try {
		connection = await mysql.createConnection({
			host: "localhost",
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			namedPlaceholders: true,
		});

		console.log(`Connected to the classlist_db database.`);
		const answer = await inquirer.prompt({
			name: "action",
			type: "list",
			message: "What would you like to do?",
			choices: [
				"View all departments",
				"View all roles",
				"View all employees",
				"Add a department",
				"Add a role",
				"Add an employee",
				"Update an employee role",
				"Exit",
			],
		});

		switch (answer.action) {
			case "View all departments":
				await viewDepartments();
				break;
			case "View all roles":
				await viewRoles();
				break;
			case "View all employees":
				await viewEmployees();
				break;
			case "Add a department":
				await addDepartment();
				break;
			case "Add a role":
				await addRole();
				break;
			case "Add an employee":
				await addEmployee();
				break;
			case "Update an employee role":
				await updateEmployeeRole();
				break;
			case "Exit":
				connection.end();
				break;
		}
	} catch (error) {
		console.error(error);
	}
}

async function viewDepartments() {
	try {
		const [rows] = await connection.execute(viewAllDepartments);
		console.table(rows);
		mainMenu();
	} catch (err) {
		console.error(err);
		mainMenu();
	}
}

async function viewRoles() {
	try {
		const [rows] = await connection.execute(viewAllRoles);
		console.table(rows);
		mainMenu();
	} catch (err) {
		console.error(err);
		mainMenu();
	}
}

async function viewEmployees() {
	try {
		const [rows] = await connection.execute(viewAllEmployees);
		console.table(rows);
		mainMenu();
	} catch (err) {
		console.error(err);
		mainMenu();
	}
}
async function addDepartment() {
	try {
		const answer = await inquirer.prompt({
			name: "department",
			type: "input",
			message: "Enter the name of the department:",
		});

		await connection.execute(insertDepartment, [answer.department]);
		console.log("Department added successfully!");
	} catch (err) {
		console.error("Error adding department:", err);
	} finally {
		mainMenu();
	}
}

async function addRole() {
	try {
		const [existingDepartments] = await connection.execute(viewAllDepartments);
		const departments = existingDepartments.map(department => department.name);
		const answer = await inquirer.prompt([
			{
				name: "title",
				type: "input",
				message: "Enter the title of the role:",
			},
			{
				type: "input",
				name: "salary",
				message: "Enter the salary for the role:",
			},
			{
				type: "input",
				name: "department",
				message: "Select the department for the role:",
				choices: departments,
			},
		]);

		const selectedDepartment = existingDepartments.find(
			department => department.name === answer.department
		);

		if (selectedDepartment) {
			await connection.execute(insertRole, [answer.title, answer.salary, selectedDepartment.id]);
			console.log("Role added successfully!");
		} else {
			console.log("Selected department not found. Role not added.");
		}

		mainMenu();
	} catch (err) {
		console.error(err);
		mainMenu();
	}
}

async function addEmployee() {
	try {
		const [existingDepartments] = await connection.execute(viewAllDepartments);
		const departments = existingDepartments.map(department => department.name);
		const [managers] = await connection.execute(viewAllEmployees);
		const managerChoices = managers.map(manager => ({
			name: `${manager.first_name} ${manager.last_name} (ID: ${manager.id})`,
			value: manager.id,
		}));

		const answer = await inquirer.prompt([
			{
				name: "first_name",
				type: "input",
				message: "Enter the first name of the employee:",
			},
			{
				name: "last_name",
				type: "input",
				message: "Enter the last name of the employee:",
			},
			{
				name: "department",
				type: "list",
				message: "Select the department for the employee:",
				choices: departments,
			},
			{
				name: "manager_id",
				type: "list",
				message: "Select the manager for the employee (optional, press Enter to skip):",
				choices: [...managerChoices, { name: "None", value: null }],
				default: null,
			},
		]);

		const selectedDepartment = existingDepartments.find(
			department => department.name === answer.department
		);
		console.log("Selected Department:", selectedDepartment);

		if (selectedDepartment && selectedDepartment.id) {
			await connection.execute(insertEmployee, [
				answer.first_name,
				answer.last_name,
				selectedDepartment.id,
				answer.manager_id,
			]);
			console.log("Employee added successfully!");
			mainMenu();
		} else {
			console.log("Invalid department or department ID not found.");
			mainMenu();
		}
	} catch (err) {
		console.error(err);
		mainMenu();
	}
}

async function updateEmployeeRole() {
	try {
		const [existingEmployees] = await connection.execute(viewAllEmployees);
		const employeeChoices = existingEmployees.map(employee => ({
			name: `${employee.first_name} ${employee.last_name}`,
			value: employee.id,
		}));
		const answer = await inquirer.prompt({
			name: "employeeId",
			type: "list",
			message: "Select the employee you want to update:",
			choices: employeeChoices,
		});
		const [existingEmployee] = await connection.execute("SELECT * FROM employees WHERE id = ?", [
			answer.employeeId,
		]);
		if (existingEmployee.length > 0) {
			const [existingDepartments] = await connection.execute(viewAllDepartments);
			const departments = existingDepartments.map(department => department.name);

			const [existingEmployees] = await connection.execute(viewAllEmployees);
			const employeeChoices = existingEmployees.map(employee => ({
				name: `${employee.first_name} ${employee.last_name}`,
				value: employee.id,
			}));
			const updateOptions = await inquirer.prompt([
				{
					name: "first_name",
					type: "input",
					message: "Enter the new first name of the employee:",
					default: existingEmployee[0].first_name,
				},
				{
					name: "last_name",
					type: "input",
					message: "Enter the new last name of the employee:",
					default: existingEmployee[0].last_name,
				},
				{
					name: "department",
					type: "list",
					message: "Select the new department for the employee:",
					choices: departments,
				},
				{
					name: "manager_id",
					type: "list",
					message: "Select the new manager for the employee:",
					choices: [...employeeChoices, { name: "None", value: null }],
					default: existingEmployee[0].manager_id,
				},
			]);

			const selectedDepartment = existingDepartments.find(
				department => department.name === updateOptions.department
			);
			await connection.execute(
				"UPDATE employees SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?",
				[
					updateOptions.first_name,
					updateOptions.last_name,
					selectedDepartment.id,
					updateOptions.manager_id,
					answer.employeeId,
				]
			);

			console.log("Employee updated successfully!");
		} else {
			console.log("Employee not found.");
		}
	} catch (err) {
		console.error("Error updating employee role:", err);
	} finally {
		mainMenu();
	}
}

`mainMenu();
