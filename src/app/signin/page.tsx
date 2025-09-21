// app/signin/page.tsx
import SignInForm from '@/components/auth/SignInForm';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen -mt-16">
      <SignInForm />
    </div>
  );
}