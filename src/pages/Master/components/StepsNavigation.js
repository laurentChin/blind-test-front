import React from "react";
import PropTypes from "prop-types";

import { STEPS, STEPS_LABELS } from "../constants";

const StepsNavigation = ({ currentStep, setStep }) => {
  return (
    <div className="steps-navigation-container">
      {currentStep.previous && (
        <button onClick={() => setStep(STEPS[currentStep.previous])}>
          {STEPS_LABELS[currentStep.previous]}
        </button>
      )}
      {currentStep.next && (
        <button onClick={() => setStep(STEPS[currentStep.next])}>
          {STEPS_LABELS[currentStep.next]}
        </button>
      )}
    </div>
  );
};

StepsNavigation.propTypes = {
  currentStep: PropTypes.object,
  setStep: PropTypes.func,
};

export { StepsNavigation };
