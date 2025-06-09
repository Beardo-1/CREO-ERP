import React from 'react';

interface CreoLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export function CreoLogo({ className = "", size = 24, color = "currentColor" }: CreoLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Geometric Crystal/Diamond Logo */}
      <g transform="translate(50, 50)">
        {/* Outer hexagonal structure */}
        <path
          d="M150 20 L250 70 L280 170 L230 270 L130 270 L70 170 Z"
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Inner geometric lines - creating the crystal effect */}
        <path
          d="M150 20 L200 150"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        <path
          d="M250 70 L200 150"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        <path
          d="M280 170 L200 150"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        <path
          d="M230 270 L200 150"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        <path
          d="M130 270 L200 150"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        <path
          d="M70 170 L200 150"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Additional internal structure */}
        <path
          d="M150 20 L280 170"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        <path
          d="M250 70 L130 270"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        <path
          d="M280 170 L70 170"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        <path
          d="M230 270 L150 20"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        <path
          d="M130 270 L250 70"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.8"
        />
        
        {/* Central point */}
        <circle
          cx="200"
          cy="150"
          r="8"
          fill={color}
        />
      </g>
    </svg>
  );
} 