const inquirer = require("inquirer");
class DataAdder {
	constructor(connection, mainMenuCallback) {
		this.connection = connection;
		this.mainMenuCallback = mainMenuCallback;
	}

	promptUser() {
		inquirer
			.prompt({
				type: "input",
				name: "name",
				message: "Enter the name of the department:",
			})
			.then(answer => {
				this.addDepartmentToDatabase(answer.name);
			});
	}

	addDepartmentToDatabase(departmentName) {
		const query = "INSERT INTO departments (name) VALUES (?)";
		this.connection.query(query, [departmentName], err => {
			if (err) throw err;
			console.log("Department added successfully!");
			this.mainMenuCallback();
		});
	}
}

class RoleAdder extends DataAdder {
	constructor(connection, mainMenuCallback) {
		super(connection, mainMenuCallback);
	}

	promptUser() {
		inquirer
			.prompt([
				{
					type: "input",
					name: "title",
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
					message: "Enter the department for the role:",
				},
			])
			.then(answers => {
				this.addDataToDatabase(answers);
			});
	}

	addDataToDatabase({ title, salary, department }) {
		const query = "INSERT INTO roles (title, salary, department) VALUES (?, ?, ?)";
		this.connection.query(query, [title, salary, department], err => {
			if (err) throw err;
			console.log("Role added successfully!");
			this.mainMenuCallback();
		});
	}
}
class EmployeeAdder extends DataAdder {
	constructor(connection, mainMenuCallback) {
		super(connection, mainMenuCallback);
	}

	promptUser() {
		inquirer
			.prompt([
				{
					type: "input",
					name: "firstName",
					message: "Enter the first name of the employee:",
				},
				{
					type: "input",
					name: "lastName",
					message: "Enter the last name of the employee:",
				},
				{
					type: "input",
					name: "role",
					message: "Enter the role for the employee:",
				},
				{
					type: "input",
					name: "manager",
					message: "Enter the manager for the employee:",
				},
			])
			.then(answers => {
				this.addDataToDatabase(answers);
			});
	}

	addDataToDatabase({ firstName, lastName, role, manager }) {
		const query = "INSERT INTO employees (first_name, last_name, role, manager) VALUES (?, ?, ?, ?)";
		this.connection.query(query, [firstName, lastName, role, manager], err => {
			if (err) throw err;
			console.log("Employee added successfully!");
			this.mainMenuCallback();
		});
	}
}
class EmployeeUpdater extends DataAdder {
	constructor(connection, mainMenuCallback) {
		super(connection, mainMenuCallback);
	}

	promptUser() {
		inquirer
			.prompt([
				{
					type: "input",
					name: "employeeId",
					message: "Enter the ID of the employee you want to update:",
				},
				{
					type: "input",
					name: "newRole",
					message: "Enter the new role for the employee:",
				},
				{
					type: "input",
					name: "newManager",
					message: "Enter the new manager for the employee:",
				},
			])
			.then(answers => {
				this.updateEmployeeInDatabase(answers);
			});
	}

	updateEmployeeInDatabase({ employeeId, newRole, newManager }) {
		const query = "UPDATE employees SET role = ?, manager = ? WHERE id = ?";
		this.connection.query(query, [newRole, newManager, employeeId], err => {
			if (err) throw err;
			console.log("Employee updated successfully!");
			this.mainMenuCallback();
		});
	}
}
module.exports = { DataAdder, RoleAdder, EmployeeAdder, EmployeeUpdater };
