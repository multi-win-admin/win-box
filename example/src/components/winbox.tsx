import * as React from 'react';
import { WinBox as WinBoxPrimitive } from 'win-box';
import { cn } from '../lib/utils';
import { cva } from 'class-variance-authority';

const WinBox = React.forwardRef<
  React.ElementRef<typeof WinBoxPrimitive>,
  React.ComponentPropsWithoutRef<typeof WinBoxPrimitive>
>(({ className, ...props }, ref) => (
  <WinBoxPrimitive ref={ref} className={cn('fixed border border-gray-500 rounded-lg', className)} {...props} />
));

WinBox.displayName = WinBoxPrimitive.displayName;

const WinBoxResizingVariants = cva('absolute', {
  variants: {
    type: {
      n: 'h-2 left-0 right-0 top-[-4px] cursor-ns-resize',
      s: 'h-2 left-0 right-0 bottom-[-4px] cursor-ns-resize',
      w: 'w-2 top-0 bottom-0 left-[-4px] cursor-ew-resize',
      e: 'w-2 top-0 bottom-0 right-[-4px] cursor-ew-resize',
      nw: 'w-3 h-3 top-[-4px] left-[-4px] cursor-nwse-resize',
      ne: 'w-3 h-3 top-[-4px] right-[-4px] cursor-nesw-resize',
      sw: 'w-3 h-3 bottom-[-4px] left-[-4px] cursor-nesw-resize',
      se: 'w-3 h-3 bottom-[-4px] right-[-4px] cursor-nwse-resize',
    },
  },
});

const WinBoxResizing = React.forwardRef<
  React.ElementRef<typeof WinBoxPrimitive.Resizing>,
  React.ComponentPropsWithoutRef<typeof WinBoxPrimitive.Resizing>
>(({ className, ...props }, ref) => (
  <WinBoxPrimitive.Resizing
    ref={ref}
    className={cn(WinBoxResizingVariants({ type: props.type, className }))}
    {...props}
  />
));

WinBoxResizing.displayName = WinBoxPrimitive.Resizing.displayName;

export { WinBox, WinBoxResizing };
