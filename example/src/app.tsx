import { WinBox } from './components/winbox';
import { useWinBoxState } from 'win-box';

function Text() {
  const height = useWinBoxState((state) => state.height);
  const width = useWinBoxState((state) => state.width);
  return (
    <div>
      <div>height: {height}</div>
      <div>width: {width}</div>
    </div>
  );
}

function App() {
  return (
    <WinBox width={400} height={400} maxWidth="50%" maxHeight="50%">
      <Text />
    </WinBox>
  );
}

export default App;
