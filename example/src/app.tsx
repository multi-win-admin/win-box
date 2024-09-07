import { WinBox, WinBoxResizing } from './components/winbox';

function App() {
  return (
    <WinBox width={400} height={400}>
      <div className="backdrop-blur-0">文字</div>
      <WinBoxResizing type="e" />
    </WinBox>
  );
}

export default App;
