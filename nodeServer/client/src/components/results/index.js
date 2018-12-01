import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
import ReactDOM from 'react-dom';
//
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TreeView from './treeView'

//
import strings from '../../strings'

import { Loading, Centered } from '../widgets/layouts';

import {
    RESULT,
  } from '../../graphql';

import { problemToTree } from '../../utils/problemAdapter';
import { treeToProblem } from '../../utils/treeAdapter';


const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: '12px',
      //overflow: 'auto',
      width: '95%',
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
        };
      }

    onSelectedCriteria(nodeid){
        //this.setState({selectedCriteria: nodeid, selectedMatrixItem: [0,1]})
        //this.slider.onMatrixChange(this.state.tree, nodeid, [0,1]);
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
            return <h1>Error</h1>;
        } else {
            if (this.state.initialLoad) {
                const json = JSON.parse(result.raw);
                this.state.tree = problemToTree(json);
                this.state.initialLoad = false;

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
                        <Grid item xs={8}>
                            <Paper className={classes.paper}>
                                
                            </Paper>
                        </Grid>
                        <Grid item xs={2}>
                            
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