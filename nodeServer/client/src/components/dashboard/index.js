import React from 'react';

import DashboardLayout from './DashboardLayout';
import DashboardLayoutDocuments from './DashboardLayoutDocuments';
import DashboardLayoutProblems from './DashboardLayoutProblems'
import AhpEditor from '../ahpEditor'


const DashboardDefault = () => {
  return <DashboardLayout component={() => <h1>Default</h1>} />;
};

const DashboardDocuments = () => {
  return <DashboardLayout component={() => <DashboardLayoutDocuments />} />;
};

const DashboardProcess = () => {
  return <DashboardLayout component={() => <DashboardLayoutProblems/>} />;
};

const DashboardProblems = () => {
  return <DashboardLayout component={() => <DashboardLayoutProblems/>} />;
};

const DashboardProblem = (args) => {
  return <DashboardLayout component={() => <AhpEditor problemId={args.problemId}/>} />;
};

export { DashboardDefault, DashboardDocuments, DashboardProcess, DashboardProblems, DashboardProblem };


