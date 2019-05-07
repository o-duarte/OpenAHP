import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
//import ReactDOM from 'react-dom';
//
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Plot from 'react-plotly.js';


//
import strings from '../../strings'

import {
    PROBABILISTIC,
  } from '../../graphql';
import { Loading, Centered } from '../widgets/layouts';
import { Typography } from '@material-ui/core';


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
        marginTop: 10,
      },
    inputSelect:{
        height: 40,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    divider:{
        marginBottom: 10,
    },
    grid:{
        justifyContent: 'center',
    }
  });

class Probabilistic extends Component{
    constructor(props) {
        super(props);
        this.state = {
          initialLoad: true,
          tree: '',
          selectedCriteria: -1,
          graphData: undefined,
          labelWidth: 50,
          
        };
      }

    boxplotdata(alternatives){
        var data = []
        alternatives.map(function(a){
            data.push({
                y: [a.min,a.q1,a.q1,a.median,a.q3,a.q3,a.max],
                boxmean: true,
                type:'box',
                name: a.name
            })
        })
        return data
        
    }
    
    
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        };

    render() {
        const { classes } = this.props;
        const { probabilistic, loading, error } = this.props.data;
        if (loading) {
            return (
                <Loading/>
            );
        } else if (error || probabilistic.alternatives===undefined) {
            return (
                <Centered>
                    <Typography variant='h4'>{strings.noResults}</Typography>
                </Centered>);
        }
        else {
            const data = this.boxplotdata(probabilistic.alternatives);
            return(
            
            <div className={classes.root}>
                
                <Centered>
                    <Grid container className={classes.grid} spacing={16}>
                        <Grid item xs={10}>
                            <Paper className={classes.paper}>
                                <Typography variant='h5' gutterBottom align='left'>{strings.rankings} </Typography>
                                <Divider className={classes.divider}></Divider>
                                <Plot
                                    data = {data}
                                    layout={{
                                        yaxis: {
                                            autorange: 'reversed',
                                        },
                                        xaxis: {
                                            type: 'category',
                                        }
                                    }}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                    </Centered>
                </div> 
        )}
            
    }
}

export default  compose(
    graphql(PROBABILISTIC, {
        options: ({ probabilisticId }) => ({
            variables: { probabilisticId }
        })
    }),)(withStyles(styles)(Probabilistic));