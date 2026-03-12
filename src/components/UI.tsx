import React from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'dangerGhost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const variants = {
    primary: 'bg-[#ff2fb8] text-white hover:bg-[#ff2fb8]/90 shadow-[0_0_15px_rgba(255,47,184,0.4)]',
    secondary: 'bg-[#18a0ff] text-white hover:bg-[#18a0ff]/90 shadow-[0_0_15px_rgba(24,160,255,0.4)]',
    ghost: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    dangerGhost: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      className={cn(
        'rounded-full font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className, onClick }) => (
  <div 
    onClick={onClick}
    className={cn(
      'bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm', 
      onClick && 'cursor-pointer hover:border-white/20 transition-colors',
      className
    )}
  >
    {children}
  </div>
);
