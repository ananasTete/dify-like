
EditorState

1. 可以把 EditorState 想象成编辑器在某一瞬间的“完整快照”。这个快照捕获了关于编辑器的一切信息，不仅包括你看到的所有文本内容、结构、还包括光标在哪里、哪些文字被选中了等等。
2. 任何一个给定的 EditorState 对象，都能精确地渲染出完全一样的编辑器视图（DOM 结构）。
3. 编辑器的所有视觉变化，都源于 EditorState 的变化。你不能直接去修改 DOM，而是要修改 EditorState，然后由 Lexical 根据新的 EditorState 去更新 DOM。

