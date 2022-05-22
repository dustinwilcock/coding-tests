import React from 'react';
import { Outlet } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs/Breadcrumbs';
import Logo from './Logo/Logo';
import './PageContainer.css';

const App = () => {
	return (
		<div className="page-container">
			<div className="page-container_top-bar">
				<Logo height="24" className="page-container_logo" />
				<div className="page-container_page-title">Coding Challenge</div>
			</div>
			<div className="page-container_content-container">
				<Breadcrumbs />
				<Outlet />
			</div>
		</div>
	);
}

export default App;
