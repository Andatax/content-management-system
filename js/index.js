const inquirer = require("inquirer");
const DataBaseTracker = require("./constructor");
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
					break;
				case "Add a role":
					break;
				case "Add an employee":
					break;
				case "Update an employee role":
					break;
				case "Exit":
					connection.end();
					console.log("Exiting...");
					break;
			}
		});
}
