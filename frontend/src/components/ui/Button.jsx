import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full active:scale-95 tracking-wide select-none';
  
  const variants = {
    primary: 'bg-[#55236F] text-white hover:bg-[#3B144E] shadow-[0_4px_16px_rgba(85,35,111,0.25)] hover:shadow-[0_8px_24px_rgba(85,35,111,0.35)] hover:-translate-y-0.5',
    secondary: 'bg-white text-[#3B144E] border border-[#C6A15B] hover:border-[#55236F] hover:text-[#55236F] hover:bg-[#FAF7F0] shadow-sm hover:-translate-y-0.5',
    accent: 'bg-[#087E83] text-white hover:bg-[#055C60] shadow-[0_4px_16px_rgba(8,126,131,0.25)] hover:shadow-[0_8px_24px_rgba(8,126,131,0.35)] hover:-translate-y-0.5',
    gold: 'bg-gradient-to-r from-[#C6A15B] via-[#D8B671] to-[#B89146] text-[#281404] font-semibold hover:brightness-105 shadow-[0_4px_16px_rgba(198,161,91,0.3)] hover:-translate-y-0.5',
    outline: 'border-2 border-[#55236F] text-[#55236F] hover:bg-[#55236F] hover:text-white hover:-translate-y-0.5',
    ghost: 'text-[#3B144E] hover:text-[#55236F] hover:bg-[#FAF7F0]',
  };

  const sizes = {
    sm: 'text-xs sm:text-sm px-4 py-2',
    md: 'text-sm sm:text-base px-6 py-2.5',
    lg: 'text-base sm:text-lg px-8 py-3.5',
  };

  return (
    <button 
      className={twMerge(clsx(baseClasses, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
};
