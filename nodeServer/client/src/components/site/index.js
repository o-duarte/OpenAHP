import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link } from 'react-router-dom';

import SiteLayout from './SiteLayout';
import SiteDocuments from './SiteDocuments';

const menuItems = [
  {
    type: 'button',
    link: '/site/documents',
    icon: 'location_city',
    text: 'Documentos'
  },
  {
    type: 'button',
    link: '/site/process',
    icon: 'supervisor_account',
    text: 'Procesos'
  },
  {
    type: 'button',
    link: '/site/codes',
    icon: 'location_city',
    text: 'Codes'
  }
];

const SiteDocumentsLayout = props => {
  return (
    <SiteLayout menuItems={menuItems} component={() => <SiteDocuments />} />
  );
};

const SiteHome = props => {
  return <SiteLayout menuItems={menuItems} component={() => <h1>Home</h1>} />;
};

const SiteProcess = props => {
  return (
    <SiteLayout menuItems={menuItems} component={() => <h1>Process</h1>} />
  );
};

const SiteCodes = props => {
  return <SiteLayout menuItems={menuItems} component={() => <h1>Codes</h1>} />;
};

const Site = props => {
  const { path } = props.match;

  return (
    <Switch>
      <Route exact path={path} component={SiteHome} />
      <Route path={`${path}/documents/`} component={SiteDocumentsLayout} />
      <Route path={`${path}/process/`} component={SiteProcess} />
      <Route path={`${path}/codes/`} component={SiteCodes} />
    </Switch>
  );
};

export default Site;
