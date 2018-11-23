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
import immutable from 'object-path-immutable'
import {
    CURRENT_USER_SINGLE_PROBLEM,
    PROBLEM_SAVE
  } from '../../graphql';

import { problemToTree } from '../../utils/problemAdapter';
import { treeToProblem } from '../../utils/treeAdapter';

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
        this.onSelectedMatrixItem = this.onSelectedMatrixItem.bind(this);
        this.onChangedMatrixValue = this.onChangedMatrixValue.bind(this);
        this.state = {
          initialLoad: true,
          tree: '',
          selectedCriteria: -1,
          selectedMatrixItem: [0,1]
        };
      }
    onSelectedCriteria(nodeid){
        this.setState({selectedCriteria: nodeid, selectedMatrixItem: [0,1]})
        this.slider.onMatrixChange(this.state.tree, nodeid, [0,1]);
    }
    onSelectedMatrixItem(x,y){
        this.setState({selectedMatrixItem: [x,y]});
        this.slider.onMatrixChange(this.state.tree, this.state.selectedCriteria, [x,y]);

    }
    makeMutations = () => { 
        console.log('make')
    }

    onChangedMatrixValue(value){
        const tree = this.state.tree
        const x = this.state.selectedMatrixItem[0]
        const y = this.state.selectedMatrixItem[1]
        if(this.state.selectedCriteria == -1){
            const newTree = immutable.set(tree, 'rootMatrix.'+String(x)+'.'+String(y), value)
            this.setState({tree: newTree})
            this.forceUpdate()
        }
        else{
            var path = ""
            this.state.selectedCriteria.forEach(i => {
                path = path + "children."+String(i)+"."
            }); 
            path = path + "matrix."+String(x)+'.'+String(y)
            const newTree = immutable.set(tree, path, value)
            this.setState({tree: newTree})
            this.forceUpdate
        }

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
                            
                            <GPSlider data={this.state.tree}
                                      selectedCriteria={this.state.selectedCriteria}
                                      selectedMatrixItem={this.state.selectedMatrixItem}
                                      onChangedMatrixValue={this.onChangedMatrixValue}
                                      innerRef={(item) => { this.slider = item; }}
                                    />

                            <Matrix data={this.state.tree} 
                                    selectedCriteria={this.state.selectedCriteria}
                                    selectedMatrixItem={this.state.selectedMatrixItem}
                                    onSelectedMatrixItem={this.onSelectedMatrixItem}
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
    graphql(PROBLEM_SAVE)
)(withStyles(styles)(Editor));