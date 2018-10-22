import React from 'react';
import { Link } from 'react-router-dom';

import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

const MenuListButton = props => {
  const { link, icon, text } = props.item;

  return (
    <ListItem button component={Link} to={link}>
      <ListItemIcon>
        <Icon>{icon}</Icon>
      </ListItemIcon>
      <ListItemText inset primary={text} />
    </ListItem>
  );
};

export default MenuListButton;
