import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

class Fluid extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number
  };

  static defaultProps = {
    xs: 12,
    sm: 12,
    md: 12
  };

  render() {
    const { xs, sm, md, children } = this.props;

    return (
      <Grid
        container
        alignContent="center"
        alignItems="center"
        justify="center"
        spacing={0}
      >
        <Grid item xs={xs} sm={sm} md={md}>
          {children}
        </Grid>
      </Grid>
    );
  }
}

export default Fluid;
