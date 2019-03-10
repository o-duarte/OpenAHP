import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {compose, graphql} from "react-apollo/index";
import ReactDOM from 'react-dom';
//
import Tooltip from '@material-ui/core/Tooltip';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import TreeView from './treeView'
import {Bar} from 'react-chartjs'
import Divider from '@material-ui/core/Divider';
import Cloud from '@material-ui/icons/CloudDownloadOutlined'
import IconButton from '@material-ui/core/IconButton';

//
import strings from '../../strings'
import ReactExport from "react-data-export";

import { Loading, Centered } from '../widgets/layouts';

import {
    RESULT,
  } from '../../graphql';

import { problemToTree } from '../../utils/problemAdapterResult';
import { resultToRows } from '../../utils/resultToRows';


const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: '12px',
      //overflow: 'auto',
      width: '95%',
      minWidth: '1100px'
    },
    paper: {
      minWidth: '300px',
      padding: '12px',
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    treeView: {
        minWidth: '150px',
        padding: '12px',
        textAlign: 'left',
        color: theme.palette.text.secondary,
        overflow: 'auto',
      },
    form: {
        marginBottom: 10,
      },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
      },
    inputSelect:{
        height: 40,
    },
    download:{
        display: 'flex',
        alignItems: 'baseline',
    },
  });

  class Download extends React.Component {
    render() {
        const {Rows ,cols} = this.props.data
        const columns = Array.from(Array(cols+1).keys())
        return (
            <ExcelFile element={<Tooltip title={strings.downloadResults} placement="top"><IconButton><Cloud/></IconButton></Tooltip>}>
                  <ExcelSheet data={Rows} name="rankings">
                    {columns.map((column) =>
                        <ExcelColumn  label="criteria" value={(column+1).toString()}/>
                    )}
                    <ExcelColumn label="Alternative" value="alternative"/>
                    <ExcelColumn label="Ranking" value="rank"/>
                    
                </ExcelSheet>
             </ExcelFile>
        );
    }
}
class Results extends Component{
    constructor() {
        super();
        //bind the children functions
        this.onSelectedCriteria = this.onSelectedCriteria.bind(this);

        this.state = {
          initialLoad: true,
          tree: '',
          selectedCriteria: -1,
          graphData: undefined,
          error: undefined,
          consistency: undefined,
          name: undefined,      
        };
      }
    
    data(nodeid){
        
        return {
            labels: this.state.tree.alternatives,
            datasets: [
                {
                    label: "My Second dataset",
                    fillColor: "rgba(30,136,229,0.5)",
                    strokeColor: "rgba(30,136,229,0.9)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: this.rankData(this.state.tree, nodeid)
                }
            ]
        }
    }



    onSelectedCriteria(nodeid){
        //console.log(this.eycData(this.state.tree, nodeid)[1]);
        this.setState({graphData: this.data(nodeid), selectedCriteria: nodeid })
        this.setState({consistency: this.eycData(this.state.tree, nodeid)[0],
                       error: this.eycData(this.state.tree, nodeid)[1],
                       name: this.eycData(this.state.tree, nodeid)[2],
                      
        })
    }

    eycData(data, index) {
        if(index==-1){
            return(
                [data.consistency, data.error, data.name]
            )
        }
        else{
            var criteria
            criteria = data
            index.forEach(i => {
              criteria = criteria.children[i]  
            });

            return([criteria.consistency, criteria.error, criteria.name])
        }
    }


    rankData(data, index) {
        if(index==-1){
            return(
                data.ranking
            )
        }
        else{
            var criteria
            criteria = data
            index.forEach(i => {
              criteria = criteria.children[i]  
            });

            return(criteria.ranking)
        }
    }

    generateReport(data,cols){
        const columns = Array.from(Array(cols).keys())
        return(
        <ExcelFile>
            <ExcelSheet data={data} name="rankings">
                {columns.map((column) =>
                    <ExcelColumn  value={column.toString()}/>
                )}
                <ExcelColumn label="Alternative" value="alternative"/>
                <ExcelColumn label="Ranking" value="ranking"/>
                
            </ExcelSheet>
        </ExcelFile>
        )
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        };
    
    render() {
        const { classes } = this.props;
        const { result, loading, error } = this.props.data;
        if (loading) {
            return (
                <Loading/>
            );
        } else if (error) {
            return (
                <Centered>
                    <Typography variant='h4'>{strings.noResults}</Typography>
                </Centered>);
        }
        else {
            if (this.state.initialLoad) {
                if(result==null){ return (<Centered><Typography variant='h4'>{strings.noResults}</Typography></Centered>)}
                const json = JSON.parse(result.raw);
                this.state.tree = problemToTree(json);
                this.state.initialLoad = false;
                this.state.graphData = this.data(-1);
                this.state.consistency = this.eycData(this.state.tree, -1)[0];
                this.state.error = this.eycData(this.state.tree, -1)[1]
                this.state.name = this.eycData(this.state.tree, -1)[2]
            }  
            return(
            <div className={classes.root}>
                
                <Centered>
                    <Grid container spacing={16}>
                        <Grid item xs={2}>
                            <Paper className={classes.treeView}>
                                <Typography variant="h6" gutterBottom>
                                    {strings.criteria}
                                </Typography>
                                <TreeView tree={this.state.tree} 
                                          onSelectedCriteria={this.onSelectedCriteria}
                                          innerRef={(item) => { this.treeView = item; }}

                                          />
                            </Paper>
                        </Grid>
                        <Grid item xs={10}>
                            <Paper className={classes.paper}>
                            <div className={classes.download}>
                                <Typography align="left" variant='h5' gutterBottom>
                                        {strings.rank}: {this.state.name}
                                </Typography>
                                
                                <Download data={resultToRows(JSON.parse(result.raw))} ></Download>
                                
                            </div>
                            
                            <Divider></Divider>
                            <Bar data={this.state.graphData}  width="600" height="250"/>
                            <Typography align="right">
                                {strings.error} : <b>{Number(this.state.error).toFixed(2)}</b> %
                            </Typography>
                            <Typography align="right">
                                {strings.inconsistency} : <b>{Number(this.state.consistency).toFixed(2)}</b> 
                            </Typography>
                                
                            </Paper>
                        </Grid>
                    </Grid>
                    </Centered>
                </div> 
        )
    }
    }
}

export default compose(
    graphql(RESULT, {
        options: ({ resultId }) => ({
            variables: { resultId }
        })
    }),
)(withStyles(styles)(Results));