import React, { useState, useEffect } from 'react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            backgroundColor: '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(30, 64, 175, 0.4)',
            zIndex: 999,
            transition: 'all 0.3s ease',
            opacity: 1,
            animation: 'slideIn 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#1e3a8a';
            e.target.style.transform = 'translateY(-5px)';
            e.target.style.boxShadow = '0 6px 25px rgba(30, 64, 175, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#1e40af';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(30, 64, 175, 0.4)';
          }}
          aria-label="Back to top"
          title="Back to top"
        >
          ↑
        </button>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default BackToTopButton;