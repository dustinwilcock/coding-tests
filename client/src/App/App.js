import React from 'react';
import {
	Routes,
	Route,
} from 'react-router-dom';
import PageContainer from './PageContainer/PageContainer.js';
import Companies from './Companies/Companies.js';
import CompanyDetails from './CompanyDetails/CompanyDetails.js';

const App = () => {
	return (
			<Routes>
				<Route path="/" element={<PageContainer />}>
					<Route index element={<Companies />} />
					<Route path="companies" element={<Companies />} />
					<Route path="companies/:companyId" element={<CompanyDetails />} />
				</Route>
			</Routes>
	);
}

export default App;
