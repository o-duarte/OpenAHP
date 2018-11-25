import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
//
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

//
import {CURRENT_USER as query, CURRENT_USER_PROBLEMS, PROBLEM_NEW} from '../../graphql';
import { problemsTabItems } from './config.js';
import { LayoutWithTabs } from '../widgets/layouts';
import { Loading, Centered} from '../widgets/layouts';
import strings from '../../strings';


/*
 * Private components.
 */
function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  

const stylesTabContentComponent = theme => ({
    root: {
        maxWidth: '100%',
        alignItems: 'baseline',
        margin: 10
    },
    
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#ffffff',
        },
        textDecoration: 'none'
    },
    
});

const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
  }))(TableCell);
  
  

class TabContentComponent extends React.Component {
    constructor() {
        super();

    };

    componentDidMount(){
        const { refetch } = this.props.data;
        refetch();
    };

    render(){
        const { classes } = this.props;
        console.log(classes)
        const { currentUserProblems, loading, error } = this.props.data;
        if (loading) {
            return (
                <Loading/>
            );
        } else if (error) {
            return <h1>Error</h1>;
        } else {
            console.log(currentUserProblems);
            if (currentUserProblems.length > 0) {
                return (
                    <div className={classes.root}>
                        <Table className={classes.table}>
                            
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="dense"><Typography variant='h6'>Problema</Typography></TableCell>
                                    <TableCell padding="dense"><Typography variant='h6'>Objetivo</Typography></TableCell>
                                    <TableCell padding="dense"><Typography variant='h6'>Autor</Typography></TableCell>
                                    <TableCell padding="dense"><Typography variant='h6'>Ultima edicion</Typography></TableCell>
                                    <TableCell padding="dense"><Typography variant='h6'>Ultima resolucion</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentUserProblems.map( n => {
                                    const url = `/dashboard/ahp/${n.id}`;
                                    const update = n.updatedAt.split(" ")
                                    const updateTime = update[4].split(':')

                                    return (
                                        <TableRow key={n.id} hover component={Link} to={url} className={classes.row}>
                                            <CustomTableCell component="th" 
                                                             scope="row"
                                                             padding="dense"><Typography>{n.name}</Typography></CustomTableCell>
                                            <CustomTableCell padding="dense"><Typography>{n.goal}</Typography></CustomTableCell>
                                            <CustomTableCell padding="dense"><Typography>{n.owner.fullname}</Typography></CustomTableCell>
                                            <CustomTableCell padding="dense"><Typography>{updateTime[0]+':'+updateTime[1]+" | "+update[2]+' '+update[1]+' '+update[3]}</Typography></CustomTableCell>
                                            <CustomTableCell padding="dense"><Typography>{n.owner.fullname}</Typography></CustomTableCell>
                                            
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                );
            } else {
                return (
                    <div className={classes.root}>
                        <Centered>
                            <Typography variant='h4'>Sin Resultados</Typography>
                        </Centered>
                    </div>
                );
            }
        }
    }


};

const TabContent = graphql(CURRENT_USER_PROBLEMS, {
    options: ({ status }) => ({ variables: { status } })
})(withStyles(stylesTabContentComponent)(TabContentComponent));

const styleNewProblemButtonComponent = theme => ({
    button: {
        position: 'fixed',
        bottom: 20,
        right: 20
    },
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
    },
});

class newProblemButtonComponent extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
        this.state = {
            open: false,
            name: ''
         };
    }  
    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
      };
    

    onClick() {
        this.props.mutate({
            variables: {name :this.state.name},
            refetchQueries: [{ query }]
        }).then(({ data }) => {
            this.props.history.push(`/dashboard/ahp/${data.problemNew.id}`)
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Button
                    variant="fab"
                    color="primary"
                    aria-label= "new document"
                    className={classes.button}
                    onClick={this.handleOpen}
                >
                    <Icon>add</Icon>
                </Button>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="h6" id="modal-title">
                        {strings.new}
                    </Typography>
                    <TextField
                        id="outlined-name"
                        label= {strings.name}
                        className={classes.textField}
                        value={this.state.name}
                        onChange={this.handleChange('name')}
                        margin="normal"
                        variant="outlined"
                    />
                    <Button variant="outlined" color="primary" 
                            className={classes.button} onClick={() => this.onClick()}>
                         Crear
                    </Button>

                    </div>
            </Modal>
          </div>
        );
    }
}


const NewProblemButton =
    graphql(PROBLEM_NEW)(
    withStyles(styleNewProblemButtonComponent)(
    withRouter(newProblemButtonComponent)));

/*
 * Exported components.
 */

class DashboardLayoutProcess extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTabValue: 'all'
        };

        this.onTabChange = this.onTabChange.bind(this);
    }
    

    onTabChange(value) {
        this.setState({ activeTabValue: value });
    }



    render() {
        return (
            <div>
                <LayoutWithTabs
                    tabItems={problemsTabItems}
                    onChangeCallback={this.onTabChange}
                    initialTab={this.state.activeTabValue}
                >
                    <TabContent status={this.state.activeTabValue}
                                innerRef={(step) => { this.Tabcontent = step; }}
                    />
                </LayoutWithTabs>
                <NewProblemButton/>
            </div>
        );
    }
}

export default DashboardLayoutProcess;