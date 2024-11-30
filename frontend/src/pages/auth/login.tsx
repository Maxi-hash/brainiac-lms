import { useState } from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import { LoginForm } from '../../components/auth/LoginForm';
import { Card, CardContent, Typography, Divider, Box } from '@mui/material';
import { GoogleLoginButton, MicrosoftLoginButton, GithubLoginButton } from '../../components/auth/OAuthButtons';

export default function LoginPage() {
  const [authError, setAuthError] = useState('');

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8">
        <CardContent>
          <div className="text-center">
            <Typography component="h1" variant="h5">
              Sign in to Brainiac LMS
            </Typography>
          </div>

          {authError && (
            <Typography color="error" className="text-center mt-2">
              {authError}
            </Typography>
          )}

          <LoginForm onError={setAuthError} />

          <Divider className="my-6">or continue with</Divider>

          <div className="space-y-4">
            <GoogleLoginButton />
            <MicrosoftLoginButton />
            <GithubLoginButton />
          </div>

          <div className="text-center mt-4">
            <Typography variant="body2">
              Don't have an account?{' '}
              <a href="/auth/register" className="text-primary hover:text-primary-dark">
                Sign up
              </a>
            </Typography>
            <Typography variant="body2" className="mt-2">
              <a href="/auth/forgot-password" className="text-primary hover:text-primary-dark">
                Forgot your password?
              </a>
            </Typography>
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}