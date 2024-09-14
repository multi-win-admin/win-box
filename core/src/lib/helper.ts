import * as React from 'react';

function addWindowListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  window.addEventListener(type, listener, options);
}

function removeWindowListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  window.removeEventListener(type, listener, options);
}

/**
 * 把%数值转换为像素数值
 * @param num
 * @returns
 */
function parseToPx(num: string | number, viewport: number): number {
  if (typeof num === 'string') {
    const value = parseFloat(num);
    const unit = '' + value !== num && num.substring(('' + value).length);
    if (unit === '%') {
      return ((viewport / 100) * value + 0.5) | 0;
    } else {
      return value;
    }
  }

  return num;
}

function parseToPxOfDefault(num: string | number | undefined, viewport: number, defaultNum = 0) {
  return num ? parseToPx(num, viewport) : defaultNum;
}

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

export { addWindowListener, removeWindowListener, parseToPx, parseToPxOfDefault, mergeRefs }