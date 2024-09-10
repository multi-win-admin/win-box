import { WinBox } from './components/winbox';
import { useWinBoxState } from 'win-box';

function Text() {
  const location = useWinBoxState(
    (state) =>
      `<div>x: ${state.x}</div><div>y: ${state.y}</div><div>height: ${state.height}</div><div>width:${state.width}</div>`,
  );
  return <div dangerouslySetInnerHTML={{ __html: location }}></div>;
}

function App() {
  return (
    <>
      <WinBox width={400} height={400} maxWidth="50%" maxHeight="50%">
        <Text />
      </WinBox>
      <WinBox width={400} height={400} maxWidth="50%" maxHeight="50%">
        <Text />
      </WinBox>
    </>
  );
}

export default App;
