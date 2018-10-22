import React from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';
import momentLocale from 'moment/locale/es';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import 'normalize.css';

import './styles/styles.css';
import { theme } from './styles/theme';
import { RootRoute } from './routes';

// Setting locale for moment library.
moment.updateLocale('es', momentLocale);

/*
 * Apollo client setup.
 */

const link = createHttpLink({
  uri: '/graphql',
  credentials: 'same-origin'
});

const cache = new InMemoryCache({
  dataIdFromObject: o => o.id
});

const client = new ApolloClient({
  cache,
  link
});

/*
 * Application rendering.
 */

const App = () => <RootRoute />;

ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById('root')
);
