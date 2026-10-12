import React from 'react';

/**
 * Reusable Video Background Component
 * - Beautiful, responsive video background
 * - Overlay with gradient for text readability
 * - Works across all pages
 */
const VideoBackground = ({ 
  children, 
  overlayOpacity = 0.35,
  minHeight = '500px'
}) => {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: minHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay for Text Readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, rgba(30, 64, 175, ${overlayOpacity}) 0%, rgba(59, 130, 246, ${overlayOpacity}) 100%)`,
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
        }}
      >
        {children}
      </div>

      {/* Animated Accent Elements */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .video-bg-title {
          animation: slideInDown 0.8s ease-out;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .video-bg-subtitle {
          animation: slideInUp 0.8s ease-out 0.2s both;
          text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
        }

        .video-bg-accent {
          animation: float 6s ease-in-out infinite;
          opacity: 0.15;
        }
      `}</style>
    </div>
  );
};

export default VideoBackground;