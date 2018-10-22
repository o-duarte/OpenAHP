import React, { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';

import {
  DashboardDefault,
  DashboardDocuments,
  DashboardProcess
} from './components/dashboard';
import { EditorLayout } from './components/editor';
import { Login } from './components/auth';
import { CURRENT_USER } from './graphql';

/*
 * Module privates.
 */

const Dashboard = props => {
  return (
    <Switch>
      <Route
        exact
        path={props.match.path}
        component={requireAuth(DashboardDefault)}
      />
      <Route
        exact
        path={`${props.match.path}/docs/`}
        component={requireAuth(DashboardDocuments)}
      />

      <Route
        path={`${props.match.path}/process/`}
        component={requireAuth(DashboardProcess)}
      />
    </Switch>
  );
};

/*
 * Module exports.
 */

const RootRoute = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route path="/dashboard" component={requireAuth(Dashboard)} />
        <Route
          path={'/editor/:documentId'}
          render={({ match }) => {
            return <EditorLayout documentId={match.params.documentId} />;
          }}
        />
        {/* </Route> */}
        {/* <Route path="/site" component={Site} /> */}
      </Switch>
    </BrowserRouter>
  );
};

const requireAuth = WrappedComponent => {
  class RequireAuth extends Component {
    componentWillUpdate(nextProps) {
      if (!nextProps.data.loading && !nextProps.data.currentUser) {
        this.props.history.push('/login');
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return graphql(CURRENT_USER)(RequireAuth);
};

export { RootRoute, requireAuth };
