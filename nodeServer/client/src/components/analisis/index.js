import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
//import ReactDOM from 'react-dom';
//
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {Typography, Divider, Button} from '@material-ui/core'
import TreeView from './treeView'
import {Bar} from 'react-chartjs'
//
import strings from '../../strings'

import { Loading, Centered } from '../widgets/layouts';
import {MACHINE_URL} from '../../config'

import {
   SENSITIVITY,
  } from '../../graphql';

import { problemToTree } from '../../utils/problemAdapterSensitivity';
import SliderList from './sliderList';

const options = {
    scaleOverride: true,
    scaleSteps: 10,
	scaleStepWidth: 0.1,
	scaleStartValue: 0,
    scales: {
        yAxes: [{
            ticks: {
                max: 0.1,
                min: 0,
            }
        }]
    }
};

const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: '12px',
      //overflow: 'auto',
      width: '95%',
      minWidth: '1100px'
    },
    paper: {
      minWidth: '300px',
      padding: '12px',
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    result: {
        maxWidth: 600,
        minWidth: 600,
        //marginTop: 15,
        padding: 10
      },
    treeView: {
        minWidth: '150px',
        padding: '12px',
        textAlign: 'left',
        color: theme.palette.text.secondary,
        overflow: 'auto',
      },
    form: {
        marginBottom: 10,
      },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
      },
    inputSelect:{
        height: 40,
    },
    row:{
        display: 'inline-flex',
    },
    button:{
        marginLeft: 10,
        marginBottom: 10
    }
  });

class Analisis extends Component{
    constructor() {
        super();
        //bind the children functions
        this.onSelectedCriteria = this.onSelectedCriteria.bind(this);

        this.state = {
          initialLoad: true,
          tree: '',
          selectedCriteria: [0],
          graphData: undefined,

        };
      }


    data(list){
        const graphData =  {
            labels: this.state.tree.alternatives,
            datasets: [
                {
                    label: strings.original,
                    fillColor: "rgba(180,180,180,0.5)",
                    strokeColor: "rgba(180,180,180,0.9)",
                    highlightFill: "rgba(180,180,180,0.75)",
                    highlightStroke: "rgba(180,180,180,1)",
                    data: list[0].map(function(each_element){
                        return Number(each_element.toFixed(3));})
                },
                {
                    label: strings.modified,
                    fillColor: "rgba(30,136,229,0.5)",
                    strokeColor: "rgba(30,136,229,0.9)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: list[1].map(function(each_element){
                        return Number(each_element.toFixed(3));})
                }
            ]
        }
        this.setState({graphData})

    }

    makeAnalisis(problemId,id,weights){
        fetch( MACHINE_URL+'/ahpanalisis/'+problemId , {
            method: "POST",
            body: JSON.stringify({id: id, weights: weights}),
            headers:{'Content-Type': 'application/json'}
        })
        .then((response) => {
            if(response.ok){
                return response.json();}
            else  {
            throw new Error("Post Failed")
            }
        }).then((responseBody) => {
            //here are the result
            this.data(responseBody)        
            return responseBody
        })
    }


    onSelectedCriteria(nodeid){
        //console.log(this.rankData(this.state.tree, nodeid))
        this.setState({selectedCriteria: nodeid })
        this.slider.setState({criterias: this.slider.weightNames(this.state.tree, nodeid),
                              list: this.slider.weightData(this.state.tree, nodeid)})
    }

    rankData(data, index) {
        if(index===-1){
            return null
        }
        else{
            var criteria
            criteria = data
            index.forEach(i => {
              criteria = criteria.children[i]  
            });

            return(criteria.rankReversal)
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        };
    
    render() {
        const { classes } = this.props;
        const { sensitivity, loading, error } = this.props.data;
        console.log(options)
        if (loading) {
            return (
                <Loading/>
            );
        } else if (error) {
            return (
                <Centered>
                    <Typography variant='h4'>{strings.noResults}</Typography>
                </Centered>);
        }
        else {
            if (this.state.initialLoad) {
                if(sensitivity==null){ return (<Centered><Typography variant='h4'>{strings.noResults}</Typography></Centered>)}
                const json = JSON.parse(sensitivity.raw);
                this.state.tree = problemToTree(json);
              
                this.state.initialLoad = false;
                //this.state.graphData = this.data(-1);
            }
            return(
            <div className={classes.root}>
                <Centered>
                    <Grid container spacing={16}>
                        <Grid item xs={2}>
                            <Paper className={classes.treeView}>
                                <Typography variant="h6" gutterBottom>
                                    {strings.criteria}
                                </Typography>
                                <Divider></Divider>
                                <TreeView tree={this.state.tree} 
                                          onSelectedCriteria={this.onSelectedCriteria}
                                          innerRef={(item) => { this.treeView = item; }}

                                          />
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <SliderList data={this.state.tree} 
                                        selectedCriteria={this.state.selectedCriteria}
                                        innerRef={(item) => { this.slider = item; }}
                                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={classes.result}>
                                <div className={classes.row}> 
                                    <Typography variant="h6" gutterBottom>{strings.results}</Typography>
                                    <Button variant="outlined" color="primary" 
                                            className={classes.button} onClick = { () => {
                                                this.makeAnalisis(this.props.problemId,
                                                                    this.state.selectedCriteria,
                                                                    this.slider.state.list)}}>
                                        {strings.calculate}
                                    </Button>
                                </div>
                                <Divider ></Divider>
                                {
                                    this.state.graphData !== undefined &&
                                    <Bar data = {this.state.graphData}  width="600" height="450"
                                        options = {options}
                                    />
                                }
                                
                            </Paper>
                        </Grid>
                    </Grid>
                    </Centered>
                </div> 
        )
    }
    }
}

export default compose(
    graphql(SENSITIVITY, {
        options: ({ sensitivityId }) => ({
            variables: { sensitivityId }
        })
    }),
)(withStyles(styles)(Analisis));