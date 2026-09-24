import React from 'react';

interface VodafoneLogoProps {
  className?: string;
  size?: number;
}

/**
 * Official Vodafone Speech Mark Icon
 * The iconic Vodafone circular logo with white quotation / speech mark.
 */
export function VodafoneLogo({ className = 'w-7 h-7', size }: VodafoneLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="Vodafone"
      role="img"
    >
      {/* Vodafone Red Background Circle */}
      <circle cx="50" cy="50" r="50" fill="#E60000" />
      
      {/* Iconic Vodafone White Speech Mark */}
      <path
        d="M50 18C33.43 18 20 31.43 20 48c0 12.28 7.37 22.84 17.89 27.42-1.22-3.13-1.89-6.52-1.89-10.07 0-14.36 11.64-26 26-26 2.05 0 4.04.24 5.95.69C63.66 28.64 54.34 18 50 18z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
