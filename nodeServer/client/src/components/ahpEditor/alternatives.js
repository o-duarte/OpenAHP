import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
import classNames from 'classnames';

import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/AddCircleOutline'
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';


import strings from '../../strings'
import {Centered} from '../widgets/layouts'

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
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
      },
    icon: {
        margin: theme.spacing.unit,
        fontSize: 16,
      },
    container: {
        display: 'inline-flex',
        flexDirection: 'row',
    },
    dense: {
        //marginTop: 16,
    },
    inputSelect:{
        height: 40,
    }
  });

class Alternatives extends Component{
    constructor() {
        super();
        this.state = {
            name: '',
        }
      }

    handleDelete = (index) => {
        this.props.onDeletedAlternative(index); 
    };
    handleChange = name => event => {
        this.setState({
        [name]: event.target.value,
        });
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
                                                            //className={classes.icon}
                                                            fontSize="small" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )
                            })}
                </List>
                <Divider/>
                <div className={classes.container}>
                    <TextField
                        id="outlined-name"
                        label={strings.newAlternative}
                        className={classNames(classes.textField, classes.dense)}
                        value={this.state.name}
                        onChange={this.handleChange('name')}
                        margin="dense"
                        variant="outlined"
                    />  
                    <Centered>
                        <IconButton aria-label="add">
                            <AddIcon onClick={() =>this.handleDelete(3)}
                                        //className={classes.icon}
                                        />
                        </IconButton>
                    </Centered>  
                    
                </div>
                
                
            </Paper> 
        )
    }
}


export default withStyles(styles)(Alternatives);