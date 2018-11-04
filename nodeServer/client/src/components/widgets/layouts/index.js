import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FullScreen from './FullScreen';
import Centered from './Centered';
import Fluid from './Fluid';
import LayoutPermanentMenu from './LayoutPermanentMenu';
import LayoutShiftMenu from './LayoutShiftMenu';
import LayoutResponsiveMenu from './LayoutResponsiveMenu';
import LayoutWithTabs from './LayoutWithTabs';
import Loading from './Loading'

const LayoutTypes = {
  LAYOUT_SHIFT_MENU: 1,
  LAYOUT_PERMANENT_MENU: 2,
  LAYOUT_RESPONSIVE_MENU: 3
};

class Layout extends Component {
  static propTypes = {
    type: PropTypes.oneOf([
      LayoutTypes.LAYOUT_SHIFT_MENU,
      LayoutTypes.LAYOUT_PERMANENT_MENU,
      LayoutTypes.LAYOUT_RESPONSIVE_MENU
    ]).isRequired,
    menuItems: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    headerContent: PropTypes.node,
    direction: PropTypes.string
  };

  static defaultProps = {
    headerContent: null,
    direction: 'left'
  };

  render() {
    const { type, menuItems, headerContent, direction, children } = this.props;

    switch (type) {
      case LayoutTypes.LAYOUT_PERMANENT_MENU:
        return (
          <LayoutPermanentMenu
            menuItems={menuItems}
            headerContent={headerContent}
            direction={direction}
          >
            {children}
          </LayoutPermanentMenu>
        );
      case LayoutTypes.LAYOUT_SHIFT_MENU:
        return (
          <LayoutShiftMenu
            menuItems={menuItems}
            headerContent={headerContent}
            direction={direction}
          >
            {children}
          </LayoutShiftMenu>
        );
      case LayoutTypes.LAYOUT_RESPONSIVE_MENU:
        return (
          <LayoutResponsiveMenu
            menuItems={menuItems}
            headerContent={headerContent}
            direction={direction}
          >
            {children}
          </LayoutResponsiveMenu>
        );
      default:
        return null;
    }
  }
}

export { Layout, LayoutTypes, FullScreen, Centered, Fluid, LayoutWithTabs, Loading };
