import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
    display: 'flex',
    backgroundColor: 'inherit'
    // backgroundImage: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)'
    // backgroundImage: 'linear-gradient(to top, #dfe9f3 0%, white 100%)'
    // backgroundImage:'linear-gradient(to top, #d5d4d0 0%, #d5d4d0 1%, #eeeeec 31%, #efeeec 75%, #e9e9e7 100%)'
  }
});

class FullScreen extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    const { classes, children } = this.props;
    return <div className={classes.root}>{children}</div>;
  }
}

export default withStyles(styles)(FullScreen);
