import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import './CompanyDetails.css';

const CompanyInfo = ({
	id,
	className,
	name,
	segment,
	region,
	industry
}) => {
	const [ value, setValue ] = useState(name);
	const [ editing, setEditing ] = useState([]);

	const onChange = (event) => {
		setValue(event.target.value);
	}

	const onSubmit = async (event) => {
		event.preventDefault();
		if (editing === true) {
			const requestOptions = {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: value })
			};
			const response = await fetch(`/companies/` + id, requestOptions);
			if (response.status < 300) {
				setValue(value);
				setEditing(false);
			}
		}
		else {
			setEditing(true);
		}
	}

	return (
	<div className={className}>
		<form onSubmit={onSubmit}>
			{editing === true
				? <input className="company_details_name" required min="1" value={value} onChange={onChange} />
				: <div className="company_details_name">{value}</div>
			}
			<button type="submit" >{editing === true ? "Save" : "Edit..."}</button>
		</form>
		<div className="company_details_meta">Segment: {segment}</div>
		<div className="company_details_meta">Region: {region}</div>
		<div className="company_details_meta">Industry: {industry}</div>
	</div>
)};

const TableHeader = ({
	id,
	className,
	avatar,
	name,
	title,
	country,
	customFields
}) => {
	const [ value, setValue ] = useState(name);
	const [ editing, setEditing ] = useState([]);

	const onChange = (event) => {
		setValue(event.target.value);
	}

	const onSubmit = async (event) => {
		if (editing === true) {
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: value })
			};
			const response = await fetch(`/companies/` + id + `/customFields`, requestOptions);
			if (response.status < 300) {
				setValue(value);
				setEditing(false);
			}
		}
		else {
			event.preventDefault();
			setEditing(true);
		}
	}

	return (
	<div className={className}>
		<div className="company_details_row-cell">{avatar}</div>
		<div className="company_details_row-cell">{name}</div>
		<div className="company_details_row-cell">{title}</div>
		<div className="company_details_row-cell">{country}</div>
		{customFields.map(field => (
			<div id={field.id} className="company_details_row-cell">{field.name}</div>
		))}
		<div className="company_details_row-cell">
			<form onSubmit={onSubmit}>
				{editing === true
					? <input className="company_details_row-cell" required min="1" onChange={onChange} />
					: ""
				}
				<button type="submit">{editing === true ? "Save" : "Add field..."}</button>
			</form>
		</div>
	</div>
)};

const TableRow = ({
	className,
	id,
	name,
	avatar,
	title,
	country,
	customFields,
	employeeValues
}) => {
	const [ values, setValues ] = useState({name:'', title:'', country:''});
	const [ customValues, setCustomValues ] = useState([]);
	const [ editing, setEditing ] = useState([]);

	const set = key => {
		return ({target: { value } }) => {
			setValues(oldValues => ({...oldValues, [key]: value }));
		}
	};
	const setCustom = key => {
		return ({target: { value } }) => {
			setCustomValues(oldValues => ({...oldValues, [key]: value }));
		}
	}

	const onSubmit = async (event) => {
		if (editing === true) {
			const requestOptions = {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values)
			};
			const response = await fetch(`/employees/` + id, requestOptions);
			if (response.status < 300) {
				//setValues(value);
				setEditing(false);
			}
			customValues
				.map(val => async () => {
					const reqOpts = {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ id: val.key, value: val.value })
					};
					const resp = await fetch(`/employees/` + id + `/customFieldValues`, reqOpts);
					if (resp.status < 300) {
						//setValues()
						setEditing(false);
					}});
		}
		else {
			event.preventDefault();
			setEditing(true);
		}
	}

	return (
	<div className={className}>
		<form onSubmit={onSubmit}>
			<div className="company_details_row-cell">
				<img src={avatar} alt="" width="50px" />
			</div>
			<div className="company_details_row-cell">
				{editing === true 
					? <input value={values.name} onChange={set('name')} />
					: {name}}
			</div>
			<div className="company_details_row-cell">
				{editing === true
					? <input value={values.title} onChange={set('title')} />
					: {title}}
			</div>
			<div className="company_details_row-cell">
			{editing === true
					? <input value={values.country} onChange={set('country')} />
					: {country}}
			</div>
			{customFields.map(field => (
				<div className="company_details_row-cell">
					{editing === true
						? <input key={customValues[field.id]} value={customValues[field.id]} onChange={setCustom(field.id)} />
						: employeeValues
							?.find(val => val.field_def_id == field.id)
							?.value}
				</div>
			))}
			<div className="company_details_row-cell">
					<button type="submit">{editing === true ? "Save" : "Edit..."}</button>
			</div>
		</form>
	</div>
)};

const SubHeader = ({
	className,
	name,
	quantity
}) => (
	<div className={className} >
		{name} ({quantity} employees)
	</div>
);

const CompanyDetails = () => {
	const [companyDetails, setCompanyDetails] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [customFields, setCustomFields] = useState([]);
	const [employeeValues, setEmployeeValues ] = useState([]);
	const { companyId } = useParams();

	// fetch the company data from the backend
	useEffect(() => {
		async function getCompanyDetails() {
			const response = await fetch(`/companies/` + companyId);
			const { message, data } = await response.json();
			if (message === 'success') {
				setCompanyDetails(data);
			}
		}
		async function getEmployees() {
			const response = await fetch(`/companies/` + companyId + `/employees`);
			const { message, data } = await response.json();
			if (message == 'success') {
				setEmployees(data);
			}
		}
		async function getDepartments() {
			const response = await fetch(`/companies/` + companyId + `/departments`);
			const { message, data } = await response.json();
			if (message == 'success') {
				setDepartments(data);
			}
		}
		async function getCustomFields() {
			const response = await fetch(`/companies/` + companyId + `/customFields`);
			const { message, data } = await response.json();
			if (message == 'success') {
				setCustomFields(data);
			}
		}
		async function getEmployeeValues() {
			const response = await fetch(`/companies/` + companyId + `/employees/customFieldValues`);
			const { message, data } = await response.json();
			if (message == 'success') {
				setEmployeeValues(data);
			}
		}
		getDepartments();
		getCompanyDetails();
		getEmployees();
		getCustomFields();
		getEmployeeValues();
	}, []);

	return (
		<div className="company_details">
			<CompanyInfo
				key={companyDetails.id}
				className="company_details_info"
				{...companyDetails}
			/>
			<TableHeader
				id={companyDetails.id}
				className="company_details_header"
				avatar="Avatar"
				name="Name"
				title="Title"
				country="Country"
				customFields={customFields}
			/>
			{departments.map(department => (
				<div>
					<SubHeader
						className="company_details_subheader"
						name={department.name}
						quantity={employees
							.filter(e => e.department_id == department.id).length}
					/>
					{employees
						.filter(e => e.department_id == department.id)
						.map(employee => (
						<TableRow
							className="company_details_row"
							{...employee}
							customFields={customFields}
							employeeValues={employeeValues
								.filter(val => val.employee_id == employee.id)}
						/>
					))}
				</div>	
			))}
		</div>
	);
}

export default CompanyDetails;
