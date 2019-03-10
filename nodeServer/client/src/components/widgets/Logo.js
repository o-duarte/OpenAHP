import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {

};

const Logo = props => {
  return (
    <Typography variant="h4" >
      Open<b>AHP</b>
    </Typography>
  );
};

Logo.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Logo);
