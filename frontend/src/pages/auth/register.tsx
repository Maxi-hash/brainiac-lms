import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, Typography, Box, Step, StepLabel, Stepper } from '@mui/material';
import { RegistrationForm } from '../../components/auth/RegistrationForm';
import { EmailVerification } from '../../components/auth/EmailVerification';

const steps = ['Account Details', 'Email Verification', 'Complete'];

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [registrationData, setRegistrationData] = useState(null);
  const router = useRouter();

  const handleRegistrationComplete = (data) => {
    setRegistrationData(data);
    setActiveStep(1);
  };

  const handleVerificationComplete = () => {
    setActiveStep(2);
    setTimeout(() => router.push('/auth/login'), 3000);
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <CardContent>
          <div className="text-center">
            <Typography component="h1" variant="h5">
              Create your account
            </Typography>
          </div>

          <Stepper activeStep={activeStep} className="my-6">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <RegistrationForm onComplete={handleRegistrationComplete} />
          )}

          {activeStep === 1 && (
            <EmailVerification 
              email={registrationData?.email}
              onComplete={handleVerificationComplete}
            />
          )}

          {activeStep === 2 && (
            <div className="text-center">
              <Typography variant="h6" color="primary">
                Registration Complete!
              </Typography>
              <Typography variant="body2" className="mt-2">
                Redirecting to login...
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}