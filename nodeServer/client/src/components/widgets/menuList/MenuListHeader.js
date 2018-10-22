import React from 'react';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

const MenuListHeader = props => {
  const { withText = false, text = null, children } = props;
  return (
    <List subheader={withText ? <ListSubheader>{text}</ListSubheader> : null}>
      {children}
    </List>
  );
};

export default MenuListHeader;
