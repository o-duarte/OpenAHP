import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'

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
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    item:{
        cursor: 'pointer',
        margin: 20 ,
    },
    optionalItem:{
        margin: 20 ,
    },
    

  });

class Matrix extends Component{
    matrixData(data, index) {
        if(index==-1){
            return(
                data.rootMatrix
            )
        }
        else{
            var criteria
            criteria = data
            index.forEach(i => {
              criteria = criteria.children[i]  
            });

            return(criteria.matrix)
        }
    }
    headers(data, index){
        if(index == -1){
            var headers = []
            data.children.forEach(x => {
                headers = headers.concat([x.name])
            })
            return(headers)
        }
        else{
            var criteria
            criteria = data
            index.forEach(i => {
                criteria = criteria.children[i]  
            });
            if(criteria.children.length === 0){
                headers = data.alternatives
            }
            else{
                var headers = []
                criteria.children.forEach(x => {
                headers = headers.concat([x.name])
            })
            }
            return(headers)
        }
    }  
    
    render() {
        const { classes, data, selectedCriteria } = this.props;
        const matrix = this.matrixData(data, selectedCriteria)
        const headers = this.headers(data, selectedCriteria)
        console.log(headers)
        return(
            <div className={classes.root}>
                <div>
                    <div className={classes.row}>
                    {headers.map((head) =>{
                        return(
                            <div className={classes.optionalItem}>
                                    <Typography>{head}</Typography>
                            </div>
                        )
                    })}
                    </div>
                    {matrix.map((row,i) =>{
                        return(
                            <div className={classes.row}>
                                <div className={classes.optionalItem}>
                                    <Typography>{headers[i]}</Typography>
                                </div>
                                {row.map((item,j) =>{
                                    if(i<j){
                                        return(
                                        <div key={[i,j]} className={classes.item} 
                                                onClick={(e) => { e.stopPropagation(); console.log(i,j)}}>
                                                <Typography>{item}</Typography>
                                        </div>)
                                    }
                                    if(i==j){
                                        return(
                                        <div key={[i,j]} className={classes.optionalItem}>
                                                <Typography>{item}</Typography>
                                        </div>)
                                    }
                                    else{
                                        return(
                                        <div key={[i,j]} className={classes.optionalItem}>
                                                <Typography>-</Typography>
                                        </div>)
                                    }
                                })}
                            </div>
                        )
                    })}
                </div>

            </div> 
        )
    }
}


export default withStyles(styles)(Matrix);