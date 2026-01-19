import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary hover:bg-primary/90 text-white',
        secondary:
          'bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30',
        outline:
          'border border-primary bg-transparent text-primary hover:bg-primary hover:text-white',
        ghost: 'hover:bg-white dark:hover:bg-[#1a1c1e]',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-8 py-4 rounded-lg',
        sm: 'px-6 py-2.5 rounded-lg text-sm',
        lg: 'px-10 py-4 rounded-lg text-lg',
        icon: 'p-2 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
