import { Primitive } from '@radix-ui/react-primitive';
import * as React from 'react';
import { useId } from '@radix-ui/react-id';
import { addWindowListener, parseToPxOfDefault, removeWindowListener } from './helper';
import { useStackStore } from './stack';

type Children = { children?: React.ReactNode };
type DivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
type ButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;

type WinBoxProps = Children &
  DivProps & {
    /** 窗口唯一ID */
    id?: number | string;
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
    /** 窗口最小最小宽高 支持 px 或 % */
    minHeight?: number | string;
    minWidth?: number | string;
    maxHeight?: number | string;
    maxWidth?: number | string;
    /** 自动调整窗口大小 */
    autoSize?: boolean;
    /** 是否允许窗口移动到视窗外 */
    overflow?: boolean;
    /** 创建时窗口最大化 */
    max?: boolean;
    /** 创建时窗口隐藏 */
    hidden?: boolean;
    /** 窗口屏幕限制区域 */
    top?: number | string;
    right?: number | string;
    bottom?: number | string;
    left?: number | string;
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
  };

type WinBoxContent = Children & DivProps & {};

type ResizeProps = Children &
  DivProps & {
    /** 可调整的方位 */
    type: 'n' | 's' | 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se';
  };

type DragProps = Children & DivProps & {};

type ControlProps = Children &
  ButtonProps & {
    type?: 'min' | 'max' | 'full' | 'close';
  };

type BodyProps = Children & DivProps & {};

/**
 * 存储上下文
 */
type Context = {
  /** winBox 唯一 ID */
  winBoxId: string;
};

/**
 * 存储状态
 */
export type State = {
  index: number;
  url: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  hide: boolean;
  focused: boolean;
};

export type Store = {
  subscribe: (callback: () => void) => () => void;
  snapshot: () => State;
  setState: <K extends keyof State>(key: K, value: State[K], opts?: any) => void;
  emit: () => void;
};

const WinBoxContext = React.createContext<Context | null>(null);
const useWinBox = () => React.useContext(WinBoxContext);

const StoreContext = React.createContext<Store | null>(null);
const useStore = () => React.useContext(StoreContext);

const eventOptionsPassive = { capture: true, passive: true };

