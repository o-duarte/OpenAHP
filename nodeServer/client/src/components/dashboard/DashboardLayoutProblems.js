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
//
import {CURRENT_USER as query, CURRENT_USER_PROBLEMS} from '../../graphql';
import { problemsTabItems } from './config.js';
import { LayoutWithTabs } from '../widgets/layouts';
import { Loading } from '../widgets/layouts';



/*
 * Private components.
 */

const stylesTabContentComponent = {
    root: {
        maxWidth: '100%',
        alignItems: 'baseline',
        margin: 10
    }
};

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
                                    <TableCell padding="dense"><Typography>Problema</Typography></TableCell>
                                    <TableCell padding="dense"><Typography>Objetivo</Typography></TableCell>
                                    <TableCell padding="dense"><Typography>Autor</Typography></TableCell>
                                    <TableCell padding="dense"><Typography>Ultima edicion</Typography></TableCell>
                                    <TableCell padding="dense"><Typography>Ultima resolucion</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentUserProblems.map( n => {
                                    const url = `/dashboard/ahp/${n.id}`;
                                    return (
                                        <TableRow key={n.id} hover component={Link} to={url}>
                                            <TableCell padding="dense">{n.name}</TableCell>
                                            <TableCell padding="dense">{n.goal}</TableCell>
                                            <TableCell padding="dense">{n.owner.fullname}</TableCell>
                                            <TableCell padding="dense">{n.owner.fullname}</TableCell>
                                            <TableCell padding="dense">{n.owner.fullname}</TableCell>
                                            
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
                        <p>No elements...</p>
                    </div>
                );
            }
        }
    }


};

const TabContent = graphql(CURRENT_USER_PROBLEMS, {
    options: ({ status }) => ({ variables: { status } })
})(withStyles(stylesTabContentComponent)(TabContentComponent));

const styleNewDocumentButtonComponent = theme => ({
    button: {
        position: 'fixed',
        bottom: 20,
        right: 20
    }
});

class newDocumentButtonComponent extends Component {
    constructor(props) {
        super(props);

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.mutate({
            refetchQueries: [{ query }]
        }).then(({ data }) => {
            console.log('got data', data);
            this.props.history.push(`/dashboard/process/edit/${data.processNew.id}`)
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <Button
                variant="fab"
                color="primary"
                aria-label="new document"
                className={classes.button}
                onClick={this.onClick}
            >
                <Icon>add</Icon>
            </Button>
        );
    }
}

/*
const NewDocumentButton =
    graphql(PROCESS_NEW)(
    withStyles(styleNewDocumentButtonComponent)(
    withRouter(newDocumentButtonComponent)));
/*

/*
 * Exported components.
 */

class DashboardLayoutProcess extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTabValue: 'draft'
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

            </div>
        );
    }
}

export default DashboardLayoutProcess;