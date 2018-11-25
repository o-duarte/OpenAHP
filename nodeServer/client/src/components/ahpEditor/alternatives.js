import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import strings from '../../strings'

const styles = theme => ({
    root: {
      padding: '12px',
      overflow: 'auto',
      minWidth: '180px',
      width: '200px',
      textAlign: 'left',
    },
    paper: {
      minWidth: '300px',
      padding: '12px',
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    icon: {
        margin: theme.spacing.unit,
        fontSize: 16,
      },
  });

class Alternatives extends Component{
    constructor() {
        super();

      }

    handleDelete = (index) => {
        console.log(index); 
    };
    

    render() {
        const { classes, data } = this.props;
        const alternatives = data.alternatives
        
        return(
            <Paper className={classes.root}>
                 <Typography variant="h6" gutterBottom>
                    {strings.alternatives}
                </Typography>
                <List dense={true}>
                {alternatives.map((alternative, index) =>{
                            return(
                                    <ListItem>
                                        <ListItemText
                                            primary={alternative}
                                            />
                                        <ListItemSecondaryAction>
                                            <IconButton aria-label="Delete">
                                                <DeleteIcon onClick={() =>this.handleDelete(index)}
                                                            className={classes.icon} />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })}
                </List>
            </Paper> 
        )
    }
}


export default withStyles(styles)(Alternatives);