import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { FcGoogle } from "react-icons/fc";
import { Mail, Eye, EyeClosed } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Add this state

    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <img src="/assets/logo.png" alt="Logo" className="h-24 sm:h-32 mb-4" />
          <h1 className="text-2xl font-bold text-center">Welcome back!</h1>
        </div>

        <form className="space-y-6">
          <div>
            <Input
              type="email"
              placeholder="Email"
              variant="icon"
              icon={<Mail size={18} />}
              iconPosition="right"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>


         <div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              variant="icon"
              icon={showPassword ? <EyeClosed size={18} /> : <Eye size={18} />} // Toggle icon
              iconPosition="right"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onIconClick={togglePasswordVisibility}
            />
          </div>
          <div className="text-right">
            <Link to="/verify" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button  onClick={() => navigate('/')} type="submit" className="w-full rounded-full">
            Login
          </Button>
        </form>
        <div className="relative flex items-center justify-center">
          <span className="absolute px-3 bg-[#F9FAFB] ">OR</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <Button variant="outline" className="rounded-full w-full hover:bg-red-600 hover:border-red-600">
          <FcGoogle size={20} /> Mag-sign in sa Google
        </Button>
        <div className="text-center ">
          <p>
            Don't have an account yet?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
        {/* <div className="text-center">
          <Link to="/verify">
            <Button variant="ghost">VERIFY</Button>

          </Link>
        </div> */}
      </div>
     <div className="hidden md:block absolute bottom-0 w-full">
        <img
          src="/assets/cityhall-desktop.png"
          alt="Footer illustration"
          className="w-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;