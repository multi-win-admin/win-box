import * as React from 'react';
import { WinBox as WinBoxPrimitive } from 'win-box';
import { cn } from '../lib/utils';

const WinBox = React.forwardRef<
  React.ElementRef<typeof WinBoxPrimitive>,
  React.ComponentPropsWithoutRef<typeof WinBoxPrimitive>
>(({ className, ...props }, ref) => (
  <WinBoxPrimitive ref={ref} className={cn('fixed border border-gray-500 rounded-lg', className)} {...props} />
));

WinBox.displayName = WinBoxPrimitive.displayName;

const WinBoxResizing = React.forwardRef<
  React.ElementRef<typeof WinBoxPrimitive.Resizing>,
  React.ComponentPropsWithoutRef<typeof WinBoxPrimitive.Resizing>
>(({ className, ...props }, ref) => (
  <WinBoxPrimitive.Resizing
    ref={ref}
    className={cn('absolute w-2 top-0 bottom-0 right-[-4px] select-none cursor-ew-resize', className)}
    {...props}
  />
));

WinBoxResizing.displayName = WinBoxPrimitive.Resizing.displayName;

export { WinBox, WinBoxResizing };
