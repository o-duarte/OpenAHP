import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import { MenuListWithButton } from '../widgets/menuList';
import Logo from '../widgets/Logo';
import { Fluid } from '../widgets/layouts';
import { TextEditor } from '../widgets/texteditor';

import {
  CURRENT_USER_SINGLE_DOCUMENT,
  DOCUMENT_SAVE_CONTENT
} from '../../graphql';

const style = theme => ({
  flex: theme.custom.globals.flex,
  appBar: {
    backgroundColor: 'white',
    boxShadow: 'none',
    color: 'inherit',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  toolbar: {
    height: 50
  }
});

const editorOptionsItems = [
  {
    type: 'button',
    link: '/dashboard/docs',
    icon: 'dashboard',
    text: 'Dashboard'
  },
  {
    type: 'button',
    link: '/profile',
    icon: 'account_box',
    text: 'Perfil'
  }
];

class EditorLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notificationText: ''
    };

    this.notificationCallback = this.notificationCallback.bind(this);
    this.saveCallback = this.saveCallback.bind(this);
  }

  componentDidMount() {
    const { refetch } = this.props.data;
    refetch();
  }

  notificationCallback(notificationText) {
    this.setState({ notificationText });
  }

  saveCallback({ html, raw }) {
    const { currentUserSingleDocument } = this.props.data;

    const blocks = raw.getBlockMap();

    let blockTexts = [];
    blocks.map(item => {
      blockTexts.push(item.getText());
    });

    this.props
      .mutate({
        variables: {
          documentId: currentUserSingleDocument.id,
          title: blockTexts[0],
          description: blockTexts[1].substring(0, 250),
          html,
          raw: JSON.stringify(raw)
        }
      })
      .then(({ data }) => {
        console.log('got data', data);
      })
      .catch(error => {
        console.log('there was an error sending the query', error);
      });
  }

  render() {
    const { classes } = this.props;
    const { currentUserSingleDocument, loading, error } = this.props.data;

    if (loading) {
      return <h1>Loading</h1>;
    } else if (error) {
      return <h1>Error</h1>;
    } else {
      return (
        <div>
          <AppBar position="sticky" className={classes.appBar}>
            <Toolbar disableGutters className={classes.toolbar}>
              <Fluid md={8} sm={10}>
                <div className={classes.flex}>
                  <Logo />

                  <div className={classes.flex}>
                    <Typography variant="caption">
                      {this.state.notificationText}
                    </Typography>

                    <IconButton
                      color="primary"
                      className={classes.button}
                      aria-label="Back"
                      component={Link}
                      to="/dashboard/docs"
                    >
                      <Icon>undo</Icon>
                    </IconButton>
                    <MenuListWithButton
                      component={<Icon>apps</Icon>}
                      items={editorOptionsItems}
                    />
                  </div>
                </div>
              </Fluid>
            </Toolbar>
          </AppBar>
          <Fluid md={8} sm={10}>
            <TextEditor
              htmlSupport
              markdownSupport
              initialContent={currentUserSingleDocument.content.html}
              notificationCallback={this.notificationCallback}
              saveCallback={this.saveCallback}
            />
          </Fluid>
        </div>
      );
    }
  }
}

export default compose(
  graphql(CURRENT_USER_SINGLE_DOCUMENT, {
    options: ({ documentId }) => ({
      variables: { documentId }
    })
  }),
  graphql(DOCUMENT_SAVE_CONTENT)
)(withStyles(style)(EditorLayout));
