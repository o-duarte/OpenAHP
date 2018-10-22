import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

import { MenuList } from '../menuList';
import Fluid from './Fluid';

const style = theme => ({
  appBar: {
    margin: '0 auto',
    backgroundColor: 'white',
    boxShadow: 'none',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  hide: {
    display: 'none'
  },
  content: {
    padding: '1em',
    marginTop: 65
  },
  flex: theme.custom.globals.flex
});

class LayoutResponsiveMenu extends Component {
  constructor(props) {
    super(props);

    this.handleToogle = this.handleToogle.bind(this);
  }

  state = {
    open: false
  };

  static propTypes = {
    direction: PropTypes.string
  };

  static defaultProps = {
    direction: 'top'
  };

  handleToogle(event) {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { classes } = this.props;
    const { direction, menuItems, headerContent, children } = this.props;

    return (
      <div>
        <AppBar
          position="absolute"
          className={classNames(
            classes.appBar,
            this.state.open && classes.hide
          )}
        >
          <Toolbar disableGutters={!this.state.open}>
            <Fluid md={9}>
              <div className={classes.flex}>
                <Hidden smUp>
                  <IconButton
                    aria-label="open drawer"
                    onClick={this.handleToogle}
                    className={classNames(
                      classes.menuButton,
                      this.state.open && classes.hide
                    )}
                  >
                    <Icon>menu</Icon>
                  </IconButton>
                </Hidden>
                {headerContent}
              </div>
            </Fluid>
          </Toolbar>

          <Hidden smUp>
            <Drawer
              type="temporary"
              anchor={direction}
              open={this.state.open}
              onClose={this.handleToogle}
              ModalProps={{
                keepMounted: true
              }}
            >
              <MenuList items={menuItems} />
            </Drawer>
          </Hidden>
        </AppBar>

        <Fluid md={9}>
          <main className={classes.content}>{children}</main>
        </Fluid>
      </div>
    );
  }
}

export default withStyles(style)(LayoutResponsiveMenu);
