import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Typography } from '@/components/atoms/typography';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    extensionName: '',
    username: '',
    password: '',
    verifyPassword: '',
    email: '',
    acceptTerms: false,
    notARobot: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.verifyPassword) newErrors.verifyPassword = 'Please verify your password';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Password match validation
    if (formData.password && formData.verifyPassword && formData.password !== formData.verifyPassword) {
      newErrors.verifyPassword = 'Passwords do not match';
    }

    // Terms validation
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
    if (!formData.notARobot) newErrors.notARobot = 'Please verify you are not a robot';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Here you would typically make your API call
      console.log('Registration data:', formData);
      
      // Show success message and redirect
      alert('Registration successful! Please check your email for verification.');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthMap = {
      0: { text: 'Very Weak', color: 'bg-red-500' },
      1: { text: 'Weak', color: 'bg-red-400' },
      2: { text: 'Fair', color: 'bg-yellow-500' },
      3: { text: 'Good', color: 'bg-blue-500' },
      4: { text: 'Strong', color: 'bg-green-500' },
      5: { text: 'Very Strong', color: 'bg-green-600' },
    };

    return { strength, ...strengthMap[Math.min(strength, 5) as keyof typeof strengthMap] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-lg">
                <img src="/assets/logo.png" alt="Logo" className="h-12" />
              </div>
              <div>
                <Typography variant="h2" className="text-white font-bold">BUSINESS PERMIT SYSTEM</Typography>
                <Typography variant="small" className="text-blue-100">MUNICIPALITY OF LEGANES, ILOILO</Typography>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Registrant Profile */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <Typography variant="h3" className="text-blue-900 font-semibold">REGISTRANT PROFILE</Typography>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Input 
                  name="firstName" 
                  placeholder="First name *" 
                  value={formData.firstName} 
                  onChange={handleChange}
                  // error={!!errors.firstName}
                />
                {errors.firstName && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.firstName}</span>
                  </div>
                )}
              </div>
              
              <div>
                <Input 
                  name="middleName" 
                  placeholder="Middle Name" 
                  value={formData.middleName} 
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Input 
                  name="lastName" 
                  placeholder="Last Name *" 
                  value={formData.lastName} 
                  onChange={handleChange}
                  // error={!!errors.lastName}
                />
                {errors.lastName && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.lastName}</span>
                  </div>
                )}
              </div>
              
              <div>
                <Input 
                  name="extensionName" 
                  placeholder="Extension Name (e.g., Jr, Sr, III)" 
                  value={formData.extensionName} 
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-600 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <Typography variant="h3" className="text-green-900 font-semibold">ACCOUNT DETAILS</Typography>
            </div>
            
            <div className="space-y-4">
              <div>
                <Input 
                  name="username" 
                  placeholder="Username *" 
                  value={formData.username} 
                  onChange={handleChange}
                  // error={!!errors.username}
                />
                {errors.username && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.username}</span>
                  </div>
                )}
              </div>

              <div>
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="Email Address *" 
                  value={formData.email} 
                  onChange={handleChange}
                  // error={!!errors.email}
                />
                {errors.email && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              <div className="relative">
                <Input 
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password *" 
                  value={formData.password} 
                  onChange={handleChange}
                  // error={!!errors.password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {errors.password && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.password}</span>
                  </div>
                )}
                
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <Typography variant="small" className="text-gray-600">Password strength:</Typography>
                      <Typography variant="small" className={`font-medium ${
                        passwordStrength.strength <= 2 ? 'text-red-600' : 
                        passwordStrength.strength <= 3 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {passwordStrength.text}
                      </Typography>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <Input 
                  name="verifyPassword" 
                  type={showVerifyPassword ? "text" : "password"}
                  placeholder="Verify Password *" 
                  value={formData.verifyPassword} 
                  onChange={handleChange}
                  // error={!!errors.verifyPassword}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                >
                  {showVerifyPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {errors.verifyPassword && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <XCircle className="h-4 w-4" />
                    <span>{errors.verifyPassword}</span>
                  </div>
                )}
                
                {/* Password Match Indicator */}
                {formData.verifyPassword && (
                  <div className="mt-1">
                    {formData.password === formData.verifyPassword ? (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>Passwords match</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-600 text-sm">
                        <XCircle className="h-4 w-4" />
                        <span>Passwords do not match</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-600 p-2 rounded-full">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <Typography variant="h3" className="text-orange-900 font-semibold">TERMS AND CONDITIONS</Typography>
            </div>

            <div className="bg-white p-4 rounded-lg border space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-1 rounded-full mt-1">
                  <Typography variant="small" className="text-blue-800 font-bold">1</Typography>
                </div>
                <Typography variant="p" className="text-gray-700">
                  Registrant should validate their account by clicking the verification link sent to the supplied email address.
                </Typography>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-1 rounded-full mt-1">
                  <Typography variant="small" className="text-blue-800 font-bold">2</Typography>
                </div>
                <Typography variant="p" className="text-gray-700">
                  Registrant should not create multiple false accounts.
                </Typography>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-1 rounded-full mt-1">
                  <Typography variant="small" className="text-blue-800 font-bold">3</Typography>
                </div>
                <Typography variant="p" className="text-gray-700">
                  Registrant will not share account credentials with anyone.
                </Typography>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Typography variant="large" className="font-semibold text-yellow-800 mb-2">Disclaimer</Typography>
              <Typography variant="p" className="text-yellow-700">
                In accordance to R.A. 10173 or Data Privacy Act, all collected information will be treated with utmost confidentiality and will not be subjected to public disclosure.
              </Typography>
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="terms" 
                  name="acceptTerms" 
                  checked={formData.acceptTerms} 
                  onChange={handleChange}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-gray-700 cursor-pointer">
                  I have read and accept the Terms and Conditions
                </label>
              </div>
              {errors.acceptTerms && (
                <div className="flex items-center gap-1 text-red-600 text-sm ml-6">
                  <XCircle className="h-4 w-4" />
                  <span>{errors.acceptTerms}</span>
                </div>
              )}

              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="robot" 
                  name="notARobot" 
                  checked={formData.notARobot} 
                  onChange={handleChange}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="robot" className="text-gray-700 cursor-pointer">
                  I confirm that I am not a robot
                </label>
              </div>
              {errors.notARobot && (
                <div className="flex items-center gap-1 text-red-600 text-sm ml-6">
                  <XCircle className="h-4 w-4" />
                  <span>{errors.notARobot}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full" type="button">
                Back to Login
              </Button>
            </Link>
            
            <Button 
              type="submit" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center">
            <Typography variant="small" className="text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in here
              </Link>
            </Typography>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;