import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TreeView from '../widgets/treeView'
import Matrix from '../widgets/matrix'
import strings from '../../strings'
import GPSlider from './gpslider'
import PSlider from './pslider'
import VSlider from './vslider';
import { Loading } from '../widgets/layouts';

import {
    CURRENT_USER_SINGLE_PROBLEM,
  } from '../../graphql';

import { problemToTree } from '../../utils/treeAdapter';

const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: '12px',
      overflow: 'auto',
      minWidth: '600px'
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
  });

class Editor extends Component{
    constructor() {
        super();
        //bind the children functions
        this.onSelectedCriteria = this.onSelectedCriteria.bind(this);
        this.state = {
          tree: '',
          selectedCriteria: -1,
          initialLoad: true,
        };
      }
    onSelectedCriteria(nodeid){
        this.setState({selectedCriteria: nodeid})
    }

    render() {
        const { classes } = this.props;
        const { currentUserSingleProblem, loading, error } = this.props.data;
        if (loading) {
            return (
                <Loading/>
            );
        } else if (error) {
            return <h1>Error</h1>;
        } else {
            if (this.state.initialLoad) {
                this.state.tree = problemToTree(currentUserSingleProblem);
                this.state.initialLoad = false;
            }
            return(
            <div className={classes.root}>
                    <Grid container spacing={16}>
                        <Grid item xs={2}>
                            <Paper className={classes.treeView}>
                                <Typography variant="h6" gutterBottom>
                                    {strings.criteria}
                                </Typography>
                                <TreeView tree={this.state.tree} 
                                          onSelectedCriteria={this.onSelectedCriteria}
                                          onChangedtree={''}
                                          />
                            </Paper>
                        </Grid>
                        <Grid item xs={10}>
                            <Paper className={classes.paper}>
                                xs=6
                            <GPSlider/>
                            <VSlider/>
                            <PSlider/>
                            <Matrix data={this.state.tree} 
                                    selectedCriteria={this.state.selectedCriteria}
                                    />
                            </Paper>
                        </Grid>
                    </Grid>
                </div> 
        )
    }
    }
}

export default compose(
    graphql(CURRENT_USER_SINGLE_PROBLEM, {
        options: ({ problemId }) => ({
            variables: { problemId }
        })
    }),
    //graphql(PROCESS_UPDATE_RECORD)
)(withStyles(styles)(Editor));