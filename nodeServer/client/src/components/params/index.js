import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { graphql} from "react-apollo/index";
//import ReactDOM from 'react-dom';
//
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

//
import strings from '../../strings'

import {
    UPDATE_METHODS
  } from '../../graphql';

import {  Centered,  } from '../widgets/layouts';
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
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
      }
  });

class Params extends Component{
    constructor(props) {
        super(props);
        this.state = {
          initialLoad: true,
          tree: '',
          selectedCriteria: -1,
          graphData: undefined,
          labelWidth: 50,
          consistency: props.consistency,
          error: props.error,
          priority: props.priority,
          generator: props.generator,
          beta: 1/props.beta,
          order: props.order
        };
      }

    


    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        };

    handleChangeSw = event => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    makeMutations = () =>{  
        
        var beta = this.state.beta
        if(beta === undefined || beta==='0'){
            this.setState({beta: 1})
            beta=1
        }
        if(beta<0){
            beta=-beta
            this.setState({beta: beta})
        }
        this.props.setMethods(this.state.priority, this.state.consistency, this.state.error,
            this.state.generator ,1/beta, this.state.order)
        this.props.mutate({
            variables: {
                problemId: this.props.problemId,
                priority: this.state.priority,
                consistency: this.state.consistency,
                error: this.state.error,
                beta: 1/beta,
                generator: this.state.generator,
                order: this.state.order
            }
        })
            .then(({ data }) => {
                
            }).catch((error) => {
            console.log('there was an error sending the query', error);
        });
        
    };


    render() {
        const { classes } = this.props;
            return(
            
            <div className={classes.root}>
                
                <Centered>
                    <Grid container className={classes.grid} spacing={16}>
                        <Grid item xs={8}>
                            <Paper className={classes.paper}>
                                <Typography variant='h6' gutterBottom align='left'>{strings.methods} </Typography>
                                <Divider className={classes.divider}></Divider>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel
                                        htmlFor="outlined-age-simple"
                                    >
                                        {strings.consistency}
                                    </InputLabel>
                                    <Select
                                        value={this.state.consistency}
                                        onChange={this.handleChange}
                                        input={
                                        <OutlinedInput
                                            labelWidth = {90}
                                            name= "consistency"
                                            id="outlined-age-simple"
                                        />
                                        }
                                    >
                                        <MenuItem value={0}>{strings.cIndex}</MenuItem>
                                        <MenuItem value={1}>{strings.cRatio}</MenuItem>
                                        <MenuItem value={2}>{strings.cDet}</MenuItem>
                                        <MenuItem value={3}>{strings.cIndexG}</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel
                                        htmlFor="outlined-age-simple"
                                    >
                                        {strings.error}
                                    </InputLabel>
                                    <Select
                                        value={this.state.error}
                                        onChange={this.handleChange}
                                        input={
                                        <OutlinedInput
                                            labelWidth = {90}
                                            name= "error"
                                            id="outlined-age-simple"
                                        />
                                        }
                                    >
                                        <MenuItem value={0}>{strings.errDes}</MenuItem>
                                        <MenuItem value={1}>{strings.errPri}</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel
                                        htmlFor="outlined-age-simple"
                                    >
                                        {strings.priority}
                                    </InputLabel>
                                    <Select
                                        value={this.state.priority}
                                        onChange={this.handleChange}
                                        input={
                                        <OutlinedInput
                                            labelWidth = {90}
                                            name= "priority"
                                            id="outlined-age-simple"
                                        />
                                        }
                                    >
                                        <MenuItem value={0}>{strings.priMean}</MenuItem>
                                        <MenuItem value={1}>{strings.priVec}</MenuItem>
                                        <MenuItem value={2}>{strings.pricol}</MenuItem>
                                    </Select>
                                </FormControl>
                                <Divider className={classes.divider}></Divider>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel
                                        htmlFor="outlined-age-simple"
                                    >
                                        {strings.random}
                                    </InputLabel>
                                    <Select
                                        value={this.state.generator}
                                        onChange={this.handleChange}
                                        input={
                                        <OutlinedInput
                                            labelWidth = {90}
                                            name= "generator"
                                            id="outlined-age-simple"
                                        />
                                        }
                                    >
                                        <MenuItem value={0}>{strings.simple}</MenuItem>
                                        <MenuItem value={1}>{strings.gamma}</MenuItem>
                                    </Select>
                                </FormControl>
                                {this.state.generator===1? 
                                <TextField
                                        id="standard-number"
                                        label={strings.pScale}
                                        value={this.state.beta}
                                        onChange={this.handleChange}
                                        type="number"
                                        name="beta"
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        margin="normal"
                                        /> : null
                                    
                                }
                                <FormControlLabel
                                    control={
                                        <Switch
                                        checked={this.state.order}
                                        onChange={this.handleChangeSw}
                                        name="order"
                                        color="primary"
                                        />
                                    }
                                    label={strings.preserveRank}
                                />
                            </Paper>
                        </Grid>
                    </Grid>
                    </Centered>
                </div> 
        )
    
    }
}

export default  graphql(UPDATE_METHODS)(withStyles(styles)(Params));