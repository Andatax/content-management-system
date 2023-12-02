const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;

const inquirer = require("inquirer");
const DataBaseTracker = require("./js/constructorViewData.js");
const { DataAdder, RoleAdder, EmployeeAdder, EmployeeUpdater } = require("./js/constructorAddData.js");
// const mainMenu = require("./js/index.js");
const db = mysql.createConnection(
	{
		host: "localhost",
		// MySQL username,
		user: "root",
		// MySQL password
		password: "Root-13%",
		database: "employees_db",
	},
	console.log(`Connected to the classlist_db database.`)
);

// db.query("SELECT * FROM employees", function (err, results) {
// 	console.log(results);
// });

const dataBaseTracker = new DataBaseTracker(db);

function mainMenu() {
	inquirer
		.prompt({
			type: "list",
			name: "action",
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
					dataBaseTracker.viewDataBase("departments", mainMenu);
					break;
				case "View all roles":
					dataBaseTracker.viewDataBase("roles", mainMenu);
					break;
				case "View all employees":
					dataBaseTracker.viewDataBase("employees", mainMenu);
					break;
				case "Add a department":
					const departmentAdder = new DataAdder(db, mainMenu);
					departmentAdder.promptUser();
					break;
				case "Add a role":
					const roleAdder = new RoleAdder(db, mainMenu);
					roleAdder.promptUser();
					break;
				case "Add an employee":
					const employeeAdder = new EmployeeAdder(db, mainMenu);
					employeeAdder.promptUser();
					break;
				case "Update an employee role":
					const employeeUpdater = new EmployeeUpdater(db, mainMenu);
					employeeUpdater.promptUser();
					break;
				case "Exit":
					connection.end();
					console.log("Exiting...");
					break;
			}
		});
}
mainMenu();
