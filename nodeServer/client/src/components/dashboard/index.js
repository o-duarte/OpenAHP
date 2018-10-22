import React from 'react';

import DashboardLayout from './DashboardLayout';
import DashboardLayoutDocuments from './DashboardLayoutDocuments';

const DashboardDefault = () => {
  return <DashboardLayout component={() => <h1>Default</h1>} />;
};

const DashboardDocuments = () => {
  return <DashboardLayout component={() => <DashboardLayoutDocuments />} />;
};

const DashboardProcess = () => {
  return <DashboardLayout component={() => <h1>Process</h1>} />;
};

export { DashboardDefault, DashboardDocuments, DashboardProcess };
