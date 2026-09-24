import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForms from '../components/AuthForms';

/**
 * Login Page - Renders the AuthForms modal with login/register tabs
 */
const Login = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    // After successful login, redirect to home
    navigate('/');
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#1e40af',
          color: 'white',
          padding: '30px 20px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>Welcome Back</h1>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            Log in to your Ayinde Technologies account
          </p>
        </div>

        {/* Auth Forms */}
        <div style={{ padding: '30px 20px' }}>
          <AuthForms onSuccess={handleSuccess} />
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #e5e7eb',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f9fafb'
        }}>
          <button
            onClick={handleBackClick}
            style={{
              background: 'none',
              border: 'none',
              color: '#1e40af',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;