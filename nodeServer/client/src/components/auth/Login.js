import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import {InputLabel} from '@material-ui/core';
import { FormControl } from '@material-ui/core';

import { FullScreen, Centered } from '../widgets/layouts';
import Logo from '../widgets/Logo';

import { CURRENT_USER, LOGIN } from '../../graphql';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange = key => (event, value) => {
    this.setState({
      [key]: value
    });
  };

  onSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.state);
  }

  render() {
    return (
      <form noValidate autoComplete="off" onSubmit={this.onSubmit}>
        <Logo />

        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="login-email">Correo Electrónico</InputLabel>
          <Input
            id="login-email"
            value={this.state.email}
            onChange={e => this.setState({ email: e.target.value })}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="login-password">Password</InputLabel>
          <Input
            id="login-password"
            value={this.state.password}
            type="password"
            onChange={e => this.setState({ password: e.target.value })}
          />
        </FormControl>
        <div className="errors">
          {this.props.errors.map(error => <div key={error}>{error}</div>)}
        </div>

        <FormControl fullWidth margin="normal">
          <Button type="submit">Iniciar Sesión</Button>
          <Button href="/auth/google">Iniciar con Google</Button>
        </FormControl>
      </form>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = { errors: [] };
  }

  componentWillUpdate(nextProps) {
    console.log('will update');

    if (!this.props.data.currentUser && nextProps.data.currentUser) {
      this.props.history.push('/dashboard');
    }
  }

  onSubmit({ email, password }) {
    this.props
      .mutate({
        variables: { email, password },
        refetchQueries: [{ query: CURRENT_USER }]
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => error.message);
        this.setState({ errors });
      });
  }

  render() {
    return (
      <FullScreen>
        <Centered>
          <LoginForm errors={this.state.errors} onSubmit={this.onSubmit} />
        </Centered>
      </FullScreen>
    );
  }
}

export default compose(graphql(CURRENT_USER), graphql(LOGIN))(
  withRouter(Login)
);
