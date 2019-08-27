import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
//import {compose, graphql} from "react-apollo/index";
//import Paper from '@material-ui/core/Paper';
//import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: '12px',
      overflow: 'auto',
      minWidth: '600px',
      marginTop: 20,
      display: 'flex',
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
        transition: "0.3s",
        backgroundColor: "#9e9e9e",
        "-webkit-border-radius": "8px",
        "-moz-border-radius": "8px",
        "border-radius": "8px",
        '&:hover': {
            backgroundColor: "#1e88e5",
            "-webkit-border-radius": "8px",
            "-moz-border-radius": "8px",
            "border-radius": "8px",
        }
        
    },
    optionalItem:{
        margin: 20 ,
    },
    center:{
        justifyContent: 'center',
        
    },
    whiteText:{
        color:"rgba(255,255,255,1)"
    }
    

  });

class Matrix extends Component{
    matrixData(data, index) {
        if(index===-1){
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
        var headers = []
        if(index === -1){
            headers = []
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
                headers = []
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
        return(
            <div className={classes.root}>
                <div className={classes.col}>
                    <div className={classes.yheader}><Typography align="justify">&nbsp;</Typography></div>
                    {headers.map((head) =>{
                        return(
                            <div className={classes.optionalItem}>
                                    <Typography align="justify" noWrap="true">{head}</Typography>
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
                                    <div key={[i,j]} className={classes.item}
                                        onClick={(e) => { e.stopPropagation();
                                                this.props.onSelectedMatrixItem(j,i)}}>
                                            <Typography align="center" className={classes.whiteText}>
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
