const inquirer = require("inquirer");
const DataBaseTracker = require("./constructorViewData");
const { DataAdder, RoleAdder, EmployeeAdder, EmployeeUpdater } = require("./constructorAddData.js");
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
					const departmentAdder = new DataAdder(connection, mainMenu);
					departmentAdder.promptUser();
					break;
				case "Add a role":
					const roleAdder = new RoleAdder(connection, mainMenu);
					roleAdder.promptUser();
					break;
				case "Add an employee":
					const employeeAdder = new EmployeeAdder(connection, mainMenu);
					employeeAdder.promptUser();
					break;
				case "Update an employee role":
					const employeeUpdater = new EmployeeUpdater(connection, mainMenu);
					employeeUpdater.promptUser();
					break;
				case "Exit":
					connection.end();
					console.log("Exiting...");
					break;
			}
		});
}

module.exports = mainMenu;
