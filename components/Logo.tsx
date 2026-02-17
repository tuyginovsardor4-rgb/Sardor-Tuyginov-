
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="v-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#a1a1aa" />
          <stop offset="100%" stopColor="#3f3f46" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* V shape composed of multiple lines mimicking the screenshot */}
      <g filter="url(#glow)">
        <path d="M20 25 L50 85 L80 25" stroke="url(#v-gradient)" strokeWidth="1" opacity="0.3" />
        <path d="M25 25 L50 80 L75 25" stroke="url(#v-gradient)" strokeWidth="1.5" opacity="0.5" />
        <path d="M30 25 L50 75 L70 25" stroke="url(#v-gradient)" strokeWidth="2" opacity="0.7" />
        <path d="M35 25 L50 70 L65 25" stroke="url(#v-gradient)" strokeWidth="2.5" />
        
        {/* Main sharp V lines */}
        <path d="M15 20 L50 90 L85 20" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <path d="M40 25 L50 65 L60 25" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
};

export default Logo;
