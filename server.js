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
	if (updateCompany.name == undefined) {
		res.status(400).json({ 
			error: "Company name is undefined."
		});
	}

	const sql = `
		UPDATE companies SET name = @name WHERE id = @companyId;
	`;
	const params = [ updateCompany.name, req.params.companyId ];

	db.run(sql, params, (err) => {
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
 * GET /companies/:companyId/customFields
 */
app.get('/companies/:companyId/customFields', (req, res) => {
	const sql = `
		SELECT * FROM employee_field_defs WHERE company_id = @companyId
	`;
	const params = req.params.companyId;

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
})

/**
 * POST /companies/:companyId/customFields
 */
app.post('/companies/:companyId/customFields', (req, res) => {
	const newField = req.body;
	if (newField.name == undefined) {
		res.status(400).json({
			error: "Custom field name is undefined."
		})
	}
	const sql = `
		INSERT INTO employee_field_defs(company_id, name) 
			VALUES (@companyId, @name);
	`;
	const params = [ req.params.companyId, newField.name ];

	db.run(sql, params, (err) => {
		if (err) {
			res.status(400).json({
				error: err.message
			});
			return;
		}
		res.status(201).json({
			message: 'success'
		})
	});
})

/**
 * GET /companies/:companyId/departments
 */
app.get('/companies/:companyId/departments', (req, res) => {
	const sql = `
		SELECT * FROM departments WHERE company_id = @companyId;
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
 * GET /companies/:companyId/employees
 */
 app.get('/companies/:companyId/employees', (req, res) => {
	const sql = `
		SELECT e.*, d.company_id
			FROM employees e 
				JOIN departments d ON e.department_id = d.id
			WHERE d.company_id = @companyId
			ORDER BY e.department_id;
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
 * GET /companies/:companyId/employees/customFields
 */
 app.get('/companies/:companyId/employees/customFieldValues', (req, res) => {
	const sql = `
		SELECT e.id, efd.*, ef.value 
			FROM employees e 
				JOIN departments d ON e.department_id = d.id 
				JOIN employee_field_defs efd ON efd.company_id = d.company_id 
				JOIN employee_fields ef ON efd.id = ef.field_def_id AND e.id = ef.employee_id 
			WHERE d.company_id = @companyId;
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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
});