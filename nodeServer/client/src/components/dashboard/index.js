import React from 'react';

import DashboardLayout from './DashboardLayout';
import DashboardLayoutDocuments from './DashboardLayoutDocuments';
import AhpEditor from '../ahpEditor'


const DashboardDefault = () => {
  return <DashboardLayout component={() => <h1>Default</h1>} />;
};

const DashboardDocuments = () => {
  return <DashboardLayout component={() => <DashboardLayoutDocuments />} />;
};

const DashboardProcess = () => {
  return <DashboardLayout component={() => <AhpEditor/>} />;
};

export { DashboardDefault, DashboardDocuments, DashboardProcess };


