import { WinBox, WinBoxResizing } from './components/winbox';

function App() {
  return (
    <WinBox width={400} height={400}>
      <div className="backdrop-blur-0">文字</div>
      <WinBoxResizing type="n" />
      <WinBoxResizing type="s" />
      <WinBoxResizing type="w" />
      <WinBoxResizing type="e" />
      <WinBoxResizing type="nw" />
      <WinBoxResizing type="ne" />
      <WinBoxResizing type="sw" />
      <WinBoxResizing type="se" />
    </WinBox>
  );
}

export default App;
