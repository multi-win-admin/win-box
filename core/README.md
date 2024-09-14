# WinBox 设计文档

## 组件 Component

WinBox Component 提供的无样式功能组件。

### WinBox

```typescript

interface WinBoxProps {
  /** 窗口是否打开，默认值: true */
  open?: boolean;
  /** 是否隐藏窗口，默认值: false */
  hidden?: boolean;
  /** 窗口打开或关闭回调 */
  onOpenChange?: (open: boolean) => void;
  /** 窗口隐藏回调  */
  onHiddenChange?: (hidden: boolean) => void;
  /** 窗口从全屏、最小化、最大化状态返回到窗口状态时回调 */
  onRestore: () => void;
  /** 窗口创建完成回调 */
  onCreate?: () => void;
  /** 是否为模态框，默认值: false */
  modal?: boolean;
}

```

### WinBoxTrigger

```typescript

interface WinBoxTriggerProps {
  asChild: boolean;
}

```

### WinBoxPortal

```typescript

interface WinBoxPortalProps {
  /** 指定要将内容挂载到指定的容器节点，默认值: document.body */
  container?: HTMLElement;
}

```

### WinBoxOverlay

```typescript

interface WinBoxOverlayProps {
  asChild: boolean;
}

```

### WinBoxContent

```typescript

interface WinBoxContentProps {
  /** 窗口移动回调 */
  onMove?: () => void;
  /** 窗口大小改变回调 */
  onResize?: () => void;
  asChild: boolean;
}

```

### WinBoxHeader

```typescript

interface WinBoxHeaderProps {
  asChild: boolean;
}

```

### WinBoxDrag

```typescript

interface WinBoxDragProps {
  asChild: boolean;
  children?: React.ReactNode;
}

```

### WinBoxIcon

```typescript

interface WinBoxIconProps {
  asChild: boolean;
  children?: React.ReactNode;
}

```

### WinBoxTitle

```typescript

interface WinBoxTitleProps {
  asChild: boolean;
  children?: React.ReactNode;
}

```

### WinBoxControls

```typescript

interface WinBoxControlsProps {
  asChild: boolean;
  children?: React.ReactNode;
}

```

### WinBoxClose

```typescript

interface WinBoxCloseProps {
  asChild: boolean;
}

```

### WinBoxFullScreen

```typescript

interface WinBoxFullScreenProps {
  asChild: boolean;
}

```

### WinBoxMaximize

```typescript

interface WinBoxMaximizeProps {
  asChild: boolean;
}

```

### WinBoxMinimize

```typescript

interface WinBoxMinimizeProps {
  asChild: boolean;
}

```

### WinBoxBody

```typescript

interface WinBoxBodyProps {
  /** 窗口打开的URL地址 */
  url?: string;
  asChild: boolean;
  children?: React.ReactNode;
}

```

### WinBoxResize

```typescript

interface WinBoxResizeProps {
  asChild: boolean;
  /** 窗口边缘拖动类型 */
  type?: 'n' | 's' | 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se';
}

```

## 示例 Examples

### 完整结构

```tsx

<WinBox.Root>
  <WinBox.Trigger />
  <WinBox.Portal>
    <WinBox.Overlay />
    <WinBox.Content>
      <WinBox.Header>
        <WinBox.Drag>
          <WinBox.Icon />
          <WinBox.Title />
        </WinBox.Drag>
        <WinBox.Controls>
          <WinBox.Minimize />
          <WinBox.Maximize />
          <WinBox.FullScreen />
          <WinBox.Close />
        </WinBox.Controls>
      </WinBox.Header>
      <WinBox.Body>
        <div>内容</div>
      </WinBox.Body>
      <WinBox.Resize />
    </WinBox.Content>
  </WinBox.Portal>
</WinBox.Root>

```

### 精简结构

```tsx

<WinBox.Root>
  <WinBox.Trigger />
  <WinBox.Portal>
    <WinBox.Overlay />
    <WinBox.Content>
      <WinBox.Drag />
      <WinBox.Minimize />
      <WinBox.Maximize />
      <WinBox.FullScreen />
      <WinBox.Close />
      <WinBox.Body />
      <WinBox.Resize />
    </WinBox.Content>
  </WinBox.Portal>
</WinBox.Root>

```
