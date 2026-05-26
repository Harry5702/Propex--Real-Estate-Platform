import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-header">
            <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
            <p>Access your Propex account</p>
          </div>
          
          <form className="login-form">
            {!isLogin && (
              <div className="form-group">
                <input type="text" placeholder="Full Name" className="form-input" />
              </div>
            )}
            <div className="form-group">
              <input type="email" placeholder="Email Address" className="form-input" />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" className="form-input" />
            </div>
            {!isLogin && (
              <div className="form-group">
                <input type="password" placeholder="Confirm Password" className="form-input" />
              </div>
            )}
            
            <button type="submit" className="btn btn-primary login-btn">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                className="toggle-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;