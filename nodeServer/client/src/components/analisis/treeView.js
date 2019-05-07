import React, { Component } from 'react';
import './style.css';
import './font-awesome.min.css'
import strings from '../../strings'
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';


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
    //console.log(this.state.data)
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
  onNodeClick = (node,index) =>{
    if(index===-1){
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
        <div></div>
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
                    onClick={(e) => {e.stopPropagation();}}>
                    {this.state.data.name}
        </Typography>
        <span className="actions"> &nbsp;  &nbsp;
          
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