const WinBox = React.forwardRef<HTMLDivElement, WinBoxProps>((props, forwardedRef) => {
  const { id, url, width, height, minHeight, minWidth, maxHeight, maxWidth, ...etc } = props;
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
  const sizeLimits = useLazyRef(() => ({ minH: 0, minW: 0, maxH: 0, maxW: 0, rootW: 0, rootH: 0 }));
  const oldSize = useLazyRef(() => ({ height: 0, width: 0, x: 0, y: 0 }));
  const listeners = useLazyRef<Set<() => void>>(() => new Set()); // [...rerenders]
  const stackStore = useStackStore();

  const winBoxId = id ?? useId();

  useLayoutEffect(() => {
    let animationFrame: number;
    const handleResize = () => {
      animationFrame = requestAnimationFrame(() => {
        const rootW = document.documentElement.clientWidth;
        const rootH = document.documentElement.clientHeight;
        const maxH = parseToPxOfDefault(maxHeight, rootH, rootH);
        const maxW = parseToPxOfDefault(maxWidth, rootW, rootW);
        const minH = parseToPxOfDefault(minHeight, maxH, 150);
        const minW = parseToPxOfDefault(minWidth, maxW, 150);
        sizeLimits.current = { maxH, maxW, minH, minW, rootW, rootH };
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
    stackStore.setStoreMap(winBoxId, store);
    stackStore.focus(winBoxId);
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
          if ((w >= sizeLimits.current.maxW && w > stateW) || w < sizeLimits.current.minW) return;
        } else if (key === 'height') {
          const h = value as number;
          const stateH = state.current.height;
          // 限制最大最小高度
          if ((h >= sizeLimits.current.maxH && h > stateH) || h < sizeLimits.current.minH) return;
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

  // 上下文环境
  const context: Context = React.useMemo(() => {
    return {
      winBoxId,
    };
  }, []);

  return (
    <StoreContext.Provider value={store}>
      <WinBoxContext.Provider value={context}>
        <WinBoxContent ref={forwardedRef} {...etc} />
      </WinBoxContext.Provider>
    </StoreContext.Provider>
  );
});

WinBox.displayName = 'WinBoxRoot';

const WinBoxContent = React.forwardRef<HTMLDivElement, WinBoxContent>((props, forwardedRef) => {
  const context = useWinBox();
  const width = useWb((state) => state.width);
  const height = useWb((state) => state.height);
  const x = useWb((state) => state.x);
  const y = useWb((state) => state.y);
  const index = useWb((state) => state.index);
  const stackStore = useStackStore();

  const { children: _, ...etc } = props;

  function onMouseDown() {
    console.log('onMouseDown');
    stackStore.focus(context!.winBoxId);
  }

  return (
    <Primitive.div
      ref={forwardedRef}
      tabIndex={-1}
      {...etc}
      style={{ width, height, top: y, left: x, zIndex: index }}
      wb-root=""
      role="dialog"
      onMouseDown={onMouseDown}
      id={context?.winBoxId}
    >
      {props.children}
    </Primitive.div>
  );
});

WinBoxContent.displayName = 'WinBoxContent';

const Resize = React.forwardRef<HTMLDivElement, ResizeProps>((props, forwardedRef) => {
  const { type, ...etc } = props;
  // const context = useWinBox();
  let x: number, y: number;
  const width = useWb((state) => state.width);
  const height = useWb((state) => state.height);
  const winX = useWb((state) => state.x);
  const winY = useWb((state) => state.y);
  const store = useStore();

  function handlerMousemove(e: MouseEvent) {
    // e.preventDefault();
    const pageX = e.pageX;
    const pageY = e.pageY;
    const offsetX = pageX - x;
    const offsetY = pageY - y;

    if (type === 'e' || type === 'se' || type === 'ne') {
      store?.setState('width', width + offsetX);
    } else if (type === 'w' || type === 'sw' || type === 'nw') {
      store?.setState('x', winX + offsetX);
      store?.setState('width', width - offsetX);
    }

    if (type === 's' || type === 'se' || type === 'sw') {
      store?.setState('height', height + offsetY);
    } else if (type === 'n' || type === 'ne' || type === 'nw') {
      store?.setState('y', winY + offsetY);
      store?.setState('height', height - offsetY);
    }
  }

  function handlerMouseup() {
    // e.preventDefault();
    removeWindowListener('mousemove', handlerMousemove, eventOptionsPassive);
    removeWindowListener('mouseup', handlerMouseup, eventOptionsPassive);
  }

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    x = e.pageX;
    y = e.pageY;
    addWindowListener('mousemove', handlerMousemove, eventOptionsPassive);
    addWindowListener('mouseup', handlerMouseup, eventOptionsPassive);
  }

  return (
    <Primitive.div
      ref={forwardedRef}
      {...etc}
      wb-resizing=""
      data-resizing={type}
      onMouseDown={onMouseDown}
    ></Primitive.div>
  );
});

Resize.displayName = 'WinBoxResizing';

const Drag = React.forwardRef<HTMLDivElement, DragProps>((props, forwardedRef) => {
  let x: number, y: number;
  const winX = useWb((state) => state.x);
  const winY = useWb((state) => state.y);
  const store = useStore();

  function handlerMousemove(e: MouseEvent) {
    // e.preventDefault();
    const offsetX = e.pageX - x;
    const offsetY = e.pageY - y;

    store?.setState('x', winX + offsetX);
    store?.setState('y', winY + offsetY);
  }

  function handlerMouseup() {
    // e.preventDefault();
    removeWindowListener('mousemove', handlerMousemove, eventOptionsPassive);
    removeWindowListener('mouseup', handlerMouseup, eventOptionsPassive);
  }

  function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    x = e.pageX;
    y = e.pageY;
    addWindowListener('mousemove', handlerMousemove, eventOptionsPassive);
    addWindowListener('mouseup', handlerMouseup, eventOptionsPassive);
  }

  return <Primitive.div ref={forwardedRef} {...props} onMouseDown={onMouseDown} wb-drag="" />;
});

Drag.displayName = 'WinBoxDrag';

const Control = React.forwardRef<HTMLButtonElement, ControlProps>((props, forwardedRef) => {
  const { type, ...etc } = props;

  function onClick() {}

  return <Primitive.button ref={forwardedRef} {...etc} onClick={onClick} wb-control="" data-control={type} />;
});

Control.displayName = 'WinBoxControl';

const Body = React.forwardRef<HTMLDivElement, BodyProps>((props, forwardedRef) => {
  const url = useWb((state) => state.url);

  const { children, ...etc } = props;

  const comp = url ? <iframe src={url} wb-body-iframe="" /> : children;

  return (
    <Primitive.div ref={forwardedRef} {...etc} wb-body="">
      {comp}
    </Primitive.div>
  );
});

Body.displayName = 'WinBoxBody';

const pkg = Object.assign(WinBox, {
  Resize,
  Drag,
  Control,
  Body,
});

export { pkg as WinBox };

export { useWb as useWinBoxState };

export { WinBox as WinBoxRoot };
export { Resize as WinBoxResize };
export { Drag as WinBoxDrag };
export { Control as WinBoxControl };
export { Body as WinBoxBody };

const useLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/**
 * 延迟初始化 Ref
 * @param fn
 * @returns
 */
function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T>();

  if (ref.current === undefined) {
    ref.current = fn();
  }

  return ref as React.MutableRefObject<T>;
}

/**
 * 合并传入的多个 ref 或回调函数
 * @param refs 传入值的数组
 * @returns ref改变回调函数
 */
function mergeRefs<T = any>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

/**
 * 获取状态
 * @param selector
 * @returns
 */
function useWb<T = any>(selector: (state: State) => T) {
  const store = useStore();
  const cb = () => selector(store!.snapshot());
  return React.useSyncExternalStore(store!.subscribe, cb, cb);
}
