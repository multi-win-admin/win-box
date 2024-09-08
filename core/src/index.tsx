import { Primitive } from '@radix-ui/react-primitive';
import * as React from 'react';
import { useId } from '@radix-ui/react-id';
import { addWindowListener, removeWindowListener } from './helper';

type Children = { children?: React.ReactNode };
type DivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;

type WinBoxProps = Children &
  DivProps & {
    /** 窗口唯一ID */
    id?: number | string;
    /** 窗口层级 */
    index?: number;
    /** 窗口位置 */
    x?: number;
    y?: number;
    /** 窗口是否居中 */
    center?: boolean;
    /** 窗口宽度 */
    width?: number;
    /** 窗口高度 */
    height?: number;
    /** 窗口最小高度 */
    minHeight?: number;
    /** 窗口最大宽度 */
    minWidth?: number;
    /** 窗口最大高度 */
    maxHeight?: number;
    /** 窗口最大宽度 */
    maxWidth?: number;
    /** 自动调整窗口大小 */
    autoSize?: boolean;
    /** 是否允许窗口移动到视窗外 */
    overflow?: boolean;
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

type ResizingProps = Children &
  DivProps & {
    /** 可调整的方位 */
    type: 'n' | 's' | 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se';
  };

type HeaderProps = Children & DivProps & {};

type TitleProps = Children & DivProps & {};

type ControlProps = Children & DivProps & {};

type ControlButtonProps = Children &
  DivProps & {
    type?: 'fullscreen' | 'close';
  };

type BodyProps = Children & DivProps & {};

/**
 * 存储上下文
 */
type Context = {
  /** winBox 唯一 ID */
  winBoxId: string;
  minHeight: number;
  minWidth: number;
  maxHeight: number;
  maxWidth?: number;
};

/**
 * 存储状态
 */
type State = {
  x: number;
  y: number;
  width: number;
  height: number;
  hide: boolean;
};

type Store = {
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
  const state = useLazyRef<State>(() => ({
    /** 窗口x坐标 */
    x: 0,
    /** 窗口y坐标 */
    y: 0,
    /** 窗口宽度 */
    width: props.width ?? 0,
    /** 窗口高度 */
    height: props.height ?? 0,
    /** 是否隐藏窗口 */
    hide: true,
  }));
  const listeners = useLazyRef<Set<() => void>>(() => new Set()); // [...rerenders]
  const { id, width: _, height: __, minHeight, minWidth, maxHeight, maxWidth, ...etc } = props;

  const winBoxId = id ?? useId();

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
  const context: Context = React.useMemo(
    () => ({
      winBoxId,
      minHeight: minHeight ?? 0,
      minWidth: minWidth ?? 0,
      maxHeight: maxHeight ?? 0,
      maxWidth: maxWidth ?? 0,
    }),
    [],
  );

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

  const { children: _, ...etc } = props;

  return (
    <Primitive.div
      ref={forwardedRef}
      style={{ width, height, top: y, left: x }}
      {...etc}
      wb-root=""
      id={context?.winBoxId}
    >
      {props.children}
    </Primitive.div>
  );
});

WinBoxContent.displayName = 'WinBoxContent';

const Resizing = React.forwardRef<HTMLDivElement, ResizingProps>((props, forwardedRef) => {
  const { type, ...etc } = props;
  // const context = useWinBox();
  let x: number, y: number;
  const width = useWb((state) => state.width);
  const height = useWb((state) => state.height);
  const winX = useWb((state) => state.x);
  const winY = useWb((state) => state.y);
  const store = useStore();

  function handlerMousemove(e: MouseEvent) {
    e.preventDefault();
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

  function handlerMouseup(e: Event) {
    e.preventDefault();
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

Resizing.displayName = 'WinBoxResizing';

const Header = React.forwardRef<HTMLDivElement, HeaderProps>((props, forwardedRef) => {
  return <Primitive.div></Primitive.div>;
});

Header.displayName = 'WinBoxHeader';

const Title = React.forwardRef<HTMLDivElement, TitleProps>((props, forwardedRef) => {});

Title.displayName = 'WinBoxTitle';

const Control = React.forwardRef<HTMLDivElement, ControlProps>((props, forwardedRef) => {});

Control.displayName = 'WinBoxControl';

const ControlButton = React.forwardRef<HTMLDivElement, ControlButtonProps>((props, forwardedRef) => {});

ControlButton.displayName = 'WinBoxControlButton';

const Body = React.forwardRef<HTMLDivElement, BodyProps>((props, forwardedRef) => {});

Body.displayName = 'WinBoxBody';

const pkg = Object.assign(WinBox, {
  Resizing,
  Header,
  Title,
  Control,
  ControlButton,
  Body,
});

export { pkg as WinBox };

export { WinBox as WinBoxRoot };
export { Resizing as WinBoxResizing };
export { Header as WinBoxHeader };
export { Title as WinBoxTitle };
export { Control as WinBoxControl };
export { ControlButton as WinBoxControlButton };
export { Body as WinBoxBody };

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
