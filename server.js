const express = require("express");
// const path = require("path");
const mysql = require("mysql2");
// const routes = require("./routes/index.js");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection(
	{
		host: "localhost",
		// MySQL username,
		user: "root",
		// MySQL password
		password: "root-135",
		database: "employee_db",
	},
	console.log(`Connected to the classlist_db database.`)
);

db.query("SELECT * FROM employees", function (err, results) {
	console.log(results);
});

app.use((req, res) => {
	res.status(404).end();
});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
