import * as React from 'react';

import { useId } from '@radix-ui/react-id';
import { Portal as PortalPrimitive } from '@radix-ui/react-portal';
import { useStackStore } from './stack';
import { parseToPxOfDefault } from './lib/helper';
import { Primitive } from '@radix-ui/react-primitive';
import { createContext } from './lib/context';

type Fn<T> = <K extends keyof T>(key: K, value: T[K]) => void;

/* -------------------------------------------------------------------------------------------------
 * WinBox
 * -----------------------------------------------------------------------------------------------*/

const WIN_BOX_NAME = 'WinBox';

type WinBoxContextValue = {
  contentId: string;
};

const [WinBoxProvider, useWinBoxContext] = createContext<WinBoxContextValue>(WIN_BOX_NAME);

type State = {
  index: number;
  url: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  hide: boolean;
  focused: boolean;
};

type Store = {
  subscribe: (callback: () => void) => () => void;
  snapshot: () => State;
  setState: Fn<State>;
  emit: () => void;
};

const [WinBoxStoreProvider, useWinBoxStoreContext] = createContext<Store>(WIN_BOX_NAME);

interface WinBoxProps {
  children?: React.ReactNode;
}

const WinBox: React.FC<WinBoxProps> = (props: WinBoxProps) => {
  const { children } = props;
  // TODO
  return (
    <WinBoxProvider value={}>
      <WinBoxStoreProvider value={}>{children}</WinBoxStoreProvider>
    </WinBoxProvider>
  );
};

WinBox.displayName = WIN_BOX_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'WinBoxTrigger';

type WinBoxTriggerElement = React.ElementRef<typeof Primitive.button>;
interface WinBoxTriggerProps {
  asChild: boolean;
}

const WinBoxTrigger = React.forwardRef<WinBoxTriggerElement, WinBoxTriggerProps>((props, forwardedRef) => {
  const context = useWinBoxContext(TRIGGER_NAME);

  return (
    <Primitive.button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={}
      aria-controls={context.contentId}
      data-state={}
      {...props}
      ref={forwardedRef}
      onClick={}
    />
  );
});

WinBoxTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'WinBoxPortal';

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>;
interface WinBoxPortalProps {
  children?: React.ReactNode;
  container?: PortalProps['container'];
}

const WinBoxPortal: React.FC<WinBoxPortalProps> = (props) => {
  const { children, container } = props;

  return (
    <>
      {React.Children.map(children, (child) => (
        // DOTO 隐藏dom
        <PortalPrimitive asChild container={container}>
          {child}
        </PortalPrimitive>
      ))}
    </>
  );
};

WinBoxPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'WinBoxOverlay';

type WinBoxOverlayElement = React.ElementRef<typeof Primitive.div>;
interface WinBoxOverlayProps {
  asChild: boolean;
}

const WinBoxOverlay = React.forwardRef<WinBoxOverlayElement, WinBoxOverlayProps>((props, forwardedRef) => {
  return <Primitive.div {...props} ref={forwardedRef} />;
});

WinBoxOverlay.displayName = OVERLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'WinBoxContent';

type WinBoxContentElement = React.ElementRef<typeof Primitive.div>;
interface WinBoxContentProps {
  children?: React.ReactNode;
}

const WinBoxContent = React.forwardRef<WinBoxContentElement, WinBoxContentProps>((props, forwardedRef) => {
  const context = useWinBoxContext(TRIGGER_NAME);

  return;
});

WinBoxContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxHeader
 * -----------------------------------------------------------------------------------------------*/

const HEADER_NAME = 'WinBoxHeader';

type WinBoxHeaderElement = React.ElementRef<typeof Primitive.div>;
interface WinBoxHeaderProps {
  children?: React.ReactNode;
}

const WinBoxHeader = React.forwardRef<WinBoxHeaderElement, WinBoxHeaderProps>((props, forwardedRef) => {
  return <Primitive.div {...props} ref={forwardedRef} />;
});

WinBoxHeader.displayName = HEADER_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxDrag
 * -----------------------------------------------------------------------------------------------*/

const DRAG_NAME = 'WinBoxDrag';

type WinBoxDragElement = React.ElementRef<typeof Primitive.div>;
interface WinBoxDragProps {
  children?: React.ReactNode;
}

const WinBoxDrag = React.forwardRef<WinBoxDragElement, WinBoxDragProps>((props, forwardedRef) => {
  return <Primitive.div {...props} ref={forwardedRef} />;
});

WinBoxDrag.displayName = DRAG_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxIcon
 * -----------------------------------------------------------------------------------------------*/

const ICON_NAME = 'WinBoxIcon';

type WinBoxIconElement = React.ElementRef<typeof Primitive.div>;
interface WinBoxIconProps {
  asChild: boolean;
  children?: React.ReactNode;
}

const WinBoxIcon = React.forwardRef<WinBoxIconElement, WinBoxIconProps>((props, forwardedRef) => {
  return <Primitive.div {...props} ref={forwardedRef} />;
});

WinBoxIcon.displayName = ICON_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = 'WinBoxTitle';

type WinBoxTitleElement = React.ElementRef<typeof Primitive.div>;
interface WinBoxTitleProps {
  asChild: boolean;
  children?: React.ReactNode;
}

const WinBoxTitle = React.forwardRef<WinBoxTitleElement, WinBoxTitleProps>((props, forwardedRef) => {
  return <Primitive.div {...props} ref={forwardedRef} />;
});

