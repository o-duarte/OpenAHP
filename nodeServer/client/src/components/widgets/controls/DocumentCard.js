import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Card, {
  CardHeader,
  CardActions,
  CardContent,
  CardMedia
} from 'material-ui/Card';

const style = {
  card: {
    maxWidth: '100%',
    marginBottom: 20,
    borderRadius: 15
    // boxShadow: 'none'
  },
  media: {
    height: 200
  }
};

class DocumentCard extends Component {
  static propTypes = {
    docId: PropTypes.string.isRequired,
    docTitle: PropTypes.string.isRequired,
    docDescription: PropTypes.string.isRequired,
    docCreatedAt: PropTypes.string.isRequired,

    ownerFullname: PropTypes.string.isRequired,
    ownerImage: PropTypes.string.isRequired
  };

  render() {
    const { classes } = this.props;

    const {
      docId,
      docTitle,
      docDescription,
      docImage,
      docCreatedAt,
      ownerFullname,
      ownerImage
    } = this.props;

    return (
      <div>
        <Typography variant="h5">{docTitle}</Typography>
        <Typography variant="subtitle1">{docDescription}</Typography>

        <Button color="primary">Share</Button>
        <Button color="primary">Learn More</Button>
      </div>
    );
  }

  render2() {
    const { classes } = this.props;

    const {
      docId,
      docTitle,
      docDescription,
      docImage,
      docCreatedAt,
      ownerFullname,
      ownerImage
    } = this.props;

    return (
      <Card key={docId} className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              CC
            </Avatar>
          }
          action={
            <IconButton>
              <Icon>more_vert</Icon>
            </IconButton>
          }
          title={ownerFullname}
          subheader={moment(docCreatedAt).fromNow()}
        />
        <CardMedia
          className={classes.media}
          image={docImage}
          title={docTitle}
        />
        <CardContent>
          <Typography variant="h5" component="h2">
            {docTitle}
          </Typography>
          <Typography component="p">{docDescription}</Typography>
        </CardContent>
        <CardActions>
          <Button color="primary">Share</Button>
          <Button color="primary">Learn More</Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(style)(DocumentCard);
