import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";  

function OnChangePlugin({ onChange }: { onChange: (editorState: string) => void }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
      return editor.registerUpdateListener(({editorState}) => {
        console.log(1, editorState);
        console.log(2, editorState.toJSON());
        console.log(3, JSON.stringify(editorState.toJSON()));
        
        onChange(JSON.stringify(editorState.toJSON()));
      });
    }, [editor, onChange]);
    return null;
    }

    export default OnChangePlugin

/**
 * 1. 插件可以理解为一个 react hook，它通过调用 lexical 的 hook 或 api 实现功能
 * 2. 使用 useLexicalComposerContext 获取编辑器实例
 * 3. 注册编辑器更新监听器
 * 4. 要存储编辑器状态就要先序列化，使用 editor.toJSON() 返回的是一个对象，所以还需要先转换为JSON字符串
 */