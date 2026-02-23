
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <div 
      style={{ width: size, height: size }} 
      className={`overflow-hidden rounded-[25%] shadow-lg ${className}`}
    >
      <img 
        src="/1771753383439.jpg" 
        alt="Vibogram Logo" 
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback if image not found
          e.currentTarget.src = "https://api.dicebear.com/7.x/initials/svg?seed=V";
        }}
      />
    </div>
  );
};

export default Logo;
