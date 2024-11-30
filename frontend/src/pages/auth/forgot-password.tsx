import { Box, Card, CardContent, Typography } from '@mui/material';
import { PasswordResetForm } from '../../components/auth/PasswordResetForm';

export default function ForgotPasswordPage() {
  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <CardContent>
          <div className="text-center">
            <Typography component="h1" variant="h5">
              Reset your password
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mt-2">
              Enter your email address and we'll send you instructions to reset your password.
            </Typography>
          </div>

          <div className="mt-8">
            <PasswordResetForm />
          </div>

          <div className="text-center mt-4">
            <Typography variant="body2">
              Remember your password?{' '}
              <a href="/auth/login" className="text-primary hover:text-primary-dark">
                Sign in
              </a>
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}