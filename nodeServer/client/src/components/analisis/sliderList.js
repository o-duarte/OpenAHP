import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';
import strings from '../../strings';
import { Hidden, Divider, Paper } from '@material-ui/core';

const styles = {
    root: {
      maxWidth: 300,
      minWidth: 300,
      //marginTop: 15,
      padding: 10
    },
    list: {
      marginBottom: 20,
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
  

class SliderList extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      list: this.weightData(props.data, props.selectedCriteria),
      criterias: this.weightNames(props.data, props.selectedCriteria)
    };
  }
  handleChange = (value, index) => {
    var zeroCount = 0    
    this.state.list.forEach((item) => {
        if (item === 0) {
            zeroCount++
    }})
    var newList = this.state.list
    newList[index] = value
    var sum = newList.reduce(function(a, b) { return a + b; }, 0);
    if(zeroCount===this.state.criterias.length-1){zeroCount=0;}
    const alpha = (sum-1)/(this.state.criterias.length-zeroCount-1)
    newList = newList.map(function(element) { return element-alpha; });
    newList[index] = value
    newList = newList.map(function(element) { if (element<0) {return 0;} else{ return element} });
    this.setState({list: newList})
    //console.log(newList)

    /* old algorithm
    const alpha = ( (value-this.state.list[index]) / (this.state.criterias.length-1) )
    console.log(alpha)
    var newList = this.state.list.map(function(element) { return element-alpha; });
    newList = newList.map(function(element) { if (element<0) {return 0;} if (element>1) {return 1;} else{ return element} });
    newList[index] = value
    this.setState({list: newList})
    console.log(newList)
    */
  };
  weightData(data, index) {
    if(index==-1){
        return(
            data.weights
        )
    }
    else{
        var criteria
        criteria = data
        index.forEach(i => {
          criteria = criteria.children[i]  
        });
        return(criteria.weights)
    }
}
weightNames(data, index) {
    console.log(index)
    if(index.length==1){
        var c= [];
        data.children.map(i => {
            c.push(i.name) 
          })
        console.log(c)
        return c
    }
    else{
        var criteria
        criteria = data
        index.slice(0,-1).forEach(i => {
          criteria = criteria.children[i]  
        });
        var c= [];
        criteria.children.map(i => {
            c.push(i.name) 
          })
        console.log(c)
        return c
    }
}
  
  render(){
    const { classes, selectedCriteria, data } = this.props;
    //this.state.criterias = this.weightNames(data, selectedCriteria)
    //this.state.list = this.weightData(data, selectedCriteria)
    return (
      <Paper className={classes.root}>
        <Typography variant='h6' gutterBottom>{strings.weights}</Typography>
        <Divider className={classes.list}/>
         {this.state.criterias.map((alternative, index) =>{
                    return(
                        <div>
                        <Typography align='center'>{this.state.criterias[index]} : {Number(this.state.list[index]).toFixed(3)}</Typography> 
                        <Slider
                            classes={{ container: classes.slider }}
                            value={this.state.list[index]}
                            min={0}
                            max={1}
                            aria-labelledby="slider-image"
                            onChange={(event, value)=> { event.stopPropagation(); this.handleChange(value,index) }}
                        />
                        <Divider className={classes.divider}/>
                        </div>
                    )})}
      </Paper>
    )
  }
}

Slider.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(SliderList);