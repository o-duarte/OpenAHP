import React from 'react';

import DashboardLayout from './DashboardLayout';
import DashboardLayoutDocuments from './DashboardLayoutDocuments';
import DashboardLayoutProblems from './DashboardLayoutProblems'
import AhpEditor from '../ahpEditor'
import {FullCentered} from '../widgets/layouts'
import Typography from '@material-ui/core/Typography'
import strings from '../../strings'


const DashboardDefault = () => {
  return <DashboardLayout component={() => <FullCentered><Typography variant='h4'> {strings.welcome} </Typography>
  <Typography variant='h6'> {strings.nextstep} </Typography>
  </FullCentered>} />;
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


