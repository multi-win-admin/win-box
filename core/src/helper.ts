export function addWindowListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  window.addEventListener(type, listener, options);
}

export function removeWindowListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  window.removeEventListener(type, listener, options);
}

/**
 * 把%、vh、vm数值转换为像素数值
 * @param num 
 * @returns 
 */
export function parseToPx(num: string | number, viewport: number): number {
  if (typeof num === 'string') {
    const value = parseFloat(num);
    const unit = (("" + value) !== num) && num.substring(("" + value).length);
    if (unit === '%') {
      return (viewport / 100 * value + 0.5) | 0;
    } else {
      return value;
    }
  }

  return num;
}

export function parseToPxOfDefault(num: string | number | undefined, viewport: number, defaultNum = 0) {
  return num ? parseToPx(num, viewport) : defaultNum;
}