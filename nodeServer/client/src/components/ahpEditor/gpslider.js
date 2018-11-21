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
    valuea: 0,
    valueb: 0,
  };

  handleChangea = (event, value) => {
    this.setState({valuea: value });
    this.setState({valueb: - value})
  };

  handleChangeb = (event, value) => {
    this.setState({valueb: value });
    this.setState({valuea: - value})
  };

  returnValue(value){
    if(value>=0){
      return(value+1)
    }
    else{
      return(-Math.pow(value-1,-1))
    }
  }

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
          min={-10}
          max={+10}
          aria-labelledby="slider-image"
          onChange={this.handleChangea}
        />
        <Typography id="slider-icon">subcriteria b</Typography>
        <Slider
          classes={{ container: classes.slider, track: classes.track, thumb: classes.track }}
          value={valueb}
          min={-10}
          max={+10}
          aria-labelledby="slider-icon"
          onChange={this.handleChangeb}
        />
        {this.state.valuea}----
        {this.returnValue(this.state.valuea)}
      </div>
    );
  }
}

Slider.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GPSlider);