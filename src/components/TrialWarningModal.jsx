import React from 'react';

const TrialWarningModal = ({ course, daysRemaining, onContinue, onUpgrade }) => {
  if (daysRemaining <= 0) {
    // TRIAL EXPIRED - Show payment wall
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ color: '#dc2626', margin: '0 0 20px 0' }}>⏰ Trial Expired</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
            Your 30-day free trial for <strong>{course.title}</strong> has ended.
          </p>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '30px' }}>
            Subscribe now to continue learning and accessing all lessons.
          </p>

          <div style={{
            backgroundColor: '#f0f9ff',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
            border: '2px solid #1e40af'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e40af' }}>
              ${course.price}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              One-time payment for lifetime access
            </div>
          </div>

          <button
            onClick={onUpgrade}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#1e40af',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            💳 Subscribe Now
          </button>

          <button
            onClick={() => window.location.href = '/courses'}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (daysRemaining <= 3) {
    // TRIAL EXPIRING SOON - Show warning banner
    return (
      <div style={{
        backgroundColor: '#fef3c7',
        border: '2px solid #f59e0b',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h4 style={{ margin: '0 0 5px 0', color: '#d97706' }}>
            ⚠️ Trial ending in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
            Subscribe now to keep your progress and continue learning
          </p>
        </div>
        <button
          onClick={onUpgrade}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            marginLeft: '20px'
          }}
        >
          Subscribe Now
        </button>
      </div>
    );
  }

  return null;
};

export default TrialWarningModal;