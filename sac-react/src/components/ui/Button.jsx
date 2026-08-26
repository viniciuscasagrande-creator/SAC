import React from 'react';

export function Button({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '', 
  icon: Icon,
  ...props 
}) {
  const variants = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white border-transparent',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 border-transparent',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    icon: 'p-2',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-md border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
