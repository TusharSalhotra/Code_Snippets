import { AuthLayout } from '../components/auth-layout';

export const metadata = {
  title: 'Forgot Password - Sample Admin',
  description: 'Reset your password',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Forgot Password" description="Enter your email to reset your password">
      <div className="text-center text-gray-600">
        <p>Password recovery form coming soon...</p>
      </div>
    </AuthLayout>
  );
}
