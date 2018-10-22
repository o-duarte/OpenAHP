import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';

import { Layout, LayoutTypes } from '../widgets/layouts';
import { MenuListHorizontal } from '../widgets/menuList';
import Logo from '../widgets/Logo';

/**
 * Header site component.
 */

const styleSiteHeaderComponent = theme => ({
  root: {
    ...theme.custom.globals.flex,
    width: '100%',
    margin: '0 10px'
  }
});

const SiteHeaderComponent = props => {
  const { classes, menuItems } = props;
  return (
    <div className={classes.root}>
      <Logo />
      <Hidden xsDown>
        <MenuListHorizontal items={menuItems} />
      </Hidden>
    </div>
  );
};

const SiteHeader = withStyles(styleSiteHeaderComponent)(SiteHeaderComponent);

/**
 * Layout site component.
 */

const SiteLayout = props => {
  const { component, menuItems } = props;

  return (
    <Layout
      menuItems={menuItems}
      type={LayoutTypes.LAYOUT_RESPONSIVE_MENU}
      direction="top"
      headerContent={<SiteHeader menuItems={menuItems} />}
    >
      {component()}
    </Layout>
  );
};

export default SiteLayout;
