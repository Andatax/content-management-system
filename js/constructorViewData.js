class DataBaseTracker {
	constructor(connection) {
		this.connection = connection;
	}
	viewDataBase(table, callback) {
		this.connection.query(`SELECT * FROM ${table}`, function (err, results) {
			console.log(results);
			callback();
		});
	}
}

module.exports = DataBaseTracker;
