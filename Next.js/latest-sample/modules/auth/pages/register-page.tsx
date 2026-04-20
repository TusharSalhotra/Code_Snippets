import { AuthLayout } from '../components/auth-layout';

export const metadata = {
  title: 'Register - Sample Admin',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return (
    <AuthLayout title="Create Account" description="Sign up for a new account">
      <div className="text-center text-gray-600">
        <p>Registration form coming soon...</p>
      </div>
    </AuthLayout>
  );
}
