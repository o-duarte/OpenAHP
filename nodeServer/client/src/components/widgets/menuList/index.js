import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import { Manager, Target, Popper } from 'react-popper';

import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import MenuListHeader from './MenuListHeader';
import MenuListCollapse from './MenuListCollapse';
import MenuListButton from './MenuListButton';

/*
 *
 */

const menuListStyles = theme => ({
  subheader: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    fontSize: '10px'
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  icon: {
    fontSize: 18
  }
});

// TODO: Make this logic recursive.
class MenuListComponent extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    withHeader: PropTypes.bool
  };

  static defaultProps = {
    withHeader: false
  };

  render() {
    const { classes, items, withHeader } = this.props;

    return (
      <div>
        {items.map((item, index) => {
          switch (item.type) {
            case 'header':
              return (
                <MenuListHeader
                  key={index}
                  className={classes.root}
                  text={item.text}
                  withText={withHeader}
                >
                  {item.elements.map((el, index) => {
                    return <MenuListButton key={index} item={el} />;
                  })}
                </MenuListHeader>
              );
            case 'button':
              return <MenuListButton key={index} item={item} />;
            case 'collapse':
              return (
                <MenuListCollapse
                  key={index}
                  isOpen={item.isOpen}
                  text={item.text}
                  icon={item.icon}
                >
                  {item.elements.map((el, index) => {
                    return <MenuListButton key={index} item={el} />;
                  })}
                </MenuListCollapse>
              );
            case 'divider':
              return <Divider key={index} />;
            case 'custom':
              return <div key={index}>{item.component}</div>;
            default:
              return null;
          }
        })}
      </div>
    );
  }
}

const MenuList = withStyles(menuListStyles)(MenuListComponent);

/*
 *
 */

const menuListWithButtomStyle = {
  popperClose: {
    pointerEvents: 'none'
  }
};

class MenuListWithButtonComponent extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    component: PropTypes.node.isRequired
  };

  state = {
    open: false
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, component, items } = this.props;
    const { open } = this.state;

    return (
      <Manager>
        <Target>
          <IconButton
            aria-owns={open ? 'simple-menu' : null}
            aria-haspopup="true"
            onClick={this.handleClick}
            children={component}
          />
        </Target>
        <Popper
          placement="bottom-end"
          eventsEnabled={open}
          className={classNames({ [classes.popperClose]: !open })}
        >
          <ClickAwayListener onClickAway={this.handleClose}>
            <Grow in={open} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
              <Paper elevation={1}>
                <MenuList items={items} />
              </Paper>
            </Grow>
          </ClickAwayListener>
        </Popper>
      </Manager>
    );
  }
}

const MenuListWithButton = withStyles(menuListWithButtomStyle)(
  MenuListWithButtonComponent
);

/*
 *
 */

const styleMenuListHorizontalComponent = theme => ({
  root: {
    background: 'transparent',
    borderRadius: 15,
    border: 0,
    padding: '3px 8px',
    marginLeft: 10,
    textDecoration: 'none',
    fontSize: 12,
    fontWeight: 400,
    fontFamily: theme.typography.fontFamily,
    color: '#484848',
    textTransform: 'capitalize',
    '&:hover': {
      color: 'grey'
    }
  },
  selected: {
    background: '#484848',
    color: 'white',
    '&:hover': {
      color: 'inherit'
    }
  }
});

const MenuListHorizontalComponent = props => {
  const { classes, items, location } = props;

  return (
    <div>
      {items.map((item, index) => {
        switch (item.type) {
          case 'button':
            return (
              <Link
                key={index}
                className={classNames(
                  item.link === location.pathname && classes.selected,
                  classes.root
                )}
                to={item.link}
              >
                {item.text}
              </Link>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const MenuListHorizontal = withStyles(styleMenuListHorizontalComponent)(
  withRouter(MenuListHorizontalComponent)
);

/*
 * Module exports.
 */

export { MenuList, MenuListWithButton, MenuListHorizontal };
