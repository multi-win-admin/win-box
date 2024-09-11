import * as React from 'react';

import { useId } from '@radix-ui/react-id';
import { Portal as PortalPrimitive } from '@radix-ui/react-portal';
import { createContext, createContextScope, Scope } from '@radix-ui/react-context';
import { useStackStore } from './stack';
import { parseToPxOfDefault } from './helper';
import { Primitive } from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * WinBox
 * -----------------------------------------------------------------------------------------------*/

const WIN_BOX_NAME = 'WinBox';

type ScopedProps<P> = P & { __scopeWinBox?: Scope };
const [createWinBoxContext, createWinBoxScope] = createContextScope(WIN_BOX_NAME);

type Fn<T> = <K extends keyof T>(key: K, value: T[K]) => void;

type Store = {
  subscribe: (callback: () => void) => () => void;
  snapshot: () => State;
  setState: Fn<State>;
  emit: () => void;
};

type WinBoxContextValue = {
  limits: Fn<Limits>;
  contentId: string;
  store: Store;
};

const [WinBoxProvider, useWinBoxContext] = createWinBoxContext<WinBoxContextValue>(WIN_BOX_NAME);

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

type Limits = {
  rootWidth: number;
  rootHeight: number;
  minHeight: number;
  minWidth: number;
  maxHeight: number;
  maxWidth: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

interface WinBoxProps {
  /** 窗口层级 */
  index?: number;
  /** 打开的url */
  url?: string;
  /** 窗口位置 */
  x?: number;
  y?: number;
  /** 窗口是否居中 */
  center?: boolean;
  /** 窗口宽高 支持 px 或 % */
  width?: number;
  height?: number;
  /** 自动调整窗口大小 */
  autoSize?: boolean;
  /** 是否允许窗口移动到视窗外 */
  overflow?: boolean;
  /** 创建时窗口最大化 */
  max?: boolean;
  /** 创建时窗口隐藏 */
  hidden?: boolean;
  children?: React.ReactNode;
  /** 创建窗口时回调 */
  onCreate?: () => void;
  /** 窗口移动时回调 */
  onMove?: (x: number, y: number) => void;
  /** 窗口调整大小时回调 */
  onResize?: (width: number, height: number) => void;
  /** 窗口进入全屏时回调 */
  onFullscreen?: () => void;
  /** 窗口进入最小化时回调 */
  onMinimize?: () => void;
}

const WinBox: React.FC<WinBoxProps> = (props: ScopedProps<WinBoxProps>) => {
  const { __scopeWinBox, url, width, height, minHeight, minWidth, maxHeight, maxWidth, children } = props;
  const state = useLazyRef<State>(() => ({
    index: 0,
    url: url ?? null,
    x: 0,
    y: 0,
    width: width ?? 0,
    height: height ?? 0,
    hide: true,
    focused: false,
  }));
  const limits = useLazyRef<Limits>(() => ({
    minHeight: 0,
    minWidth: 0,
    maxHeight: 0,
    maxWidth: 0,
    rootHeight: 0,
    rootWidth: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }));
  const listeners = useLazyRef<Set<() => void>>(() => new Set()); // [...rerenders]
  const stackStore = useStackStore();

  const contentId = useId();

  useLayoutEffect(() => {
    let animationFrame: number;
    const handleResize = () => {
      animationFrame = requestAnimationFrame(() => {
        const rootW = document.documentElement.clientWidth;
        const rootH = document.documentElement.clientHeight;
      });
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    if (width !== undefined || height !== undefined) {
      state.current.width = width ?? 0;
      state.current.height = height ?? 0;
      store.emit();
    }
  }, [width, height]);

  useLayoutEffect(() => {
    stackStore.setStoreMap(contentId, store);
    stackStore.focus(contentId);
  }, []);

  const store: Store = React.useMemo(
    () => ({
      subscribe: (cb) => {
        listeners.current.add(cb);
        return () => listeners.current.delete(cb);
      },
      snapshot: () => {
        return state.current;
      },
      setState: (key, value) => {
        if (Object.is(state.current[key], value)) return;
        if (key === 'width') {
          const w = value as number;
          const stateW = state.current.width;
          // 限制最大最小宽度
          if ((w >= limits.current.maxWidth && w > stateW) || w < limits.current.minWidth) return;
        } else if (key === 'height') {
          const h = value as number;
          const stateH = state.current.height;
          // 限制最大最小高度
          if ((h >= limits.current.maxHeight && h > stateH) || h < limits.current.minHeight) return;
        }
        state.current[key] = value;

        store.emit();
      },
      emit: () => {
        listeners.current.forEach((l) => l());
      },
    }),
    [],
  );

  const setLimits: Fn<Limits> = React.useCallback((key, value) => {
    if (Object.is(limits.current[key], value)) return;
    limits.current[key] = value;
  }, []);

  return (
    <WinBoxProvider scope={__scopeWinBox} limits={setLimits} contentId={useId()} store={store}>
      {children}
    </WinBoxProvider>
  );
};

WinBox.displayName = WIN_BOX_NAME;

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
        <PortalPrimitive asChild container={container}>
          {child}
        </PortalPrimitive>
      ))}
    </>
  );
};

WinBoxPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'WinBoxContent';

type SizeRange = {
  minHeight?: number | string;
  minWidth?: number | string;
  maxHeight?: number | string;
  maxWidth?: number | string;
};

type Margin = {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
};

interface WinBoxContentProps extends React.ComponentPropsWithoutRef<typeof Primitive.div> {
  /** 窗口最小最小宽高 支持 px 或 % */
  sizeRange: SizeRange;
  /** 窗口屏幕限制区域 */
  margin: Margin;
  children?: React.ReactNode;
}

const WinBoxContent = React.forwardRef<HTMLDivElement, WinBoxContentProps>((props, forwardedRef) => {
  return;
});

WinBoxContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * WinBoxResize
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * WinBoxClose
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * WinBoxMin
 * -----------------------------------------------------------------------------------------------*/

/* -------------------------------------------------------------------------------------------------
 * WinBoxMax
 * -----------------------------------------------------------------------------------------------*/

const useLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T>();

  if (ref.current === undefined) {
    ref.current = fn();
  }

  return ref as React.MutableRefObject<T>;
}
