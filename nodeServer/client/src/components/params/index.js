import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
import ReactDOM from 'react-dom';
//
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

//
import strings from '../../strings'

import { Loading, Centered } from '../widgets/layouts';
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
      },
    inputSelect:{
        height: 40,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
      },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
  });

class Params extends Component{
    constructor() {
        super();
        this.state = {
          initialLoad: true,
          tree: '',
          selectedCriteria: -1,
          graphData: undefined,
          labelWidth: 50,
          consistency: 0,
          error: 0,
          priority: 0 ,
        };
      }

    


    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        };
    
    render() {
        const { classes } = this.props;
            return(
            <div className={classes.root}>
                
                <Centered>
                    <Grid container spacing={16}>
                        <Grid item xs={8}>
                            <Typography variant='h5' gutterBottom>{strings.methods} </Typography>
                            <Paper className={classes.paper}>
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
                                        <MenuItem value={3}>{strings.cIndexG}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Paper>
                        </Grid>
                    </Grid>
                    </Centered>
                </div> 
        )
    
    }
}

export default withStyles(styles)(Params);