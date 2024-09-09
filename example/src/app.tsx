import { WinBox } from './components/winbox';

function Text() {
  console.log('文字是否渲染');
  return <div>文字</div>;
}

function App() {
  return (
    <WinBox url="https://zh-hans.react.dev/versions" width={400} height={400}>
      <Text />
    </WinBox>
  );
}

export default App;
