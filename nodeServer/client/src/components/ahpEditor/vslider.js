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
  body: {
    marginTop: 15,
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
    initialLoad: true,
    criteria: '',
    alternatives: [],
    sliderText: ''
  };

  handleChange = (event, value) => {
    this.setState({ value });
    this.props.onChangedMatrixValue(this.returnValue(value));
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
    if(this.props.scale==strings.balanced){
      switch(value){
        case -8: return(Math.pow(9,-1))
        case -7: return(Math.pow(5.76,-1))
        case -6: return(Math.pow(4,-1))
        case -5: return(Math.pow(3,-1))
        case -4: return(Math.pow(2.33,-1))
        case -3: return(Math.pow(1.86,-1))
        case -2: return(Math.pow(1.5,-1))
        case -1: return(Math.pow(1.22,-1))
        case 0: return(1)
        case 1: return(1.22)
        case 2: return(1.5)
        case 3: return(1.86)
        case 4: return(2.33)
        case 5: return(3)
        case 6: return(4)
        case 7: return(5.76)
        case 8: return(9)
      }
    }

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
      <div className={classes.body}>
        <Typography variant='subtitle1'>{this.state.sliderText} {this.state.criteria}</Typography>
        <Grid container spacing={8}>
                    <Grid item xs={3}>
                        <div className ={classes.criteria}> 
                          <Typography variant="h6" align='right' gutterBottom>
                          {this.state.alternatives[0]}
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
                          {this.state.alternatives[1]}
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