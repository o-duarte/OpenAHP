import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TreeView from '../widgets/treeView'
import strings from '../../strings'
import GPSlider from './gpslider'
import PSlider from './pslider'
import VSlider from './vslider';

import {
    CURRENT_USER_SINGLE_PROBLEM,
  } from '../../graphql';


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
      },
  });

class Editor extends Component{

    render() {
        const {classes} = this.props;
        return(
           <div className={classes.root}>
                <Grid container spacing={16}>
                    <Grid item xs={2}>
                        <Paper className={classes.treeView}>
                        <Typography variant="h6" gutterBottom>
                            {strings.criteria}
                        </Typography>
                        <TreeView/>
                        </Paper>
                    </Grid>
                    <Grid item xs={10}>
                        <Paper className={classes.paper}>
                            xs=6
                        <GPSlider/>
                        <VSlider/>
                        <PSlider/>
                            
                        </Paper>
                    </Grid>
                </Grid>
            </div> 
        )
    }
}

export default withStyles(styles)(Editor);