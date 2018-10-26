import React from 'react';

import DashboardLayout from './DashboardLayout';
import DashboardLayoutDocuments from './DashboardLayoutDocuments';
import TreeView from '../widgets/treeView'


const DashboardDefault = () => {
  return <DashboardLayout component={() => <h1>Default</h1>} />;
};

const DashboardDocuments = () => {
  return <DashboardLayout component={() => <DashboardLayoutDocuments />} />;
};

const DashboardProcess = () => {
  return <DashboardLayout component={() => <TreeView/>} />;
};

export { DashboardDefault, DashboardDocuments, DashboardProcess };
