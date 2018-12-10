import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import SkipNext from '@material-ui/icons/SkipNext'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Save from '@material-ui/icons/Save'
import Publish from '@material-ui/icons/Publish'
import Paper from '@material-ui/core/Paper'
import Play from'@material-ui/icons/PlayCircleOutline'

import Editor from './editor'
import Centered from '../widgets/layouts/Centered'
import Results from '../results'
import Sensitivity from '../sensitivity'
import Params from '../params'
import strings from '../../strings'
import { Loading } from '../widgets/layouts';
import {MACHINE_URL} from '../../config'

const styles = theme => ({
  root: {
    width: '98%',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  stepper: {
    paddingTop: '12px',
    paddingBottom: '12px',
  },
  paper: {
    display: 'flex',
    flexDirection: 'row',
  },
});

function getSteps() {
  return [strings.data, strings.params, strings.results, strings.analisis];
}


export class GetStepContent extends React.Component {
  constructor(props) {
    super(props);
  }
  handleChange = event => {
      this.setState({ [event.target.name]: event.target.value });
  };
  render(){
      const step = this.props.step;
      const { classes } = this.props;
      switch (step) {
        case 0:
          return <Editor innerRef={(step) => { this.editor = step; }}
                         problemId={this.props.problemId}
                         setResultId={this.props.setResultId}
                         setMethods={this.props.setMethods}
                         />; 
        case 1:
          return <Params innerRef={(step) => { this.params = step; }}
                         problemId={this.props.problemId}
                         setMethods={this.props.setMethods}
                         error = {this.props.error}
                         priority = {this.props.priority}
                         consistency = {this.props.consistency}/>;
        case 2:
          return <Results innerRef={(step) => { this.results = step; }}
                          resultId={this.props.resultId}
                          
                          />;
        case 3:
          return <Sensitivity innerRef={(step) => { this.sensitivity = step; }}
                              sensitivityId={this.props.sensitivityId}
                          />;
        default:
          return 'Unknown step';
      }
    }
  }


class ProblemStepper extends React.Component {
  constructor(props) {
    super(props);
    this.setResultId = this.setResultId.bind(this);
    this.setMethods = this.setMethods.bind(this);
    this.state = {
      activeStep: 0,
      skipped: new Set(),
      resultId: undefined,
      sensitivityId: undefined,
      open: false,
      priorityMethod: 0,
      consistencyMethod:0,
      errorMeasure: 0,
    };
  }
  setResultId(result_id, sensitivity_id){
    this.setState({resultId: result_id, sensitivityId: sensitivity_id});
  }
  setMethods(p,c,e){
    this.setState({priorityMethod: p,
                   consistencyMethod: c,
                   errorMeasure: e});
  }

  isStepOptional = step => {
    return false;
  };
  handleNext = () => {
    const { activeStep } = this.state;
    let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped,
    });
  };
  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };
  handleSkip = () => {
    const { activeStep } = this.state;
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values());
      skipped.add(activeStep);
      return {
        activeStep: state.activeStep + 1,
        skipped,
      };
    });
  };
  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };
  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }
  handleMutation = () => {
    this.stepContent.editor.makeMutations()
  }
  saveMethods = () => {
    this.stepContent.params.makeMutations()
  }

  handleOpen = () => {
    this.setState({ open: true });
  };
  runSolver = () => {
    fetch(MACHINE_URL+'/ahpsolver/'+this.props.problemId)
        .then((response) => {
            return response.json()
        })
        .then((recurso) => {
            console.log(recurso)
            this.setResultId(recurso.result,recurso.sensitivity)
            this.setState({ open: false });
            this.handleNext()
        })
    
  }



  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    return (
      <Centered>
        <div className={classes.root}>
          <Stepper activeStep={activeStep}  className={classes.stepper} >
            {steps.map((label, index) => {
              const props = {};
              const labelProps = {};
              if (this.isStepOptional(index)) {
                labelProps.optional = <Typography variant="caption">Optional</Typography>;
              }
              if (this.isStepSkipped(index)) {
                props.completed = false;
              }
              return (
                <Step key={label} {...props}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
              <Paper className={classes.paper}>
                  <IconButton
                      onClick={this.handleBack}
                      disabled={activeStep === 0}
                  >
                      <KeyboardArrowLeft />
                  </IconButton>
                  {this.isStepOptional(activeStep) && (
                      <IconButton
                          onClick={this.handleSkip}
                      >
                          <SkipNext />
                      </IconButton>
                  )}
                  {activeStep === 0 && (
                      <Tooltip title={strings.save} placement="top">
                        <IconButton
                          onClick={() => this.handleMutation()}
                          >
                          <Save />
                        </IconButton>
                      </Tooltip>
                  )}
                  {activeStep === 1 && (
                    <div>
                      <Tooltip title={strings.save} placement="top">
                        <IconButton
                          onClick={() =>  {this.saveMethods()}}
                          >
                          <Save />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={strings.solve} placement="top">
                        <IconButton
                          onClick={() =>  {this.handleOpen(); this.runSolver()}}
                          >
                          <Play />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}

                  <IconButton
                      onClick={this.handleNext}
                      disabled={activeStep === 1 && this.state.resultId==undefined}
                  >
                      {activeStep === steps.length - 1 ? <Publish/> : <KeyboardArrowRight/>}
                  </IconButton>
              </Paper>
              
          </Stepper>
          <div>
            {activeStep === steps.length ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&quot;re finished
                </Typography>
                <Button onClick={this.handleReset} className={classes.button}>
                  Reset
                </Button>
              </div>
            ) : (
              <div>
                <Modal aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  open={this.state.open}>
                <Loading/></Modal>
                <GetStepContent ref={(step) => { this.stepContent = step; }}
                                            step={activeStep}
                                            classes={classes}
                                            setResultId={this.setResultId}
                                            problemId={this.props.problemId}
                                            resultId={this.state.resultId}
                                            sensitivityId= {this.state.sensitivityId}
                                            setMethods = {this.setMethods}
                                            error = {this.state.errorMeasure}
                                            consistency = {this.state.consistencyMethod}
                                            priority = {this.state.priorityMethod}

                                            />
                                                                                                                        
              </div>
            )}
          </div>
        </div>
      </Centered>
    );
  }
}

ProblemStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(ProblemStepper);