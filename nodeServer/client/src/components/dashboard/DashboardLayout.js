import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';

import { Layout, LayoutTypes } from '../widgets/layouts';
import { MenuListWithButton } from '../widgets/menuList';
import Logo from '../widgets/Logo';

import { headerMenuItems, sideBarMenuItems } from './config.js';

/*
 * Module privates.
 */

const styleDashboardHeaderComponent = theme => ({
  root: {
    ...theme.custom.globals.flex,
    width: '100%'
  },
  icon: {
    ...theme.custom.header.icon,
    marginRight: 20
  },
  avatar: {
    height: 32,
    width: 32
  },
  leftSide: {
    ...theme.custom.globals.flex
  }
});

class DashboardHeaderComponent extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Logo />
        <div className={classes.leftSide}>
          <Icon className={classes.icon}>bookmark</Icon>
          <Icon className={classes.icon}>notifications</Icon>

          <MenuListWithButton
            component={<Avatar className={classes.avatar}>A</Avatar>}
            items={headerMenuItems}
          />
        </div>
      </div>
    );
  }
}

const DashboardHeader = withStyles(styleDashboardHeaderComponent)(
  DashboardHeaderComponent
);

/*
 * Module exports.
 */

const DashboardLayout = props => {
  return (
    <Layout
      menuItems={sideBarMenuItems}
      type={LayoutTypes.LAYOUT_SHIFT_MENU}
      direction="left"
      headerContent={<DashboardHeader />}
    >
      {props.component()}
    </Layout>
  );
};

export default DashboardLayout;
