import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import List from '@material-ui/core/List'

import Collapse from '@material-ui/core/Collapse';
import Icon from '@material-ui/core/Icon';

class MenuListCollapse extends Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: props.isOpen };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { children, text, icon } = this.props;

    return (
      <List style={{ margin: 0, padding: 0 }}>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <Icon>{icon}</Icon>
          </ListItemIcon>
          <ListItemText inset primary={text} />
          {this.state.isOpen ? (
            <Icon>expand_less</Icon>
          ) : (
            <Icon>expand_more</Icon>
          )}
        </ListItem>
        <Collapse
          component="li"
          in={this.state.isOpen}
          timeout="auto"
          unmountOnExit
        >
          <List disablePadding>{children}</List>
        </Collapse>
      </List>
    );
  }
}

MenuListCollapse.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

MenuListCollapse.defaultProps = {
  isOpen: false
};

export default MenuListCollapse;
