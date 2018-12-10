import React, { Component } from 'react';
import './style.css';
import './font-awesome.min.css'
import strings from '../../../strings'
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import immutable from 'object-path-immutable'
import objectPath from 'object-path'


const styles = theme => ({
  whiteText: {
    paddingTop: '3px',
    color: 'white',
    display: 'inline-block'
  },
  text: {
    display: 'inline-block',
    marginBottom: '5px'
  },
});


class Treeview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.tree,
      editableNode: ''
    }
  }

  updateTree(){
    console.log(this.state.data)
    var newTree = this.state.data
    this.props.onChangedTree(newTree)
    
  }
  addRoot = () => {
    let root = {
      name: 'nuevo',
      matrix: [],
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
  deleteNode = (parent, index, grand) => {
    parent.splice(index, 1);
    this.setState({ parent });
    var lastChild = false;
    //todo modularize this
    if(grand.rootMatrix === undefined){
      var path = ""
      grand.id.forEach(i => {
          path = path + "children."+String(i)+"."
      }); 
      var newTree = this.state.data
      const length = objectPath.get(newTree, path + "matrix."+String(index)).length
      if(length==1){lastChild=true;}
      for(var i=0; i<length; i++){
        newTree = immutable.del(newTree, path+'matrix.'+String(i)+'.'+String(index))
      }
      path = path + "matrix."+String(index)
      newTree = immutable.del(newTree, path)
      this.setState({data: newTree})
      this.props.onChangedTree(newTree)
    }
    else{
      var newTree = this.state.data
      const length = objectPath.get(this.state.data, "rootMatrix."+String(index)).length
      if(length==1){lastChild=true;}
      for(var i=0; i<length; i++){
        newTree = immutable.del(newTree, 'rootMatrix.'+String(i)+'.'+String(index))
      }
      newTree = immutable.del(newTree, 'rootMatrix.'+String(index))
      this.setState({data: newTree})
      this.props.onChangedTree(newTree)
    }
    //if is the last child of a node
    if(lastChild){
      var path = ""
      grand.id.forEach(i => {
          path = path + "children."+String(i)+"."
      });
      console.log(path) 
      var newTree = this.state.data
      newTree = immutable.set(newTree, path+'matrix',
        Array(this.state.data.alternatives.length).fill(null).map(() => Array(this.state.data.alternatives.length).fill(1)))
      this.setState({data: newTree})
      this.props.onChangedTree(newTree)
    }

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
      this.updateTree()
    }
    else {
      parent.splice(index, 1);
      this.setState({ parent });
      this.updateTree()
    }
  }
  doneEdit = (value) => {
    value.editMode = false;
    this.setState({ value });
    this.updateTree()
  }
  toggleView = (ob) => {
    ob.showChildren = !ob.showChildren;
    this.setState({ ob });
  }
  addMember = (parent, grand) => {
    let newChild = {
      name: strings.newCriteria,
      showChildren: false,
      editMode: true,
      children: [],
      matrix: Array(this.state.data.alternatives.length).fill(null).map(() => Array(this.state.data.alternatives.length).fill(1)),
    }
    parent.push(newChild);
    this.setState({ parent });
    this.props.onChangedTree(this.state.data)
    //update parent matrix
    if(grand.rootMatrix === undefined){
      var path = ""
      grand.id.forEach(i => {
          path = path + "children."+String(i)+"."
      }); 
      var newTree = this.state.data
      const length = objectPath.get(newTree, path + "matrix").length
      for(var i=0; i<length; i++){
        newTree = immutable.push(newTree, path+'matrix.'+String(i),1)
      }
      path = path + "matrix"
      newTree = immutable.push(newTree, path,Array(length+1).fill(1))
      this.setState({data: newTree})
      this.props.onChangedTree(newTree)
    }
    else{
      var newTree = this.state.data
      const length = objectPath.get(this.state.data, "rootMatrix").length
      for(var i=0; i<length; i++){
        newTree = immutable.push(newTree, 'rootMatrix.'+String(i),1)
      }
      newTree = immutable.push(newTree, 'rootMatrix',Array(length+1).fill(1))
      this.setState({data: newTree})
      this.props.onChangedTree(newTree)
    } 
  }
  addChild = (node, grand) => {
    node.showChildren = true;
    node.children.push({
      name: strings.subCriteria,
      showChildren: false,
      editMode: true,
      children: [],
      matrix: Array(this.state.data.alternatives.length).fill(null).map(() => Array(this.state.data.alternatives.length).fill(1)),
    });
    this.setState({ node });
    //update parent matrix 
    if(grand.rootMatrix === undefined){
      var path = ""
      node.id.forEach(i => {
          path = path + "children."+String(i)+"."
      });
      console.log(path) 
      var newTree = this.state.data
      newTree = immutable.set(newTree, path+'matrix',[[1]])
      this.setState({data: newTree})
      this.props.onChangedTree(newTree)
    }
    else{
      //this never happens
    } 
  }
  onNodeClick = (node,index) =>{
    if(index==-1){
      this.props.onSelectedCriteria(-1)  
    }
    else{
      this.props.onSelectedCriteria(node[index].id)
    }   
  };

  nodeEditForm = (value, parent, index) => {
    return (
      <div className="node node_edit" onClick={(e) => { e.stopPropagation() }}>
        <form className="node_edit_form" >
          <div className="field name">
            <input value={value.name}
              type="text"
              name='name'
              placeholder={strings.criteria}
              onChange={(e)=> { this.handleEditChange(e, value) }}
            />
          </div>
          <div className="field action_node">
            <Tooltip title={strings.acept} placement="right"><span className="fa fa-check" onClick={(e)=> { this.doneEdit(value) }}></span></Tooltip>
            <Tooltip title={strings.cancel} placement="right"><span className="fa fa-close" onClick={(e)=> { this.closeForm(value, parent, index) }}></span></Tooltip>
          </div>
        </form>
      </div>
    )
  }

  makeChildren = (node,parent) => {
    const {classes} = this.props;
    if (typeof node === 'undefined' || node.length === 0) return null;
    
    let children;
    children = node.map((value, index)=> {

      let item = null;

      // A node has children and want to show her children
      if (value.children.length > 0 && value.showChildren) {
        let babies = this.makeChildren(value.children,value);
        let normalMode = (
          <div className="node">
            <i className="fa fa-minus-square-o" onClick={(e) => { e.stopPropagation(); this.toggleView(value)}}></i>
            <Typography className={classes.text} gutterBottom>{value.name}</Typography>
            <span className="actions">
              <Tooltip title={strings.delete} placement="top"><i className="fa fa-close" 
                       onClick={(e)=> { e.stopPropagation() ;this.deleteNode(node, index, parent) }}></i></Tooltip>
              <Tooltip title={strings.edit} placement="top"><i className="fa fa-pencil" 
                       onClick={(e)=> { e.stopPropagation(); this.makeEditable(value) }}></i></Tooltip>
            </span>
          </div>
        )
        item = (
          <li key={index} onClick={(e) => { e.stopPropagation(); this.onNodeClick(node, index) }}>
            {(value.editMode) ? this.nodeEditForm(value, node, index) : normalMode}
            {babies}
          </li>
        )
      }

      // A node has children but don't want to showing her children
      else if (value.children.length > 0 && !value.showChildren) {
        item = (
          <li key={index} onClick={(e)=> { e.stopPropagation(); ; this.onNodeClick(node, index)}}>
            <div className="node"><i className="fa fa-plus-square-o"  onClick={(e)=> { this.toggleView(value) ; }}   ></i><Typography className={classes.text} gutterBottom>{value.name}</Typography></div>
          </li>
        );
      }

      // A node has no children
      else if (value.children.length === 0) {
        let normalMode = (
          <div className="node">
            <i className="fa fa-square-o"/>
            <Typography className={classes.text} gutterBottom>{value.name}</Typography>
            <span className="actions">
              <Tooltip title={strings.addSubcriteria} placement="top"><i className="fa fa-plus" 
                       onClick={(e)=> { e.stopPropagation(); this.addChild(value, node) }}> </i></Tooltip>
              <Tooltip title={strings.edit} placement="top"><i className="fa fa-pencil" 
                       onClick={(e)=> { e.stopPropagation(); this.makeEditable(value) }}></i></Tooltip>
              <Tooltip title={strings.delete} placement="top"><i className="fa fa-close" 
                       onClick={(e)=> { e.stopPropagation(); this.deleteNode(node, index, parent) }}></i></Tooltip>
            </span>
          </div>
        );

        item = (
          <li key={index} onClick={(e) => {e.stopPropagation(); this.onNodeClick(node, index) }}>
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
          <div className="node add_node" onClick={(e)=> { e.stopPropagation();this.addMember(node, parent)}}>
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
    let children = this.makeChildren(this.state.data.children, this.state.data);
    let root = (
      <span className="root">
        <Typography className={classes.whiteText} gutterBottom 
                    onClick={(e) => {e.stopPropagation(); this.onNodeClick('goal',-1) }}>
                    {this.state.data.name}
        </Typography>
        <span className="actions"> &nbsp;  &nbsp;
          <Tooltip title={strings.edit} placement="top">
          <i className="fa fa-pencil" onClick={(e)=> { e.stopPropagation(); this.makeEditable(this.state.data) }}>&nbsp;&nbsp;&nbsp;</i>
          </Tooltip>
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