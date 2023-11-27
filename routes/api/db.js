const db = require("express").Router();
const path = require("node:path");

notes.get("/", (req, res) => {
	const filePath = path.join(__dirname, "../../db/db.json");
	console.info(`${req.method} request received for notes`);
	fs.readFile(filePath, "utf8", (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).json({ error: err.message });
			return;
		} else {
			res.json(JSON.parse(data));
		}
	});
});

module.exports = db;
