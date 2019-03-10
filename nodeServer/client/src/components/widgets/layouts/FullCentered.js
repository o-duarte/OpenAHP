import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  }
};

const FullCentered = props => {
  const { classes, children } = props;

  return <div className={classes.root}>{children}</div>;
};

FullCentered.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FullCentered);
