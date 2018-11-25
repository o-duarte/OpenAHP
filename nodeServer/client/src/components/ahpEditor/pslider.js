import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import Grid from '@material-ui/core/Grid';
import { Hidden } from '@material-ui/core';
import strings from '../../strings';

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
    initialLoad: true,
    criteria: '',
    alternatives: [],
    sliderText: ''
  };
  handleChange = (event, value) => {
    this.setState({ value });
    this.props.onChangedMatrixValue(this.returnValue(value))
  };
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
    this.setState({value: value})
  }
  render() {
    const { value } = this.state;
    const { classes, data, selectedCriteria, selectedMatrixItem } = this.props;
    this.state.alternatives = this.getAlternatives(data, selectedCriteria, selectedMatrixItem);
    this.state.criteria = this.getCriteria(data, selectedCriteria); 
    if(this.state.initialLoad){
      this.onMatrixChange(data, selectedCriteria, selectedMatrixItem)
      this.state.initialLoad = false
    } 
    return (
      <div>
        <Typography variant='subtitle1'>{this.state.sliderText} {this.state.criteria}</Typography>
        <Grid container spacing={8}>
                    <Grid item xs={3}>
                        <Typography variant="h6" align='right' gutterBottom>
                          {this.state.alternatives[0]}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.root}>
                        <Typography variant='caption' id="psl">
                            <pre className={classes.noPadding}>10 9  8  7  6  5  4  3  2  |  2  3  4  5  6  7  8  9 10</pre>
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
                        {this.state.alternatives[1]}
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