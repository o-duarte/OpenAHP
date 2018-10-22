import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import  { Tab } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';

const styles = theme => ({
  root: {
    flexGrow: 1,
    boxShadow: 'none',
    margin: 0,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  }
});

class LayoutWithTabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.initialTab
    };

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  static propTypes = {
    classes: PropTypes.object.isRequired,
    tabItems: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    initialTab: PropTypes.string.isRequired,
    onChangeCallback: PropTypes.func
  };

  static defaultProps = {
    onChangeCallback: () => {}
  };

  handleOnChange = (event, value) => {
    this.props.onChangeCallback(value);
    this.setState({ value });
  };

  render() {
    const { classes, tabItems, children } = this.props;

    return (
      <div>
        <Paper className={classes.root}>
          <Tabs
            value={this.state.value}
            onChange={this.handleOnChange}
            indicatorColor="primary"
            textColor="primary"
          >
            {tabItems.map((item, index) => {
              return <Tab key={index} value={item.value} label={item.label} />;
            })}
          </Tabs>
        </Paper>

        <div>{children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(LayoutWithTabs);
