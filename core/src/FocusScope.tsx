import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { mergeRefs } from './lib/helper';

/**
 * 可以控制 z-index 和 focus 的容器
 */

/* -------------------------------------------------------------------------------------------------
 * FocusScope
 * -----------------------------------------------------------------------------------------------*/

const FOCUS_SCOPE_NAME = 'FocusScope';

type FocusScopeElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface FocusScopeProps extends PrimitiveDivProps {
  /**
   * 值为 true 时，键盘导航会循环到第一个元素和最后一个元素
   * shift+tab 时 会循环到最后一个元素到第一个元素
   * @defaultValue false
   */
  loop?: boolean;

  /**
   * 值为 true 时，不能通过键盘切换焦点
   */
  trapped?: boolean;
}

const FocusScope = React.forwardRef<FocusScopeElement, FocusScopeProps>((props, forwardedRef) => {
  const containerRef = React.useRef<FocusScopeElement>(null);

  React.useEffect(() => {
    function handleFocusIn(e: FocusEvent) {
      if (!containerRef.current) return;
      // 获取获得焦点 DOM
      const target = e.target as HTMLElement | null;
      if (containerRef.current.contains(target)) {
        //
      }
    }

    function handleFocusOut(e: FocusEvent) {
      if (!containerRef.current) return;
      // 获取接收焦点DOM
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (relatedTarget === null) return;
      if (containerRef.current.contains(relatedTarget)) {
        //
      }
    }

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.addEventListener('focusin', handleFocusIn);
      document.addEventListener('focusout', handleFocusOut);
    };
  }, []);

  React.useEffect(() => {
    if (containerRef.current) {
      //
    }
  }, []);

  return (
    <Primitive.div
      tabIndex={-1}
      data-focus={}
      {...props}
      ref={mergeRefs([containerRef, forwardedRef])}
      win-box-focus-scope=""
    />
  );
});

FocusScope.displayName = FOCUS_SCOPE_NAME;

/* -------------------------------------------------------------------------------------------------
 * FocusScope stack
 * -----------------------------------------------------------------------------------------------*/

function createFocusScopesStack() {}
