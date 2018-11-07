import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import SkipNext from '@material-ui/icons/SkipNext'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Publish from '@material-ui/icons/Publish'
import Paper from '@material-ui/core/Paper'
import Editor from './editor'
import Centered from '../widgets/layouts/Centered'

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
  return ['Datos del Problema', 'Variables de Resolucion', 'Resultados', 'Analisis de Sensibilidad'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Editor/>; 
    case 1:
      return 'What is an ad group anyways?';
    case 2:
      return 'This is the bit I really care about!';
    default:
      return 'Unknown step';
  }
}

class ProblemStepper extends React.Component {
  state = {
    activeStep: 0,
    skipped: new Set(),
  };

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

                  <IconButton
                      onClick={this.handleNext}
                      disabled={activeStep > steps.length - 1}
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
                <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                                                                                                                        
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