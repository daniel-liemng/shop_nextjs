import { Stepper, Step, StepLabel } from '@mui/material';
import React from 'react';

const CheckoutWizard = ({ activeStep = 0 }) => {
  const steps = ['Login', 'Shipping Address', 'Payment Method', 'Place Order'];

  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ margin: '30px 0' }}>
      {steps.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutWizard;
