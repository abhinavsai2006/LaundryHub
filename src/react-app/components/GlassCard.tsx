import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 ${className} ${
        onClick ? 'cursor-pointer hover:bg-white/90 transition-all' : ''
      }`}
    >
      {children}
    </div>
  );
}
