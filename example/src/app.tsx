import { useEffect, useRef } from 'react';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleFocusIn(e: FocusEvent) {
      // 获取获得焦点DOM
      const target = e.target as HTMLElement | null;
      console.log(containerRef.current?.contains(target));
    }

    function handleFocusOut(e: FocusEvent) {
      // 获取接收焦点DOM
      const relatedTarget = e.relatedTarget as HTMLElement | null;
    }

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.addEventListener('focusin', handleFocusIn);
      document.addEventListener('focusout', handleFocusOut);
    };
  }, []);

  return (
    <div>
      <div tabIndex={-1} className="fixed top-1 left-1 h-8 w-8 bg-slate-100"></div>
      <div ref={containerRef} tabIndex={-1} className="fixed top-4 left-4 h-8 w-8 bg-slate-400"></div>
    </div>
  );
}

export default App;
