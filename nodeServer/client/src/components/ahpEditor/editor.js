import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
import ReactDOM from 'react-dom';
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
//
import strings from '../../strings'
import GPSlider from './gpslider'
import PSlider from './pslider'
import VSlider from './vslider';
import Alternatives from './alternatives'
import { Loading, Centered} from '../widgets/layouts';
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
        display: 'flex',
        flexWrap: 'wrap',
      },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
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
          selectedMatrixItem: [0,1],
          comparison: strings.pairwise,
          labelWidth: 100,
          verval: strings.linear,
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
    };
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
                                          onChangedtree={''}
                                          />
                            </Paper>
                        </Grid>
                        <Grid item xs={8}>
                            <Paper className={classes.paper}>
                                <form autoComplete="off"> 
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel
                                            htmlFor="outlined-age-simple"
                                        >
                                            {strings.comparison}
                                        </InputLabel>
                                        <Select
                                            value={this.state.comparison}
                                            onChange={this.handleChange}
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
                                            <MenuItem value={strings.verval}>{strings.verval}</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {this.state.comparison == strings.verval?  (
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel
                                            htmlFor="outlined-age-simple"
                                        >
                                            {strings.scale}
                                        </InputLabel>
                                        <Select
                                            value={this.state.verval}
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
                                {this.state.comparison == strings.gPairwise?  (<Centered>
                                    <GPSlider data={this.state.tree}
                                            selectedCriteria={this.state.selectedCriteria}
                                            selectedMatrixItem={this.state.selectedMatrixItem}
                                            onChangedMatrixValue={this.onChangedMatrixValue}
                                            innerRef={(item) => { this.slider = item; }}
                                            />
                                 
                                </Centered>  ): (<div/>) }
                                {this.state.comparison == strings.pairwise?  (
                                    <PSlider data={this.state.tree}
                                            selectedCriteria={this.state.selectedCriteria}
                                            selectedMatrixItem={this.state.selectedMatrixItem}
                                            onChangedMatrixValue={this.onChangedMatrixValue}
                                            innerRef={(item) => { this.slider = item; }}
                                            />): (<div/>) }
                                {this.state.comparison == strings.verval?  (
                                    <VSlider data={this.state.tree}
                                            selectedCriteria={this.state.selectedCriteria}
                                            selectedMatrixItem={this.state.selectedMatrixItem}
                                            onChangedMatrixValue={this.onChangedMatrixValue}
                                            innerRef={(item) => { this.slider = item; }}
                                            />): (<div/>) }
                                <Matrix data={this.state.tree} 
                                        selectedCriteria={this.state.selectedCriteria}
                                        selectedMatrixItem={this.state.selectedMatrixItem}
                                        onSelectedMatrixItem={this.onSelectedMatrixItem}
                                        />
                            </Paper>
                        </Grid>
                        <Grid item xs={2}>
                            <Alternatives data={this.state.tree}/>
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