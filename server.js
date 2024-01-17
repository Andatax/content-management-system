const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;

const inquirer = require("inquirer");
const DataBaseTracker = require("./js/constructorViewData.js");
const { DataAdder, RoleAdder, EmployeeAdder, EmployeeUpdater } = require("./js/constructorAddData.js");
require("dotenv").config();

const db = mysql.createConnection(
	{
		host: "localhost",

		user: process.env.DB_USER,

		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	},
	console.log(`Connected to the classlist_db database.`)
);
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
	viewAllEmployees:
		'SELECT employees.id, first_name, last_name, title, name AS department, salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id',
	insertDepartment: "INSERT INTO departments SET ?",
	insertRole: "INSERT INTO roles SET ?",
	insertEmployee: "INSERT INTO employees SET ?",
};

function mainMenu() {
	inquirer
		.prompt({
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
		})
		.then(answer => {
			switch (answer.action) {
				case "View all departments":
					viewDepartments();
					break;
				case "View all roles":
					viewRoles();
					break;
				case "View all employees":
					viewEmployees();
					break;
				case "Add a department":
					addDepartment();
					break;
				case "Add a role":
					addRole();
					break;
				case "Add an employee":
					addEmployee();
					break;
				case "Update an employee role":
					updateEmployeeRole();
					break;
				case "Exit":
					connection.end();
					break;
			}
		});
}

async function viewDepartments() {
	try {
		const [rows] = await connection.query(viewAllDepartments);
		console.table(rows);
		mainMenu();
	} catch (err) {
		console.error(err);
		mainMenu();
	}
}

async function viewRoles() {
	try {
		const [rows] = await connection.query(viewAllRoles);
		console.table(rows);
		mainMenu();
	} catch (err) {
		console.error(err);
		mainMenu();
	}
}

async function viewEmployees() {
	try {
		const [rows] = await connection.query(viewAllEmployees);
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

		await connection.query(insertDepartment, { name: answer.department });
		console.log("Department added successfully!");
		mainMenu();
	} catch (err) {
		console.error("Error adding department:", err);
		mainMenu();
	}
}

async function addRole() {
	try {
		const [existingDepartments] = await connection.query(viewAllDepartments);
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
			await connection.query(insertRole, {
				title: answer.title,
				salary: answer.salary,
				department_id: selectedDepartment.id,
			});
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
