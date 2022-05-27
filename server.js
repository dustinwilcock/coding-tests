const express = require('express');
const app = express();
const port = 5000;
const db = require('./db');
app.use(express.json());

/**
 * GET /companies
 * Fetches all companies in the database
 */
app.get('/companies', (req, res) => {
	const sql = `
		SELECT * FROM companies;
	`;
	const params = [];

	db.all(sql, params, (err, rows) => {
		if (err) {
			res.status(400).json({
				error: err.message
			});
			return;
		}
		res.json({
			message: 'success',
			data: rows
		})
	});
});

/**
 * GET /companies/:companyId
 * Fetches the specified company from the database
 */
app.get('/companies/:companyId', (req, res) => {
	const sql = `
		SELECT * FROM companies WHERE id = @companyId;
	`;
	const params = req.params.companyId;

	db.get(sql, params, (err,row) => {
		if (err) {
			res.status(400).json({
				error: err.message
			});
			return;
		}
		res.json({
			message: 'success',
			data: row
		})
	});
})

/**
 * PATCH /companies/:companyId
 * Allows edit of company name to be saved to the database
 */
 app.patch('/companies/:companyId', (req, res) => {
	const updateCompany = req.body;
	if (updateCompany.name == undefined)
		res.status(400).json({ 
			error: "name is undefined"
		});

	const sql = `
		UPDATE companies SET name = @name WHERE id = @companyId;
	`;
	const params = [ updateCompany.name, req.params.companyId ];

	db.run(sql, params, (err,row) => {
		if (err) {
			res.status(400).json({
				error: err.message
			});
			return;
		}
		res.status(204).json({
			message: 'success'
		})
	});
})

/**
 * GET /companies/:companyId/departments
 */
app.get('/companies/:companyId/departments', (req, res) => {
	const sql = `
		SELECT d.id, d.Name FROM departments d WHERE company_id = @companyId;
	`;
	const params = req.params.companyId;

	db.all(sql, params, (err,rows) => {
		if (err) {
			res.status(400).json({
				error: err.message
			});
			return;
		}
		res.json({
			message: 'success',
			data: rows
		})
	});
})

/**
 * GET /departments/:departmentId/employees
 */
 app.get('/departments/:departmentId/employees', (req, res) => {
	const sql = `
		SELECT e.id, e.name, e.avatar, e.title, e.country FROM employees e WHERE department_id = @departmentId;
	`;
	const params = req.params.departmentId;

	db.all(sql, params, (err,rows) => {
		if (err) {
			res.status(400).json({
				error: err.message
			});
			return;
		}
		res.json({
			message: 'success',
			data: rows
		})
	});
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});