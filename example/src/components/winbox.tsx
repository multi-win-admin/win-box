import * as React from 'react';
import { WinBox as WinBoxPrimitive } from 'win-box';
import { cn } from '../lib/utils';

const WinBox = React.forwardRef<
  React.ElementRef<typeof WinBoxPrimitive>,
  React.ComponentPropsWithoutRef<typeof WinBoxPrimitive>
>((props, ref) => {
  const { children, className, ...etc } = props;
  return (
    <WinBoxPrimitive
      ref={ref}
      className={cn('fixed border rounded-lg overflow-hidden flex flex-col shadow-2xl bg-slate-400', className)}
      {...etc}
    >
      <div wb-header="" className="h-8 bg-white">
        <WinBoxPrimitive.Drag className="h-8 cursor-move" />
      </div>
      <WinBoxPrimitive.Body className="flex-auto [&_[wb-body-iframe]]:h-full [&_[wb-body-iframe]]:w-full">
        {children}
      </WinBoxPrimitive.Body>
      <WinBoxPrimitive.Resize type="n" className="absolute h-2 left-0 right-0 top-[-4px] cursor-ns-resize" />
      <WinBoxPrimitive.Resize type="s" className="absolute h-2 left-0 right-0 bottom-[-4px] cursor-ns-resize" />
      <WinBoxPrimitive.Resize type="w" className="absolute w-2 top-0 bottom-0 left-[-4px] cursor-ew-resize" />
      <WinBoxPrimitive.Resize type="e" className="absolute w-2 top-0 bottom-0 right-[-4px] cursor-ew-resize" />
      <WinBoxPrimitive.Resize type="nw" className="absolute w-3 h-3 top-[-4px] left-[-4px] cursor-nwse-resize" />
      <WinBoxPrimitive.Resize type="ne" className="absolute w-3 h-3 top-[-4px] right-[-4px] cursor-nesw-resize" />
      <WinBoxPrimitive.Resize type="sw" className="absolute w-3 h-3 bottom-[-4px] left-[-4px] cursor-nesw-resize" />
      <WinBoxPrimitive.Resize type="se" className="absolute w-3 h-3 bottom-[-4px] right-[-4px] cursor-nwse-resize" />
    </WinBoxPrimitive>
  );
});

WinBox.displayName = WinBoxPrimitive.displayName;

export { WinBox };
