import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { mergeRefs } from './lib/helper';
import { useCallbackRef } from './lib/useCallbackRef';

/**
 * 可以控制 z-index 和 focus 的容器
 */

type FocusableTarget = HTMLElement | { focus(): void };

const AUTOFOCUS_ON_MOUNT = 'focusScope.autoFocusOnMount';
const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount';
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

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
   * 自动对焦挂载时回调函数
   */
  onMountAutoFocus?: (event: Event) => void;

  /**
   * 自动对焦卸载时回调函数
   */
  onUnmountAutoFocus?: (event: Event) => void;
}

const FocusScope = React.forwardRef<FocusScopeElement, FocusScopeProps>((props, forwardedRef) => {
  const {
    loop = false,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    ...etc
  } = props;
  const onMountAutoFocus = useCallbackRef(onMountAutoFocusProp);
  const onUnmountAutoFocus = useCallbackRef(onUnmountAutoFocusProp);
  const containerRef = React.useRef<FocusScopeElement>(null);

  // 当前组件是否聚焦，不是聚焦不能操作
  const focusScope = React.useRef({
    paused: false,
    pause() {
      this.paused = true;
    },
    resume() {
      this.paused = false;
    },
  }).current;

  // 监听获得焦点的DOM
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
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [focusScope.paused]);

  // 挂载时自动聚焦
  React.useEffect(() => {
    if (containerRef.current) {
      focusScopesStack.add(focusScope);
      const previouslyFocusedElement = document.activeElement;
      const hasFocusedCandidate = containerRef.current.contains(previouslyFocusedElement);

      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
        containerRef.current.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
        // 触发事件
        containerRef.current.dispatchEvent(mountEvent);
        // 默认事件未被阻止进入
        if (!mountEvent.defaultPrevented) {
          // 聚焦当前元素下第一个可聚焦元素
          focusFirst(removeLinks(getTabbableCandidates(containerRef.current)), { select: true });
          if (document.activeElement === previouslyFocusedElement) {
            focus(containerRef.current);
          }
        }
      }

      return () => {
        containerRef.current?.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);

        // We hit a react bug (fixed in v17) with focusing in unmount.
        // We need to delay the focus a little to get around it for now.
        // See: https://github.com/facebook/react/issues/17894
        setTimeout(() => {
          const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
          containerRef.current?.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
          containerRef.current?.dispatchEvent(unmountEvent);
          if (!unmountEvent.defaultPrevented) {
            focus((previouslyFocusedElement as HTMLElement) ?? document.body, { select: true });
          }
          // we need to remove the listener after we `dispatchEvent`
          containerRef.current?.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);

          focusScopesStack.remove(focusScope);
        }, 0);
      };
    }
  }, [containerRef.current, onMountAutoFocus, onUnmountAutoFocus, focusScope]);

  const handleKeyDown = React.useCallback(() => {
    if (!loop || focusScope.paused) return;
  }, []);

  return (
    <Primitive.div
      tabIndex={-1}
      data-focus={}
      {...etc}
      ref={mergeRefs([containerRef, forwardedRef])}
      onKeyDown={handleKeyDown}
      win-box-focus-scope=""
    />
  );
});

FocusScope.displayName = FOCUS_SCOPE_NAME;

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

/**
 * 聚焦第一个元素
 */
function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement;
  for (const candidate of candidates) {
    focus(candidate, { select });
    if (document.activeElement !== previouslyFocusedElement) return;
  }
}

/**
 * Returns the first and last tabbable elements inside a container.
 */
function getTabbableEdges(container: HTMLElement) {
  const candidates = getTabbableCandidates(container);
  const first = findVisible(candidates, container);
  const last = findVisible(candidates.reverse(), container);
  return [first, last] as const;
}

/**
 * 返回目标元素中可聚焦的元素
 *
 * NOTE: This is only a close approximation. For example it doesn't take into account cases like when
 * elements are not visible. This cannot be worked out easily by just reading a property, but rather
 * necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: any) => {
      const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden';
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
      // runtime's understanding of tabbability, so this automatically accounts
      // for any kind of element that could be tabbed to.
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);
  // we do not take into account the order of nodes with positive `tabIndex` as it
  // hinders accessibility to have tab order different from visual order.
  return nodes;
}

/**
 * Returns the first visible element in a list.
 * NOTE: Only checks visibility up to the `container`.
 */
function findVisible(elements: HTMLElement[], container: HTMLElement) {
  for (const element of elements) {
    // we stop checking if it's hidden at the `container` level (excluding)
    if (!isHidden(element, { upTo: container })) return element;
  }
}

function isHidden(node: HTMLElement, { upTo }: { upTo?: HTMLElement }) {
  if (getComputedStyle(node).visibility === 'hidden') return true;
  while (node) {
    // we stop at `upTo` (excluding it)
    if (upTo !== undefined && node === upTo) return false;
    if (getComputedStyle(node).display === 'none') return true;
    node = node.parentElement as HTMLElement;
  }
  return false;
}

function isSelectableInput(element: any): element is FocusableTarget & { select: () => void } {
  return element instanceof HTMLInputElement && 'select' in element;
}

function focus(element?: FocusableTarget | null, { select = false } = {}) {
  // only focus if that element is focusable
  if (element && element.focus) {
    const previouslyFocusedElement = document.activeElement;
    // NOTE: we prevent scrolling on focus, to minimize jarring transitions for users
    element.focus({ preventScroll: true });
    // only select if its not the same element, it supports selection and we need to select
    if (element !== previouslyFocusedElement && isSelectableInput(element) && select) element.select();
  }
}

/* -------------------------------------------------------------------------------------------------
 * FocusScope stack
 * -----------------------------------------------------------------------------------------------*/

type FocusScopeAPI = { paused: boolean; pause(): void; resume(): void };
const focusScopesStack = createFocusScopesStack();

function createFocusScopesStack() {
  /** A stack of focus scopes, with the active one at the top */
  let stack: FocusScopeAPI[] = [];

  return {
    add(focusScope: FocusScopeAPI) {
      // 顶部不是当前对象暂停焦点
      const activeFocusScope = stack[0];
      if (focusScope !== activeFocusScope) {
        activeFocusScope?.pause();
      }
      // 顶部添加当前对象
      stack = arrayRemove(stack, focusScope);
      stack.unshift(focusScope);
    },

    remove(focusScope: FocusScopeAPI) {
      stack = arrayRemove(stack, focusScope);
      stack[0]?.resume();
    },
  };
}

function arrayRemove<T>(array: T[], item: T) {
  const updatedArray = [...array];
  const index = updatedArray.indexOf(item);
  if (index !== -1) {
    updatedArray.splice(index, 1);
  }
  return updatedArray;
}

function removeLinks(items: HTMLElement[]) {
  return items.filter((item) => item.tagName !== 'A');
}

const Root = FocusScope;

export {
  FocusScope,
  //
  Root,
};
export type { FocusScopeProps };
