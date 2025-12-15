'use client'

export default function CloudsAnimation() {
  return (
    <span className="clouds" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    }}>
      <style jsx>{`
        .clouds::before,
        .clouds::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 25%,
            rgba(255, 255, 255, 0.3) 75%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: cloudMove 8s linear infinite;
        }
        
        .clouds::after {
          animation-delay: -4s;
          opacity: 0.5;
        }
        
        @keyframes cloudMove {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </span>
  )
}

