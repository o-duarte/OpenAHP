import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
//import ReactDOM from 'react-dom';
//
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TreeView from '../widgets/treeView'
import Matrix from '../widgets/matrix'
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';

//
import strings from '../../strings'
import GPSlider from './gpslider'
import PSlider from './pslider'
import VSlider from './vslider';
import Alternatives from './alternatives'
import { Loading, Centered } from '../widgets/layouts';
import immutable from 'object-path-immutable'


import {
    CURRENT_USER_SINGLE_PROBLEM,
    PROBLEM_SAVE
  } from '../../graphql';

import { problemToTree } from '../../utils/problemAdapter';
import { treeToProblem } from '../../utils/treeAdapter';
import { deleteAlternative } from '../../utils/deleteAlternative';
import { addAlternative } from '../../utils/addAlternative';

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
        marginTop: 10,
      },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
      },
    inputSelect:{
        //height: 40,
    }
  });

class Editor extends Component{
    constructor() {
        super();
        //bind the children functions
        this.onSelectedCriteria = this.onSelectedCriteria.bind(this);
        this.onSelectedMatrixItem = this.onSelectedMatrixItem.bind(this);
        this.onChangedMatrixValue = this.onChangedMatrixValue.bind(this);
        this.onDeletedAlternative = this.onDeletedAlternative.bind(this);
        this.onAddAlternative = this.onAddAlternative.bind(this)
        this.onChangedTree = this.onChangedTree.bind(this);
        this.state = {
          initialLoad: true,
          tree: '',
          selectedCriteria: -1,
          selectedMatrixItem: [0,1],
          comparison: strings.pairwise,
          labelWidth: 100,
          verbal: strings.linear,
        };
      }
    onSelectedCriteria(nodeid){
        this.setState({selectedCriteria: nodeid, selectedMatrixItem: [0,1]})
        this.slider.onMatrixChange(this.state.tree, nodeid, [0,1]);
        this.forceUpdate()
    }
    onChangedTree(tree){
        const updatedTree = problemToTree(treeToProblem(tree))
        //console.log(updatedTree)
        this.setState({tree: updatedTree, selectedCriteria: -1,selectedMatrixItem: [0,1] })
        this.treeView.setState({data: updatedTree})
        this.matrix.setState({data: updatedTree})
        this.forceUpdate()
    }
    onSelectedMatrixItem(x,y){
        this.setState({selectedMatrixItem: [x,y]});
        this.slider.onMatrixChange(this.state.tree, this.state.selectedCriteria, [x,y]);
        this.forceUpdate()
    }
    onDeletedAlternative(index){
        const updatedTree = deleteAlternative(this.state.tree, index);
        this.setState({tree: updatedTree, selectedCriteria: -1,selectedMatrixItem: [0,1] })
        this.treeView.setState({data: updatedTree})
        this.matrix.setState({data: updatedTree})
        this.Alternatives.setState({data: updatedTree})
        this.forceUpdate()
    }
    onAddAlternative(alternative){
        const updatedTree = addAlternative(this.state.tree, alternative);
        this.setState({tree: updatedTree, selectedCriteria: -1,selectedMatrixItem: [0,1] })
        this.treeView.setState({data: updatedTree})
        this.matrix.setState({data: updatedTree})
    }
    makeMutations = () =>{
        this.props.mutate({
            variables: {
                problemId: this.props.problemId,
                rawData: JSON.stringify(treeToProblem(this.state.tree))

            }
        })
            .then(({ data }) => {
                //console.log('got data', data);
                const { refetch } = this.props.data;
                refetch();
            }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
    };
    onChangedMatrixValue(value){
        const tree = this.state.tree
        const x = this.state.selectedMatrixItem[0]
        const y = this.state.selectedMatrixItem[1]
        if(this.state.selectedCriteria === -1){
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
            this.forceUpdate()
        }
    };
    

    
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        };
    handleChangeVerval = event => {
        this.setState({ verbal: event.target.value });
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
            if (currentUserSingleProblem === null){
                return <h1>Error</h1>; 
            }
            if (this.state.initialLoad) {
                this.state.tree = problemToTree(currentUserSingleProblem);
                this.state.initialLoad = false;
                //console.log(currentUserSingleProblem)
                this.props.setMethods(currentUserSingleProblem.priorityMethod, currentUserSingleProblem.consistencyMethod, currentUserSingleProblem.errorMeasure)
                if(currentUserSingleProblem.result!=null && currentUserSingleProblem.sensitivity!=null){
                    this.props.setResultId(currentUserSingleProblem.result.id,
                                            currentUserSingleProblem.sensitivity.id,
                                            currentUserSingleProblem.probabilistic.id,)
                    
                }
            }
            return(
            <div className={classes.root}>
                <Centered>
                    <Grid container spacing={16}>
                        <Grid item xs={2}>
                            <Paper className={classes.treeView}>
                                <Typography variant="h6" gutterBottom>{strings.criteria}</Typography>
                                <Divider></Divider>
                                <TreeView tree={this.state.tree} 
                                          onSelectedCriteria={this.onSelectedCriteria}
                                          onChangedTree={this.onChangedTree}
                                          innerRef={(item) => { this.treeView = item; }}

                                          />
                            </Paper>
                        </Grid>
                        <Grid item xs={8}>
                            <Paper className={classes.paper}>
                                
                                {this.state.comparison === strings.gPairwise?  (<Centered>
                                    <GPSlider data={this.state.tree}
                                            selectedCriteria={this.state.selectedCriteria}
                                            selectedMatrixItem={this.state.selectedMatrixItem}
                                            onChangedMatrixValue={this.onChangedMatrixValue}
                                            innerRef={(item) => { this.slider = item; }}
                                            />
                                 
                                </Centered>  ): (<div/>) }
                                {this.state.comparison === strings.pairwise?  (
                                    <PSlider data={this.state.tree}
                                            selectedCriteria={this.state.selectedCriteria}
                                            selectedMatrixItem={this.state.selectedMatrixItem}
                                            onChangedMatrixValue={this.onChangedMatrixValue}
                                            innerRef={(item) => { this.slider = item; }}
                                            />): (<div/>) }
                                {this.state.comparison === strings.verbal?  (
                                    <VSlider data={this.state.tree}
                                            selectedCriteria={this.state.selectedCriteria}
                                            selectedMatrixItem={this.state.selectedMatrixItem}
                                            onChangedMatrixValue={this.onChangedMatrixValue}
                                            innerRef={(item) => { this.slider = item; }}
                                            scale={this.state.verbal}
                                            />): (<div/>) }
                                <Matrix data={this.state.tree} 
                                        selectedCriteria={this.state.selectedCriteria}
                                        selectedMatrixItem={this.state.selectedMatrixItem}
                                        onSelectedMatrixItem={this.onSelectedMatrixItem}
                                        innerRef={(item) => { this.matrix = item; }}
                                        />
                                <Divider></Divider>
                                <form autoComplete="off" className={classes.form}> 
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel
                                            htmlFor="outlined-age-simple"
                                        >
                                            {strings.comparison}
                                        </InputLabel>
                                        <Select
                                            value={this.state.comparison}
                                            onChange={this.handleChange}
                                            className={classes.inputSelect}
                                            input={
                                            <OutlinedInput
                                                labelWidth={this.state.labelWidth}
                                                name="comparison"
                                                id="outlined-age-simple"
                                            />
                                            }
                                        >   
                                            <MenuItem value={strings.pairwise}>{strings.pairwise}</MenuItem>
                                            <MenuItem value={strings.gPairwise}>{strings.gPairwise}</MenuItem>
                                            <MenuItem value={strings.verbal}>{strings.verbal}</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {this.state.comparison === strings.verbal?  (
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel
                                            htmlFor="outlined-age-simple"
                                        >
                                            {strings.scale}
                                        </InputLabel>
                                        <Select
                                            value={this.state.verbal}
                                            className={classes.inputSelect}
                                            onChange={this.handleChangeVerval}
                                            input={
                                            <OutlinedInput
                                                labelWidth={this.state.labelWidth}
                                                name="comparison"
                                                id="outlined-age-simple"
                                            />
                                            }
                                        >   
                                            <MenuItem value={strings.linear}>{strings.linear}</MenuItem>
                                            <MenuItem value={strings.balanced}>{strings.balanced}</MenuItem>
                                        </Select>
                                    </FormControl>): (<div/>) }
                                </form>
                                
                            </Paper>
                        </Grid>

                        <Grid item xs={2}>
                            <Alternatives data={this.state.tree}
                                        onDeletedAlternative={this.onDeletedAlternative}
                                        onAddAlternative={this.onAddAlternative}
                                        onChangedTree={this.onChangedTree}
                                        innerRef={(item) => { this.Alternatives = item; }}
                                        />
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
    graphql(PROBLEM_SAVE)
)(withStyles(styles)(Editor));