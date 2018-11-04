import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import Grid from '@material-ui/core/Grid';
import { Hidden } from '@material-ui/core';

const styles = {
  root: {
    width: 310,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto'
  },
  slider: {
    padding: '8px 0px',
    overflow: 'hidden',
  },
  thumb: {
    width: 8,
    height: 8,
  },
  thumbIconWrapper: {
    backgroundColor: '#fff',
  },
  track: {
    backgroundColor: '#9c9a9a',
  },

  noPadding:{
    padding: 0,
    margin: 0,
  }
};

class PSlider extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div>
        <Typography variant='subtitle1'>Comparar la relativa importancia respeto a: criterio </Typography>
        <Grid container spacing={8}>
                    <Grid item xs={3}>
                        <Typography variant="h6" align='right' gutterBottom>
                        ab
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.root}>
                        <Typography variant='caption' id="psl">
                            <pre className={classes.noPadding}>9  8  7  6  5  4  3  2  1  |  1  2  3  4  5  6  7  8  9</pre>
                          </Typography>
                          <Slider
                            aria-labelledby="psl"
                            classes={{ 
                              container: classes.slider,
                              thumb: classes.thumb
                            }}
                            value={value}
                            min={-9}
                            max={9}
                            step={1}
                            onChange={this.handleChange}
                          />
                      </div>   
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="h6" align='left' gutterBottom>
                        c
                        </Typography>
                    </Grid>
        </Grid>
      </div>
    );
  }
}

Slider.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PSlider);