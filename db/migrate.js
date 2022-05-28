const db = require('./index.js');

db.serialize(() => {
	db.run(`
		create table companies (
			id INTEGER PRIMARY KEY,
			name TEXT,
			region TEXT,
			industry TEXT,
			segment TEXT
		);
	`)
	.run(`
		create table departments (
			id INTEGER PRIMARY KEY,
			company_id INTEGER,
			name TEXT
		);
	`)
	.run(`
		create table employees (
			id INTEGER PRIMARY KEY,
			department_id INTEGER,
			name TEXT,
			avatar TEXT,
			title TEXT,
			country TEXT
		);
	`)
	.run(`
		create table employee_field_defs (
			id INTEGER PRIMARY KEY,
			company_id INTEGER,
			name TEXT,
			UNIQUE (company_id, name)
		);
	`)
	.run(`
		create table employee_fields (
			id INTEGER PRIMARY KEY,
			field_def_id INTEGER,
			employee_id INTEGER,
			value TEXT,
			UNIQUE (field_def_id, employee_id)
		);`
	)
});

db.close((err) => {
	if (err) {
		return console.error(err.message);
	}
	console.log('Close the database connection.');
});