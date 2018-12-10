import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
import ReactDOM from 'react-dom';
//
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TreeView from './treeView'
import Matrix from './matrix'
import {Bar} from 'react-chartjs'
//
import strings from '../../strings'

import { Loading, Centered } from '../widgets/layouts';

import {
   SENSITIVITY,
  } from '../../graphql';

import { problemToTree } from '../../utils/problemAdapterSensitivity';



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

class Sensitivity extends Component{
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
    

    onSelectedCriteria(nodeid){
        //console.log(this.rankData(this.state.tree, nodeid))
        this.setState({selectedCriteria: nodeid })
    }

    rankData(data, index) {
        console.log(index)
        if(index==-1){
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
                console.log(this.state.tree)
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
                                <TreeView tree={this.state.tree} 
                                          onSelectedCriteria={this.onSelectedCriteria}
                                          innerRef={(item) => { this.treeView = item; }}

                                          />
                            </Paper>
                        </Grid>
                        <Grid item xs={10}>
                            <Paper className={classes.paper}>
                                <Matrix data={this.state.tree} 
                                              selectedCriteria={this.state.selectedCriteria}
                                              innerRef={(item) => { this.matrix = item; }}
                                            />
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
)(withStyles(styles)(Sensitivity));