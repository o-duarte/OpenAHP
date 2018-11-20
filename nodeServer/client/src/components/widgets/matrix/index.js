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
    treeView: {
        minWidth: '150px',
        padding: '12px',
        textAlign: 'left',
        color: theme.palette.text.secondary,
        overflow: 'auto',
      },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    item:{
        cursor: 'pointer',
        margin: 20 ,
    }

  });

class Matrix extends Component{

    render() {
        const { classes } = this.props;
        console.log(this.props.data)
        const {data} = this.props
        return(
            <div className={classes.root}>
                    <Grid container spacing={16}>
                        <Grid item xs={2}>
                            
                        </Grid>
                    </Grid>
                <div>
                    {data.map((row,i) =>{
                        return(
                            <div className={classes.row}>
                                {row.map((item,j) =>{
                                    return(
                                        <div key={[i,j]} className={classes.item} 
                                                onClick={(e) => { e.stopPropagation(); console.log(i,j)   }}>
                                            <Typography>{item}</Typography>
                                        </div>
                                    )
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