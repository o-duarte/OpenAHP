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

    makeMutations = () =>{
        this.props.mutate({
            variables: {
                problemId: this.props.problemId,
                rawData: JSON.stringify(treeToProblem(this.state.tree))

            }
        })
            .then(({ data }) => {
                console.log('got data', data);
                const { refetch } = this.props.data;
                refetch();
            }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
    };

    componentDidMount() {
        fetch('http://localhost:3001/ahpsolver/'+this.props.problemId)
        .then((response) => {
            return response.json()
        })
        .then((recurso) => {
            console.log(recurso)
        })
      }

    
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        };
    handleChangeVerval = event => {
        this.setState({ verval: event.target.value });
        };
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
    graphql(CURRENT_USER_SINGLE_PROBLEM, {
        options: ({ problemId }) => ({
            variables: { problemId }
        })
    }),
    //graphql(PROBLEM_SAVE)
)(withStyles(styles)(Results));