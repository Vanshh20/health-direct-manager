import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import InputField from '../components/InputField';
import logo from '../assets/logo.png';
import background from '../assets/background.jpg';
import '../styles/managerSignIn.css';
import { AuthContext } from '../context/AuthContext';
import { managerSignin } from '../utils/api';

function ManagerSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (emailError || !email || !password) {
      toast.error('Please provide a valid email and password');
      return;
    }

    try {
      console.log('ManagerSignIn: Attempting to sign in with email:', email);
      const response = await managerSignin({ email, password });
      const { token, user } = response.data;
      console.log('ManagerSignIn: API response - Token:', token, 'User:', user);

      login(token, user);
      console.log('ManagerSignIn: Called login with token:', token);

      toast.success('Manager login successful!');
      console.log('ManagerSignIn: Navigating to /manager-dashboard');
    } catch (err) {
      console.error('ManagerSignIn: Error during sign-in:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      const errorMessage = err.response?.data?.message || 'Manager login failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${background})` }}>
      <div className="auth-box">
        <img src={logo} alt="Health Direct Logo" className="auth-logo" />
        <h2>MANAGER LOGIN</h2>
        <form>
          <div className="input-group">
            <InputField
              type="email"
              placeholder="Your Email"
              label="Email"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{emailError}</p>}
            <InputField
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              togglePassword={toggleShowPassword}
              showPassword={showPassword}
            />
          </div>
          <div className="options">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" />
              <span className="custom-checkbox"></span>
              Remember Me
            </label>
          </div>
          <button type="button" className="auth-button" onClick={handleSignIn}>LOGIN</button>
        </form>
      </div>
    </div>
  );
}

export default ManagerSignIn;