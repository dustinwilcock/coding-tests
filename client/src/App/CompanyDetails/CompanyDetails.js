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
			<button type="submit">{editing === true ? "Save" : "Edit"}</button>
		</form>
		<div className="company_details_meta">Segment: {segment}</div>
		<div className="company_details_meta">Region: {region}</div>
		<div className="company_details_meta">Industry: {industry}</div>
	</div>
)};

const TableRow = ({
	className,
	name,
	avatar,
	title,
	country
}) => (
	<div className={className}>
		<div className="company_details_row-cell">
			<img src={avatar} alt="" width="50px" />
		</div>
		<div className="company_details_row-cell">{name}</div>
		<div className="company_details_row-cell">{title}</div>
		<div className="company_details_row-cell">{country}</div>
	</div>
);

const SubHeader = ({
	className,
	name,
	quantity
}) => (
	<div className={className}>
		{name} ({quantity} employees)
	</div>
);

const CompanyDetails = () => {
	const [companyDetails, setCompanyDetails] = useState([]);
	const [employees, setEmployees] = useState([]);
	const [departments, setDepartments] = useState([]);
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
		getDepartments();
		getCompanyDetails();
		getEmployees();
	}, []);

	return (
		<div className="company_details">
			<CompanyInfo
				key={companyDetails.id}
				className="company_details_info"
				{...companyDetails}
			/>
			<TableRow
				className="company_details_header"
				avatar=""
				name="Name"
				title="Title"
				country="Country"
			/>
			{departments.map(department => (
				<div>
					<SubHeader
						key={department.id}
						className="company_details_subheader"
						name={department.name}
						quantity={employees
							.filter(e => e.department_id == department.id).length}
					/>
					{employees
						.filter(e => e.department_id == department.id)
						.map(employee => (
						<TableRow
							key={employee.id}
							className="company_details_row"
							{...employee}
						/>
					))}
				</div>	
			))}
		</div>
	);
}

export default CompanyDetails;