WinBoxTitle.displayName = TITLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxControls
 * -----------------------------------------------------------------------------------------------*/

const CONTROLS_NAME = 'WinBoxControls';

type WinBoxControlsElement = React.ElementRef<typeof Primitive.div>;
interface WinBoxControlsProps {
  asChild: boolean;
  children?: React.ReactNode;
}

const WinBoxControls = React.forwardRef<WinBoxControlsElement, WinBoxControlsProps>((props, forwardedRef) => {
  return <Primitive.div {...props} ref={forwardedRef} />;
});

WinBoxControls.displayName = CONTROLS_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxMinimize
 * -----------------------------------------------------------------------------------------------*/

const MINIMIZE_NAME = 'WinBoxMinimize';

type WinBoxMinimizeElement = React.ElementRef<typeof Primitive.button>;
interface WinBoxMinimizeProps {
  asChild: boolean;
}

const WinBoxMinimize = React.forwardRef<WinBoxMinimizeElement, WinBoxMinimizeProps>((props, forwardedRef) => {
  return <Primitive.button type="button" {...props} ref={forwardedRef} />;
});

WinBoxMinimize.displayName = MINIMIZE_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxMaximize
 * -----------------------------------------------------------------------------------------------*/

const MAXIMIZE_NAME = 'WinBoxMaximize';

type WinBoxMaximizeElement = React.ElementRef<typeof Primitive.button>;
interface WinBoxMaximizeProps {
  asChild: boolean;
}

const WinBoxMaximize = React.forwardRef<WinBoxMaximizeElement, WinBoxMaximizeProps>((props, forwardedRef) => {
  return <Primitive.button type="button" {...props} ref={forwardedRef} />;
});

WinBoxMaximize.displayName = MAXIMIZE_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxFullScreen
 * -----------------------------------------------------------------------------------------------*/

const FULLSCREEN_NAME = 'WinBoxFullScreen';

type WinBoxFullScreenElement = React.ElementRef<typeof Primitive.button>;
interface WinBoxFullScreenProps {
  asChild: boolean;
}

const WinBoxFullScreen = React.forwardRef<WinBoxFullScreenElement, WinBoxFullScreenProps>((props, forwardedRef) => {
  return <Primitive.button type="button" {...props} ref={forwardedRef} />;
});

WinBoxFullScreen.displayName = FULLSCREEN_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'WinBoxClose';

type WinBoxCloseElement = React.ElementRef<typeof Primitive.button>;
interface WinBoxCloseProps {
  asChild: boolean;
}

const WinBoxClose = React.forwardRef<WinBoxCloseElement, WinBoxCloseProps>((props, forwardedRef) => {
  return <Primitive.button type="button" {...props} ref={forwardedRef} />;
});

WinBoxClose.displayName = CLOSE_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxBody
 * -----------------------------------------------------------------------------------------------*/

const BODY_NAME = 'WinBoxBody';

type WinBoxBodyElement = React.ElementRef<typeof Primitive.div>;
interface WinBoxBodyProps {
  asChild: boolean;
  children?: React.ReactNode;
}

const WinBoxBody = React.forwardRef<WinBoxBodyElement, WinBoxBodyProps>((props, forwardedRef) => {
  return <Primitive.div {...props} ref={forwardedRef} />;
});

WinBoxBody.displayName = BODY_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxResize
 * -----------------------------------------------------------------------------------------------*/

const RESIZE_NAME = 'WinBoxResize';

type WinBoxResizeElement = React.ElementRef<typeof Primitive.div>;
interface WinBoxResizeProps {
  asChild: boolean;
  /** 窗口边缘拖动类型 */
  type?: 'n' | 's' | 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se';
}

const WinBoxResize = React.forwardRef<WinBoxResizeElement, WinBoxResizeProps>((props, forwardedRef) => {
  return <Primitive.div {...props} ref={forwardedRef} />;
});

WinBoxResize.displayName = RESIZE_NAME;

const Root = WinBox;
const Trigger = WinBoxTrigger;
const Portal = WinBoxPortal;
const Overlay = WinBoxOverlay;
const Content = WinBoxContent;
const Header = WinBoxHeader;
const Drag = WinBoxDrag;
const Icon = WinBoxIcon;
const Title = WinBoxTitle;
const Controls = WinBoxControls;
const Minimize = WinBoxMinimize;
const Maximize = WinBoxMaximize;
const FullScreen = WinBoxFullScreen;
const Close = WinBoxClose;
const Body = WinBoxBody;
const Resize = WinBoxResize;

export {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Header,
  Drag,
  Icon,
  Title,
  Controls,
  Minimize,
  Maximize,
  FullScreen,
  Close,
  Body,
  Resize,
  //
  WinBox,
  WinBoxTrigger,
  WinBoxPortal,
  WinBoxOverlay,
  WinBoxContent,
  WinBoxHeader,
  WinBoxDrag,
  WinBoxIcon,
  WinBoxTitle,
  WinBoxControls,
  WinBoxMinimize,
  WinBoxMaximize,
  WinBoxFullScreen,
  WinBoxClose,
  WinBoxBody,
  WinBoxResize,
};

const useLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T>();

  if (ref.current === undefined) {
    ref.current = fn();
  }

  return ref as React.MutableRefObject<T>;
}
