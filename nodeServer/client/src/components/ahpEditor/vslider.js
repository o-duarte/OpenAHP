import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import Grid from '@material-ui/core/Grid';
import strings from '../../strings'

const styles = {
  root: {
    width: 313,
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
  },
  diagonalL:{
    transform: 'rotate(-45deg)',
    display: 'inline-block',
    width: '1px',
    margin: '0px'
  },
  diagonal:{
    transform: 'rotate(-45deg)',
    display: 'inline-block',
    width: '1px',
    marginRight: '38px',
    marginTop: 0,
    marginBottom: 0,
  },
  caption:{
    display: 'inline-block',
    marginTop: '40px '
  },
  criteria:{
    paddingTop: '40px',
  }
};

class DiagonalComponent extends React.Component{
  render(){
    const {classes} = this.props;
    var {text} = this.props;
    const {L} = this.props;
    if(L=='L') {
      return(
        <pre className={classes.diagonalL}>
        {text}
        </pre>
      )
    }
    else {
      return(
        <pre className={classes.diagonal}>
        {text}
        </pre>
      )
    }
  }
}

const Diagonal = withStyles(styles)(DiagonalComponent)

class VSlider extends React.Component {
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
                        <div className ={classes.criteria}> 
                          <Typography variant="h6" align='right' gutterBottom>
                          ab
                          </Typography>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.root}>
                        <div className={classes.caption}>
                          <Typography variant='caption' id="psl">
                            <Diagonal text={strings.extreme}/>
                            <Diagonal text={strings.vStrong} />
                            <Diagonal text={strings.strong}/>
                            <Diagonal text={strings.moderate} />
                            <Diagonal text={strings.equal}/>
                            <Diagonal text={strings.moderate}/>
                            <Diagonal text={strings.strong}/>
                            <Diagonal text={strings.vStrong}/>
                            <Diagonal text={strings.extreme} L='L'/>
                          </Typography> 
                        </div>
                        <Slider
                            classes={{ 
                              container: classes.slider,
                              thumb: classes.thumb
                            }}
                            value={value}
                            min={-8}
                            max={8}
                            step={1}
                            onChange={this.handleChange}
                        />
                      </div>   
                    </Grid>
                    <Grid item xs={3}>
                        <div className ={classes.criteria}> 
                          <Typography variant="h6" align='left' gutterBottom>
                          c
                          </Typography>
                        </div>
                    </Grid>
        </Grid>
      </div>
    );
  }
}

Slider.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VSlider);