import React from 'react';

interface CheckmarkIconProps {
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
}

const CheckmarkIcon: React.FC<CheckmarkIconProps> = ({
  width = 16,
  height = 16,
  stroke = "white",
  strokeWidth = 2
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.3334 4L6.00002 11.3333L2.66669 8"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckmarkIcon;
