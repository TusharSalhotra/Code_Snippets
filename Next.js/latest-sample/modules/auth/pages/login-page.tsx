import { LoginForm } from '../components/login-form';
import { AuthLayout } from '../components/auth-layout';

export const metadata = {
  title: 'Login - Sample Admin',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" description="Sign in to your account">
      <LoginForm />
    </AuthLayout>
  );
}
