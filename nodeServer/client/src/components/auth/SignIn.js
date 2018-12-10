import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import {InputLabel} from '@material-ui/core';
import { FormControl } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';


import { FullScreen, Centered } from '../widgets/layouts';
import Logo from '../widgets/Logo';

import { SIGNIN } from '../../graphql';

/*
 * Module exports.
 */

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: '12px',
    overflow: 'auto',
    minWidth: '600px'
  },
  paper: {
    minWidth: '300px',
    padding: '20px',
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
})
class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', fullname: '' };
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
            <InputLabel htmlFor="signin-email">Correo Electrónico</InputLabel>
            <Input
              id="signin-email"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="signin-password">Password</InputLabel>
            <Input
              id="signin-password"
              value={this.state.password}
              type="password"
              onChange={e => this.setState({ password: e.target.value })}
            />
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="signin-fullname">Username</InputLabel>
            <Input
              id="signin-fullname"
              value={this.state.fullname}
              type="text"
              onChange={e => this.setState({ fullname: e.target.value })}
            />
          </FormControl>

          <div className="errors">
            {this.props.errors.map(error => <div key={error}>{error}</div>)}
          </div>

          <FormControl fullWidth margin="normal">
            <Button type="submit">Registrar</Button>
          </FormControl>
        </form>
    );
  }
}

class SignIn extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);

    this.state = { errors: [] };
  }

  componentWillUpdate(nextProps) {
    console.log('will update');

  }
  validateEmail(email) 
  {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;;
    return email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
  }

  onSubmit({ email, password, fullname }) {
    if(!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)){
      this.setState({ errors: ['enter a valid email'] });
      return (null)
    }
    if(password.length<8){
      this.setState({ errors: ['enter a valid password(min legth = 8)'] });
      return (null)
    }
    if(fullname.length<4){
      this.setState({ errors: ['enter a valid username'] });
      return (null)
    }
    this.props
      .mutate({
        variables: { email, password, fullname },
      })
      .then(({ data }) => {
        this.props.history.push('/login')        
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => error.message);
        this.setState({ errors });
      })
      ;
  }

  render() {
    const { classes } = this.props;
    return (
      <FullScreen>
        <Centered>
          <Paper className={classes.paper} elevation={10} >
            <SignInForm errors={this.state.errors} onSubmit={this.onSubmit} />
            </Paper>
        </Centered>
      </FullScreen>
    );
  }
}

export default compose(graphql(SIGNIN),)(withStyles(styles)(withRouter(SignIn)));
