import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
import classNames from 'classnames';
import immutable from 'object-path-immutable'

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/AddCircleOutline'
import Check from '@material-ui/icons/CheckCircleOutline'
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';

import Popover from '@material-ui/core/Popover';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';


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
    },
    typography: {
        margin: theme.spacing.unit * 2,
    },
    alternative: {
        cursor: 'pointer',         
    }
  });

class Alternatives extends Component{
    constructor() {
        super();
        this.state = {
            name: '',
            openPopover: null,
            anchorEl: null,
            alternativeChange: ''
        }
      }
    handleDelete = (index) => {
        this.props.onDeletedAlternative(index); 
    };
    handleAdd = (index) => {
        this.props.onAddAlternative(this.state.name); 
        this.setState({name: ''})
    };
    handleChange = name => event => {
        this.setState({
        [name]: event.target.value,
        });
    };

    handleOpen = (event, index, alternative)=>{
        console.log(event)
        this.setState({
            openPopover: index,
            anchorEl: event.currentTarget,
            alternativeChange: alternative
            });
    }
    handleClose = () => {
        this.setState({
          openPopover: null,
        });
      };

    
    handleChangeAlternative(index){
        const newTree = immutable.set(this.props.data, 'alternatives.'+String(index), this.state.alternativeChange)
        this.setState({data: newTree})
        this.props.onChangedTree(newTree)
        this.setState({openPopover: null});
    }
    render() {
        const { classes, data } = this.props;
        const alternatives = data.alternatives
        
        return(
            <Paper className={classes.root}>
                 <Typography variant="h6" gutterBottom >
                    {strings.alternatives}
                </Typography>
                <List dense={true}>
                {alternatives.map((alternative, index) =>{
                    return(
                        <ListItem>
                            <ListItemText
                                className = {classes.alternative}
                                primary={alternative}
                                onClick={(e) => this.handleOpen(e, index, alternative)}/>
                            <Popover
                                    open={this.state.openPopover==index}
                                    anchorEl={this.state.anchorEl}
                                    anchorOrigin={{
                                        vertical: 'center',
                                        horizontal: 'left',
                                        }}
                                    transformOrigin={{
                                        vertical: 'center',
                                        horizontal: 'left',
                                        }}
                                    onClose={this.handleClose}
                                    >
                                    <div className={classes.container}>
                                        <TextField
                                            id="outlined-name"
                                            label={strings.newAlternative}
                                            className={classNames(classes.textField, classes.dense)}
                                            value={this.state.alternativeChange}
                                            onChange={this.handleChange('alternativeChange')}
                                            margin="dense"
                                            variant="outlined"
                                        />  
                                        <Centered>
                                            <IconButton aria-label="add">
                                                <Check onClick={() =>this.handleChangeAlternative(index)}
                                                            //className={classes.icon}
                                                            />
                                            </IconButton>
                                        </Centered>  
                                        
                                    </div>
                            </Popover>
                            <ListItemSecondaryAction>
                                <IconButton aria-label="Delete">
                                    <DeleteIcon onClick={() => this.handleDelete(index)}
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
                            <AddIcon onClick={() =>this.handleAdd()}
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