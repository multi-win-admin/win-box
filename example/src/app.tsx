import { MouseEvent } from 'react';

function Counter() {
  function onMouseDown(e: MouseEvent<HTMLDivElement>) {
    console.log(e.clientX, e.clientY);
  }

  return (
    <div onMouseMove={onMouseDown} style={{ height: 200, width: 200, border: '1px solid #000' }}>
      文字
    </div>
  );
}

function App() {
  return (
    <div>
      <Counter />
    </div>
  );
}

export default App;
