import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'brand' | 'accent';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200/50',
  error: 'bg-accent-50 text-accent-700 border border-accent-200/50',
  info: 'bg-sky-50 text-sky-700 border border-sky-200/50',
  brand: 'bg-brand-50 text-brand-700 border border-brand-200/50',
  accent: 'bg-accent-50 text-accent-700 border border-accent-200/50',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full transition-colors ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
}

// Category-specific badges with modern gradients
const categoryColors: Record<string, string> = {
  base: 'bg-gradient-to-r from-brand-50 to-brand-100/80 text-brand-700 border border-brand-200/40',
  cognitive: 'bg-gradient-to-r from-violet-50 to-purple-100/80 text-purple-700 border border-purple-200/40',
  power: 'bg-gradient-to-r from-accent-50 to-rose-100/80 text-accent-700 border border-accent-200/40',
  tactical: 'bg-gradient-to-r from-orange-50 to-amber-100/80 text-orange-700 border border-orange-200/40',
  narrative: 'bg-gradient-to-r from-emerald-50 to-green-100/80 text-emerald-700 border border-emerald-200/40',
  strategic: 'bg-gradient-to-r from-sky-50 to-blue-100/80 text-sky-700 border border-sky-200/40',
  social: 'bg-gradient-to-r from-pink-50 to-fuchsia-100/80 text-pink-700 border border-pink-200/40',
};

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClass = categoryColors[category] || categoryColors.base;
  return (
    <span className={`inline-flex items-center text-xs font-medium rounded-full px-2.5 py-0.5 capitalize ${colorClass}`}>
      {category}
    </span>
  );
}
