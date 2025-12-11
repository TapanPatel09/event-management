import { useState } from 'react';
import { useForgetPassword } from '../Queries/Allquery';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
    const {mutate:forgetpassword} = useForgetPassword();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await forgetpassword(email);
      setMessage(`If an account with ${email} exists, a password reset link has been sent.`);
      setEmailSent(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Forgot Password</h2>
      
      {!emailSent ? (
        <>
          <p className="text-gray-600 mb-6">
            Enter your email address to receive a password reset link
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          
          {message && !emailSent && (
            <p className="mt-4 text-red-500 text-sm">{message}</p>
          )}
        </>
      ) : (
        <div className="p-4 bg-green-50 rounded-md border border-green-200">
          <p className="text-green-700 font-medium">{message}</p>
          <p className="text-green-600 text-sm mt-2">
            Check your email inbox (and spam folder).
          </p>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <a 
          href="/login" 
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Back to login
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;