import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import { CURRENT_USER as query, LOGOUT as mutation } from '../../graphql';

class Logout extends Component {
  static propTypes = {
    forMenuList: PropTypes.bool
  };

  static defaultProps = {
    forMenuList: false
  };

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();

    this.props.mutate({
      refetchQueries: [{ query }]
    });
  }

  render() {
    const { forMenuList } = this.props;

    if (forMenuList) {
      return (
        <ListItem button onClick={this.onClick}>
          <ListItemIcon>
            <Icon>exit_to_app</Icon>
          </ListItemIcon>
          <ListItemText inset primary="Logout" />
        </ListItem>
      );
    } else {
      return <Button onClick={this.onClick}>Logout</Button>;
    }
  }
}

export default graphql(mutation)(Logout);
