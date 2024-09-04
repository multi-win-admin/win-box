import { Primitive } from '@radix-ui/react-primitive';
import * as React from 'react';

type Children = { children?: React.ReactNode };
type DivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;

export type Position = {
  x: number;
  y: number;
};

type WinBoxProps = Children &
  DivProps & {
    /** 窗口唯一ID */
    id?: number | string;
    /** 窗口层级 */
    index: number;
    /** 窗口位置 */
    point?: Position;
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
    onMove?: (point: Position) => void;
    /** 窗口调整大小时回调 */
    onResize?: (width: number, height: number) => void;
    /** 窗口进入全屏时回调 */
    onFullscreen?: () => void;
    /** 窗口进入最小化时回调 */
    onMinimize?: () => void;
  };

type HeaderProps = Children & DivProps & {};

type TitleProps = Children & DivProps & {};

type ControlProps = Children & DivProps & {};

type ControlButtonProps = Children &
  DivProps & {
    type?: 'fullscreen';
  };

type BodyProps = Children & DivProps & {};

const WinBox = React.forwardRef<HTMLDivElement, WinBoxProps>((props, forwardedRef) => {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <Primitive.div ref={mergeRefs([ref, forwardedRef])} wb-root="">
      {SlottableWithNestedChildren(props, (child) => (
        <div>
          {child}
          <div wb-n="" onMouseDown={() => {}} onMouseUp={() => {}} />
          <div wb-s="" />
          <div wb-w="" />
          <div wb-e="" />
          <div wb-nw="" />
          <div wb-ne="" />
          <div wb-se="" />
          <div wb-sw="" />
        </div>
      ))}
    </Primitive.div>
  );
});

WinBox.displayName = 'WinBox';

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

export { WinBox as WinBoxRoot };
export { Header as WinBoxHeader };
export { Title as WinBoxTitle };
export { Control as WinBoxControl };
export { ControlButton as WinBoxControlButton };
export { Body as WinBoxBody };

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

function renderChildren(children: React.ReactElement) {
  const childrenType = children.type as any;
  // The children is a component
  if (typeof childrenType === 'function') return childrenType(children.props);
  // The children is a component with `forwardRef`
  else if ('render' in childrenType) return childrenType.render(children.props);
  // It's a string, boolean, etc.
  else return children;
}

function SlottableWithNestedChildren(
  { asChild, children }: { asChild?: boolean; children?: React.ReactNode },
  render: (child: React.ReactNode) => JSX.Element,
) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      renderChildren(children),
      { ref: (children as any).ref },
      render(children.props.children),
    );
  }
  return render(children);
}
