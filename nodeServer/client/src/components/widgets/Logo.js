import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    fontFamily: '"Oleo Script Swash Caps", cursive',
    fontSize: '32px',
    color: '#484848',
    margin: 0,
    padding: 0
  }
};

const Logo = props => {
  const { classes } = props;
  return (
    <Typography type="headline" className={classes.root}>
      OpenChoice
    </Typography>
  );
};

Logo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Logo);
