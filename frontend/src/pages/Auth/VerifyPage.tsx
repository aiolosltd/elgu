import { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Mail } from 'lucide-react';

const VerifyPage = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 text-center">
        <div className="flex flex-col items-center">
          <img src="/assets/email.png" alt="Verification" className="h-40 mb-4" />
          <h1 className="text-2xl font-bold">Verify your email address</h1>
          <p className="mt-2 text-gray-600">
            Enter the email address associated with your account and we'll send you a link to verify your email.
          </p>
        </div>

        <form className="space-y-6">

          {/* Icon Input */}
          <Input
            type="email"
            placeholder="Email"
            variant="icon"
            icon={<Mail size={18} />}
            iconPosition="right"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" className="w-full rounded-full">
            Send Verification
          </Button>
        </form>
      </div>

      <div className="absolute bottom-0 w-full">
        <img
          src="/assets/cityhall-desktop.png"
          alt="Footer illustration"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default VerifyPage;
