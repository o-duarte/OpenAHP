import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Hidden from 'material-ui/Hidden';
import Chip from 'material-ui/Chip';

import DocumentCard from '../widgets/Controls/DocumentCard';
import SiteLayout from './SiteLayout';

const query = gql`
  {
    userDocuments {
      id
      name
      description
      createdAt
      currentVersion
      owner {
        fullname
        image
      }
      tags {
        name
      }
    }

    tags {
      id
      name
      description
      createdAt
      updateAt
    }
  }
`;

const style = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  sticky: {
    position: 'sticky',
    top: 10
  },
  chip: {
    margin: '3px',
    fontSize: '11px',
    height: '2em',
    textDecoration: 'none',
    cursor: 'pointer'
  }
});

class SiteDocuments extends Component {
  renderTagsList(tags) {
    const { classes, history } = this.props;

    return (
      <div className={classes.sticky}>
        <Typography variant="h4" gutterBottom>
          Top Tags
        </Typography>
        <div className={classes.root}>
          {tags.map((tag, index) => {
            return (
              <Chip
                key={tag.id}
                label={tag.name}
                className={classes.chip}
                component={Link}
                to="/site"
              />
            );
          })}
        </div>
      </div>
    );
  }

  renderDocumentsList(userDocuments) {
    return (
      <div>
        <Typography type="header" gutterBottom>
          Últimos documentos
        </Typography>
        {userDocuments.map(doc => {
          return (
            <div key={doc.id}>
              <DocumentCard
                docId={doc.id}
                docTitle={doc.name}
                docDescription={doc.description}
                docImage="https://picsum.photos/800/600/?random"
                docCreatedAt={doc.createdAt}
                ownerFullname={doc.owner.fullname}
                ownerImage={doc.owner.image}
              />
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const { userDocuments, tags, loading, error } = this.props.data;

    if (loading) {
      return <h1>Loading</h1>;
    } else if (error) {
      return <h1>Error</h1>;
    } else {
      return (
        <Grid container>
          <Hidden xsDown>
            <Grid item xs={12} sm={4} md={4}>
              {this.renderTagsList(tags)}
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={8} md={8}>
            {this.renderDocumentsList(userDocuments)}
          </Grid>
        </Grid>
      );
    }
  }
}

export default graphql(query)(withStyles(style)(SiteDocuments));
