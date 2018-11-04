import React, { Component } from 'react';
import TreeData from './sample.data.js';
import './style.css';
import './font-awesome.min.css'
import strings from '../../../strings'
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  whiteText: {
    paddingTop: '3px',
    color: 'white',
    display: 'inline-block'
  },
  text: {
    display: 'inline-block'
  },
});


class Treeview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: TreeData,
      editableNode: ''
    }
  }

  addRoot = () => {
    let root = {
      name: '',
      exportValue: '',
      showChildren: true,
      editMode: true,
      children: []
    }

    this.setState({
      data: root
    });
  }

  handleEditChange = (e, value) => {
    value[e.target.name] = e.target.value;
    this.setState({ value });
  }

  deleteNode = (parent, index) => {
    parent.splice(index, 1);
    this.setState({ parent });
  }

  makeEditable = (value) => {
    this.state.editableNode = JSON.parse(JSON.stringify(value));
    value.editMode = true;
    this.setState({ value });
  }

  closeForm = (value, parent, index) => {
    if (value.name !== '' && value.exportValue !== '') {
      value.name = this.state.editableNode.name;
      value.exportValue = this.state.editableNode.exportValue;
      value.editMode = false;
      this.setState({ value });
    }
    else {
      console.log(index);
      parent.splice(index, 1);
      this.setState({ parent });
    }
  }

  doneEdit = (value) => {
    value.editMode = false;
    this.setState({ value });
  }

  toggleView = (ob) => {
    ob.showChildren = !ob.showChildren;
    this.setState({ ob });
  }

  addMember = (parent) => {
    let newChild = {
      name: '',
      exportValue: '',
      showChildren: false,
      editMode: true,
      children: []
    }
    parent.push(newChild);
    this.setState({ parent });
  }

  addChild = (node) => {
    node.showChildren = true;
    node.children.push({
      name: '',
      exportValue: '',
      showChildren: false,
      editMode: true,
      children: []
    });
    this.setState({ node });
  }

  nodeEditForm = (value, parent, index) => {
    return (
      <div className="node node_edit" onClick={(e) => { e.stopPropagation() }}>
        <form className="node_edit_form">
          <div className="field name">
            <input value={value.name}
              type="text"
              name='name'
              placeholder={strings.criteria}
              onChange={(e)=> { this.handleEditChange(e, value) }}
            />
          </div>
          <div className="field action_node">
            <span className="fa fa-check" onClick={(e)=> { this.doneEdit(value) }}></span>
            <span className="fa fa-close" onClick={(e)=> { this.closeForm(value, parent, index) }}></span>
          </div>
        </form>
      </div>
    )
  }

  makeChildren = (node) => {
    const {classes} = this.props;
    if (typeof node === 'undefined' || node.length === 0) return null;
    
    let children;
    children = node.map((value, index)=> {

      let item = null;

      // A node has children and want to show her children
      if (value.children.length > 0 && value.showChildren) {
        let babies = this.makeChildren(value.children);
        let normalMode = (
          <div className="node">
            <i className="fa fa-minus-square-o"></i><Typography className={classes.text} gutterBottom>{value.name}</Typography>
            <span className="actions">
              <i className="fa fa-close" onClick={(e)=> { e.stopPropagation(); this.deleteNode(node, index) }}></i>
              <i className="fa fa-pencil" onClick={(e)=> { e.stopPropagation(); this.makeEditable(value) }}></i>
            </span>
          </div>
        )
        item = (
          <li key={index} onClick={(e) => { e.stopPropagation(); this.toggleView(value) }}>
            {(value.editMode) ? this.nodeEditForm(value, node, index) : normalMode}
            {babies}
          </li>
        )
      }

      // A node has children but don't want to showing her children
      else if (value.children.length > 0 && !value.showChildren) {
        item = (
          <li key={index} onClick={(e)=> { e.stopPropagation(); this.toggleView(value) }}>
            <div className="node"><i className="fa fa-plus-square-o"></i><Typography className={classes.text} gutterBottom>{value.name}</Typography></div>
          </li>
        );
      }

      // A node has no children
      else if (value.children.length === 0) {
        let normalMode = (
          <div className="node"><i className="fa fa-square-o"></i><Typography className={classes.text} gutterBottom>{value.name}</Typography>
            <span className="actions">
              <i className="fa fa-plus" onClick={(e)=> { e.stopPropagation(); this.addChild(value) }}> </i>
              <i className="fa fa-pencil" onClick={(e)=> { e.stopPropagation(); this.makeEditable(value) }}></i>
              <i className="fa fa-close" onClick={(e)=> { e.stopPropagation(); this.deleteNode(node, index) }}></i>
            </span>
          </div>
        );

        item = (
          <li key={index} onClick={(e) => e.stopPropagation()}>
            {(value.editMode) ? this.nodeEditForm(value, node, index) : normalMode}
          </li>
        );
      }
      return item;
    });

    return (
      <ul >
        {children}
        <li>
          <div className="node add_node" onClick={(e)=> { e.stopPropagation();this.addMember(node) }}>
            <i className="fa fa-square" ></i>
            <a ><Typography className={classes.text} gutterBottom>{strings.addCriteria}</Typography></a>
          </div>
        </li>
      </ul>
    );
  }

  getNodes = () => {
    const {classes} = this.props;
    if (typeof this.state.data.name === 'undefined') return null;
    let children = this.makeChildren(this.state.data.children);
    let root = (
      <span className="root"><Typography className={classes.whiteText} gutterBottom>{this.state.data.name}</Typography>
        <span className="actions"> &nbsp;  &nbsp;
          <i className="fa fa-pencil" onClick={(e)=> { e.stopPropagation(); this.makeEditable(this.state.data) }}>&nbsp;&nbsp;&nbsp;</i>
          <i className="fa fa-plus" onClick={(e)=> { e.stopPropagation(); this.addChild(this.state.data) }}></i>
        </span>
      </span>

    )
    return (
      <div className="tree">
        {(this.state.data.editMode) ? this.nodeEditForm(this.state.data) : root}
        {children}
      </div>
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-offset-4 col-md-3">
          <div className="group_dropdown_content">
            {this.getNodes()}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Treeview)