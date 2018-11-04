import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto'
  }
};

const Centered = props => {
  const { classes, children } = props;

  return <div className={classes.root}>{children}</div>;
};

Centered.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Centered);
