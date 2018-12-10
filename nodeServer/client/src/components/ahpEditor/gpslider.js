import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import strings from '../../strings';
import { Hidden, Divider } from '@material-ui/core';


const styles = {
  root: {
    maxWidth: 300,
    minWidth: 300,
    marginTop: 15,
  },
  body: {
    
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
  },
  divider:{
    marginBottom: 15,
  }
};

class GPSlider extends React.Component {
    state = {
      initialLoad: true,
      valuea: 0,
      valueb: 0,
      criteria: '',
      alternatives: [],
      sliderText: ''
  }

  getCriteria(data, selectedCriteria){
    if(selectedCriteria==-1){
       return(data.name)
    }
    else{
        var criteria
        criteria = data
        selectedCriteria.forEach(i => {
          criteria = criteria.children[i]  
        });
        return(criteria.name)
    }
  }

  getAlternatives(data, selectedCriteria, selectedMatrixItem){
    var alternatives=['','']
    if(selectedCriteria == -1){
      this.state.sliderText = strings.sliderTextImp
      var headers = []
      data.children.forEach(x => {
          headers = headers.concat([x.name])
      })
      alternatives[0] = headers[selectedMatrixItem[0]]
      alternatives[1] = headers[selectedMatrixItem[1]]
      return(alternatives)
    }
    else{
        var criteria
        criteria = data
        selectedCriteria.forEach(i => {
            criteria = criteria.children[i]  
        });
        if(criteria.children.length === 0){
            this.state.sliderText = strings.sliderTextPref
            headers = data.alternatives
        }
        else{
            this.state.sliderText = strings.sliderTextImp
            var headers = []
            criteria.children.forEach(x => {
            headers = headers.concat([x.name])
        })
        }
        alternatives[0] = headers[selectedMatrixItem[0]]
        alternatives[1] = headers[selectedMatrixItem[1]]
        return(alternatives)
    }
  }

  getValue(data, selectedCriteria, selectedMatrixItem) {
    const x = selectedMatrixItem[0]
    const y = selectedMatrixItem[1]
    if(selectedCriteria==-1){
        return(
            data.rootMatrix[x][y]
        )
    }
    else{
        var criteria
        criteria = data
        selectedCriteria.forEach(i => {
          criteria = criteria.children[i]  
        });

        return(criteria.matrix[x][y])
    }
  }

  handleChangea = (event, value) => {
    this.setState({valuea: value, valueb: - value});
    this.props.onChangedMatrixValue(this.returnValue(value))
  };



  handleChangeb = (event, value) => {
    this.setState({valueb: value, valuea: - value});
    this.props.onChangedMatrixValue(this.returnValue(-value))
  };

  returnValue(value){
    if(value>=0){
      return(value+1)
    }
    else{
      return(-Math.pow(value-1,-1))
    }
  }
  invReturnValue(value){
    if(value>=1){
      return(value-1)
    }
    else{
      return(-(Math.pow(value,-1)-1))
    }
  }

  onMatrixChange(data, selectedCriteria, selectedMatrixItem){
    const value = this.invReturnValue(this.getValue(data, selectedCriteria, selectedMatrixItem))
    this.setState({valuea: value, valueb: - value})
  }

  render() {
    const { classes, data, selectedCriteria, selectedMatrixItem } = this.props;
    this.state.alternatives = this.getAlternatives(data, selectedCriteria, selectedMatrixItem);
    this.state.criteria = this.getCriteria(data, selectedCriteria); 
    if(this.state.initialLoad){
      this.onMatrixChange(data, selectedCriteria, selectedMatrixItem)
      this.state.initialLoad = false
    } 
    const { valuea } = this.state;
    const { valueb } = this.state;

    return (
      <div className={classes.root}>
        <Typography variant='h6' gutterBottom>{this.state.sliderText} {this.state.criteria}</Typography>
        <Divider className={classes.divider}></Divider>
        <Typography id="slider-image">{this.state.alternatives[0]}</Typography>
        <Slider
          classes={{ container: classes.slider }}
          value={valuea}
          min={-10}
          max={+10}
          aria-labelledby="slider-image"
          onChange={this.handleChangea}
        />
        <Typography id="slider-icon">{this.state.alternatives[1]}</Typography>
        <Slider
          classes={{ container: classes.slider, track: classes.track, thumb: classes.track }}
          value={valueb}
          min={-10}
          max={+10}
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