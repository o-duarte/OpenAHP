import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { CURRENT_USER_DOCUMENTS, DOCUMENT_NEW } from '../../graphql';
import { documentsTabItems } from './config.js';
import { LayoutWithTabs } from '../widgets/layouts';

/*
 * Private components.
 */

const stylesTabContentComponent = {
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
    margin: '20px 0'
    // margin: 'auto' /* Magic! */
  }
};

class TabContentComponent extends Component {
  componentDidMount() {
    const { refetch } = this.props.data;
    refetch();
  }

  render() {
    const { classes } = this.props;
    const { currentUserDocuments, loading, error } = this.props.data;

    if (loading) {
      return <h1>Loading</h1>;
    } else if (error) {
      return <h1>Error</h1>;
    } else {
      // XXX: Check this issue: https://github.com/apollographql/react-apollo/issues/1314
      if (currentUserDocuments.length > 0) {
        return (
          <div className={classes.root}>
            {currentUserDocuments.map(doc => {
              const url = `/editor/${doc.id}`;

              return (
                <div key={doc.id} className={classes.item}>
                  <Typography variant="h6" gutterBottom>
                    {doc.title}
                  </Typography>

                  <Typography variant="subtitle1" gutterBottom>
                    {doc.description + '...'}
                  </Typography>
                  <Link to={url}>Editar</Link>
                </div>
              );
            })}
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
}

const TabContent = graphql(CURRENT_USER_DOCUMENTS, {
  options: ({ statusList }) => ({ variables: { statusList } })
})(withStyles(stylesTabContentComponent)(TabContentComponent));

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
