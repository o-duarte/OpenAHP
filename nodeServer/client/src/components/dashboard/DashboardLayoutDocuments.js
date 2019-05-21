import React, { Component } from 'react';
import { graphql,compose } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { CURRENT_USER as query ,CURRENT_USER_DOCUMENTS , DOCUMENT_NEW, DOCUMENT_DELETE } from '../../graphql';
import { documentsTabItems } from './config.js';
import { LayoutWithTabs, Loading, Centered } from '../widgets/layouts';
import { Paper, IconButton, Modal } from '@material-ui/core';
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
    margin: 20,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    alignContent: 'flex-start'
  },
  item: {
    // backgroundColor: 'red',
    // margin: '20px 0',
    flexGrow: 0,
    width: 350,
    height: 350,
    backgroundColor: 'white',
    margin: '20px 0',
    padding: 8,
    position: 'relative',
    overflow: 'hidden',
    // margin: 'auto' /* Magic! */
  },
  edit: {
    position:'absolute',
    bottom: 5,
    right:5,
    textDecoration: 'none'
  },
  delete: {
    position:'absolute',
    bottom: 5,
    left:5,
    textDecoration: 'none'
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },

});

class TabContentComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
        open: false,
        name: '',
        deleteId: undefined,
     };
}  
  componentDidMount() {
    const { refetch } = this.props.data;
    refetch();
  }
  handleOpen = (id) => {
    this.setState({ open: true });
    this.state.deleteId = id;
};

handleClose = () => {
    this.setState({ open: false });
};
handleDelete(){
  this.props.mutate({
      variables: {documentId :this.state.deleteId},
      refetchQueries: [{ query }]
  }).then(()=>{
      const { refetch } = this.props.data;
      refetch();
      this.handleClose()
  })
}

  render() {
    const { classes } = this.props;
    const { currentUserDocuments, loading, error } = this.props.data;

    if (loading) {
      return <Loading/>;
    } else if (error) {
      return <h1>Error</h1>;
    } else {
      // XXX: Check this issue: https://github.com/apollographql/react-apollo/issues/1314
      if (currentUserDocuments.length > 0) {
        return (
          <div className={classes.root}>
            <Modal
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  open={this.state.open}
                  onClose={this.handleClose}
              >
                  <div style={getModalStyle()} className={classes.paper}>
                      <Typography variant="h6" id="modal-title">
                          {strings.deleteConfirm}
                      </Typography>
                      
                      <Button variant="outlined" color="secondary" 
                              className={classes.button} onClick={() => this.handleDelete()}>
                          {strings.confirm}
                      </Button>

                  </div>
            </Modal>
            {currentUserDocuments.map(doc => {
              const url = `/editor/${doc.id}`;

              return (
                <Paper key={doc.id} className={classes.item}>
                  <Typography variant="h5" gutterBottom>
                    {doc.title}
                  </Typography>

                  <Typography variant="subtitle1" gutterBottom>
                    {doc.description + '...'}
                  </Typography>
                  <IconButton className={classes.edit} href={url} >
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton className={classes.delete} onClick={() => this.handleOpen(doc.id)} >
                    <Icon>delete</Icon>
                  </IconButton>
                </Paper>
              );
            })}
          </div>
        );
      } else {
        return (
          <div className={classes.root}>
            <Centered>
                    <Typography variant='h4'>{strings.noResults}</Typography>
            </Centered>
          </div>
        );
      }
    }
  }
}

const TabContent = 
compose( 
graphql(CURRENT_USER_DOCUMENTS, { options: ({ statusList }) => ({ variables: { statusList } })}),
graphql(DOCUMENT_DELETE))
(withStyles(stylesTabContentComponent)(TabContentComponent));

const styleNewDocumentButtonComponent = theme => ({
  button: {
    position: 'fixed',
    bottom: 25,
    right: 25
  }
});

class newDocumentButtonComponent extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props
      .mutate()
      .then(({ data }) => {
        // console.log(data.documentNew.id);
        this.props.history.push(`/editor/${data.documentNew.id}`);
      })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => error.message);
        this.setState({ errors });
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <Tooltip title="Nuevo Documento">
        <Button
          variant="fab"
          color="primary"
          aria-label="new document"
          className={classes.button}
          onClick={this.onClick}
        >
          <Icon>add</Icon>
        </Button>
      </Tooltip>
    );
  }
}

const NewDocumentButton = graphql(DOCUMENT_NEW)(
  withStyles(styleNewDocumentButtonComponent)(
    withRouter(newDocumentButtonComponent)
  )
);

/*
 * Exported components.
 */

class DashboardLayoutDocuments extends Component {
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
          tabItems={documentsTabItems}
          onChangeCallback={this.onTabChange}
          initialTab={this.state.activeTabValue}
        >
          <TabContent statusList={this.state.activeTabValue} />
        </LayoutWithTabs>

        <NewDocumentButton />
      </div>
    );
  }
}

export default DashboardLayoutDocuments;
