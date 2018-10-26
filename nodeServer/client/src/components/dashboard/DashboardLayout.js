import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress'

import { Layout, LayoutTypes } from '../widgets/layouts';
import { MenuListWithButton } from '../widgets/menuList';
import Logo from '../widgets/Logo';

import {CURRENT_USER} from '../../graphql'
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
            component={<Avatar className={classes.avatar}>
                      { this.props.currentUser? this.props.currentUser.fullname.charAt(0): 'A'}           
                      </Avatar>}
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

class DashboardLayout extends Component {
  componentDidMount() {
    const { refetch } = this.props.data;
    refetch();
  }
  render() {
    const { classes } = this.props;
    const { currentUser, loading, error } = this.props.data;
    if (loading) {
      return  (
        <CircularProgress
            size={150}
            className={classes.progress}
        />

    );
    } else if (error) {
      return <h1>Error</h1>;
    } else  {
      return (
        <Layout
          menuItems={sideBarMenuItems}
          type={LayoutTypes.LAYOUT_SHIFT_MENU}
          direction="left"
          headerContent={<DashboardHeader currentUser={currentUser}/>}
        >
          {this.props.component()}
        </Layout>
        );}
  };
};

export default graphql(CURRENT_USER)(withStyles(styleDashboardHeaderComponent)(DashboardLayout));
