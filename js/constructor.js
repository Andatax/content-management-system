class DataBaseTracker {
	constructor(connection) {
		this.connection = connection;
	}
	viewDataBase(database, callback) {
		const query = `SELECT * FROM ${database}`;
		this.connection.query(query, (err, res) => {
			if (err) throw err;
			console.table(res);
			callback();
		});
	}
}

module.exports = DataBaseTracker;
