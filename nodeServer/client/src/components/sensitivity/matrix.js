import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
//import {compose, graphql} from "react-apollo/index";
//import Paper from '@material-ui/core/Paper';
//import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { Divider } from '@material-ui/core';
import strings from '../../strings'

const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: '12px',
      overflow: 'auto',
      minWidth: '600px',
      //marginTop: 20
    },
    paper: {
      minWidth: '300px',
      padding: '12px',
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    col: {
        display: 'inline-block',
        margin: '5px'
    },
    yheader:{
        width: '80px',
        align: 'center'
    },
    item:{
        cursor: 'pointer',
        margin: 20 ,
        fontWeight:'bold',
    },
    optionalItem:{
        margin: 20 ,
    },
    

  });

class Matrix extends Component{
    constructor() {
        super();
        this.state = {
            criteria: '',
        }
      }
    matrixData(data, index) {
        this.weightData(data, index)
        if(index===-1){
            return(
                data.rankReversal
            )
        }
        else{
            var criteria
            criteria = data
            index.forEach(i => {
              criteria = criteria.children[i]  
            });
            this.state.criteria = criteria.name
            return(criteria.rankReversal)
        }
    }
    weightData(data, index) {
        if(index===-1){
            return(
                data.weights
            )
        }
        else{
            var criteria
            criteria = data
            index.forEach(i => {
              criteria = criteria.children[i]  
            });
            return(criteria.weights)
        }
    }
    weightNames(data, index) {
        var c= [];
        if(index.length===1){
            c= [];
            data.children.map(i => {
                c.push(i.name) 
              })
            return c
        }
        else{
            var criteria
            criteria = data
            index.slice(0,-1).forEach(i => {
              criteria = criteria.children[i]  
            });
            c= [];
            criteria.children.map(i => {
                c.push(i.name) 
              })
            return c
        }
    }
    headers(data, index){
        return data.alternatives
    }  
    
    render() {
        const { classes, data, selectedCriteria } = this.props;
        const matrix = this.matrixData(data, selectedCriteria)
        const headers = this.headers(data, selectedCriteria)
        const wheightNames = this.weightNames(data, selectedCriteria)
        const wheightData = this.weightData(data, selectedCriteria)
        return(
            <div className={classes.root}>
                <Typography align="justify" variant='h6'>{strings.weights}</Typography>
                <Divider></Divider>
                <List dense={true}>
                    {wheightNames.map((alternative, index) =>{
                        return(
                            <ListItem>
                                <ListItemText
                                    className = {classes.alternative}
                                    primary={alternative}></ListItemText>
                                
                                <ListItemSecondaryAction>
                                     {Number(wheightData[index]).toFixed(2)}
                                </ListItemSecondaryAction>
                            </ListItem>
                            )
                        })}  
                </List>
                <Typography align="justify" variant='h6'>{strings.rankReversal} : {this.state.criteria}</Typography>
                <Divider></Divider>


                <div className={classes.col}>
                    <div className={classes.yheader}></div>
                    {headers.map((head) =>{
                        return(
                            <div className={classes.optionalItem}>
                                    <Typography align="justify">{head}</Typography>
                            </div>
                        )
                    })}
                </div>
                {matrix.map((row,i) =>{
                    return(
                        <div className={classes.col}>
                            <div className={classes.yheader}>
                                <Typography align="center">{headers[i]}</Typography>
                            </div>
                            {row.map((item,j) =>{
                                if(i<j){
                                    return(
                                    <div key={[i,j]} className={classes.optionalItem} >
                                            <Typography  align="center">-</Typography>
                                    </div>)
                                }
                                if(i===j){
                                    return(
                                    <div key={[i,j]} className={classes.optionalItem}>
                                            <Typography  align="center">{item}</Typography>
                                    </div>)
                                }
                                else{
                                    return(
                                    <div key={[i,j]} className={classes.item}>
                                        
                                            <Typography align="center">
                                                <b>{String(matrix[j][i]).slice(0,4)}</b>
                                            </Typography>
                                    </div>)
                                }
                            })}
                        </div>
                    )
                })}
            </div> 
        )
    }
}


export default withStyles(styles)(Matrix);