import React from 'react';

const Button = ({ onClick, children, disabled, variant = 'primary', className = '' }) => {
  const baseStyles = 'px-8 py-3.5 font-semibold text-base rounded-full cursor-pointer transition-all duration-300';

  const variants = {
    primary: 'bg-white text-black hover:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    gradient: 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:opacity-90',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <button onClick={onClick} disabled={disabled} className={combinedClassName}>
      {children}
    </button>
  );
};

export default Button;