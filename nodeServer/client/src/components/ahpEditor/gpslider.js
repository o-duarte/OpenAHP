import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

const styles = {
  root: {
    maxWidth: 300,
    minWidth: 300,
  },
  slider: {
    padding: '12px 0px',
    overflow: 'hidden'
    
  },
  thumbIcon: {
    borderRadius: '50%',
  },
  thumbIconWrapper: {
    backgroundColor: '#fff',
  },
  track: {
    backgroundColor: '#9c9a9a',
  }
};

class GPSlider extends React.Component {
  state = {
    valuea: 50,
    valueb: 50,
  };

  handleChangea = (event, value) => {
    this.setState({valuea: value });
    this.setState({valueb: 100 - value})
  };

  handleChangeb = (event, value) => {
    this.setState({valueb: value });
    this.setState({valuea: 100 - value})
  };

  render() {
    const { classes } = this.props;
    const { valuea } = this.state;
    const { valueb } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant='subtitle1'>Comparar la relativa importancia respeto a: criterio </Typography>
        <Typography id="slider-image">subcriteria a</Typography>
        <Slider
          classes={{ container: classes.slider }}
          value={valuea}
          aria-labelledby="slider-image"
          onChange={this.handleChangea}
        />
        <Typography id="slider-icon">subcriteria b</Typography>
        <Slider
          classes={{ container: classes.slider, track: classes.track, thumb: classes.track }}
          value={valueb}
          aria-labelledby="slider-icon"
          onChange={this.handleChangeb}
        />
      </div>
    );
  }
}

Slider.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GPSlider);