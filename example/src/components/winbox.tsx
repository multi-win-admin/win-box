import * as React from 'react';
import { WinBox as WinBoxPrimitive } from 'win-box';

const WinBox = React.forwardRef<
  React.ElementRef<typeof WinBoxPrimitive>,
  React.ComponentPropsWithoutRef<typeof WinBoxPrimitive>
>(({ className, ...props }, ref) => <WinBoxPrimitive ref={ref} className={className} {...props} />);

WinBox.displayName = WinBoxPrimitive.displayName;

export { WinBox };
