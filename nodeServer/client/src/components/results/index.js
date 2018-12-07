import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
import ReactDOM from 'react-dom';
//
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TreeView from './treeView'
import {Bar} from 'react-chartjs'
import Divider from '@material-ui/core/Divider';

//
import strings from '../../strings'

import { Loading, Centered } from '../widgets/layouts';

import {
    RESULT,
  } from '../../graphql';

import { problemToTree } from '../../utils/problemAdapterResult';



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
      },
    inputSelect:{
        height: 40,
    }
  });

class Results extends Component{
    constructor() {
        super();
        //bind the children functions
        this.onSelectedCriteria = this.onSelectedCriteria.bind(this);

        this.state = {
          initialLoad: true,
          tree: '',
          selectedCriteria: -1,
          graphData: undefined,
          error: undefined,
          consistency: undefined      
        };
      }
    
    data(nodeid){
        
        return {
            labels: this.state.tree.alternatives,
            datasets: [
                {
                    label: "My Second dataset",
                    fillColor: "rgba(30,136,229,0.5)",
                    strokeColor: "rgba(30,136,229,0.9)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: this.rankData(this.state.tree, nodeid)
                }
            ]
        }
    }

    onSelectedCriteria(nodeid){
        //console.log(this.eycData(this.state.tree, nodeid)[1]);
        this.setState({graphData: this.data(nodeid), selectedCriteria: nodeid })
        this.setState({consistency: this.eycData(this.state.tree, nodeid)[0],
                       error: this.eycData(this.state.tree, nodeid)[1]
                      
        })
    }

    eycData(data, index) {
        console.log(data)
        if(index==-1){
            return(
                [data.consistency, data.error]
            )
        }
        else{
            var criteria
            criteria = data
            index.forEach(i => {
              criteria = criteria.children[i]  
            });

            return([criteria.consistency, criteria.error])
        }
    }


    rankData(data, index) {
        console.log(data)
        if(index==-1){
            return(
                data.ranking
            )
        }
        else{
            var criteria
            criteria = data
            index.forEach(i => {
              criteria = criteria.children[i]  
            });

            return(criteria.ranking)
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        };
    
    render() {
        const { classes } = this.props;
        const { result, loading, error } = this.props.data;
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
                const json = JSON.parse(result.raw);
                this.state.tree = problemToTree(json);
                this.state.initialLoad = false;
                this.state.graphData = this.data(-1);
                this.state.consistency = this.eycData(this.state.tree, -1)[0];
                this.state.error = this.eycData(this.state.tree, -1)[1]
            }  
            console.log(this.state.graphData)
            return(
            <div className={classes.root}>
                <Centered>
                    <Grid container spacing={16}>
                        <Grid item xs={2}>
                            <Paper className={classes.treeView}>
                                <Typography variant="h6" gutterBottom>
                                    {strings.criteria}
                                </Typography>
                                <TreeView tree={this.state.tree} 
                                          onSelectedCriteria={this.onSelectedCriteria}
                                          innerRef={(item) => { this.treeView = item; }}

                                          />
                            </Paper>
                        </Grid>
                        <Grid item xs={10}>
                            <Paper className={classes.paper}>
                            <Typography align="left" variant='h5' gutterBottom>
                                    {strings.rank}
                                </Typography>   
                                <Divider></Divider>
                                <Bar data={this.state.graphData}  width="600" height="250"/>
                                <Typography align="right">
                                    {strings.error} : <b>{Number(this.state.error).toFixed(2)}</b> %
                                </Typography>
                                <Typography align="right">
                                    {strings.inconsistency} : <b>{Number(this.state.consistency).toFixed(2)}</b> 
                                </Typography>
                                
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
    graphql(RESULT, {
        options: ({ resultId }) => ({
            variables: { resultId }
        })
    }),
)(withStyles(styles)(Results));