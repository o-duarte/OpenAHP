import React, { Component } from 'react';
//import PropTypes from 'prop-types';
//import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

import { MenuList } from '../menuList';
//import FullScreen from './FullScreen';

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    width: drawerWidth,

    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'relative'
    }
  },
  hide: {
    display: 'none'
  }
});

class LayoutPermanentMenu extends Component {
  state = {
    open: false
  };

  constructor(props) {
    super(props);
    this.handleToogle = this.handleToogle.bind(this);
  }

  handleToogle(event) {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { classes } = this.props;
    const { isOpen, direction, menuItems } = this.props;

    return (
      <div>
        <Hidden mdUp>
          <Drawer
            type="temporary"
            anchor={direction}
            open={isOpen}
            classes={{
              paper: classes.drawerPaper
            }}
            onClose={this.handleToogle}
            ModalProps={{
              keepMounted: true
            }}
          >
            <MenuList items={menuItems} />
          </Drawer>
        </Hidden>

        <Hidden smDown implementation="css">
          <Drawer
            type="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            <MenuList items={menuItems} />
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

export default withStyles(styles)(LayoutPermanentMenu);
