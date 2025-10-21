import {$getRoot, $getSelection, type EditorState} from 'lexical';
import {useEffect} from 'react'; 

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';

import OnChangePlugin from './plugins/on-change'

const theme = {
  paragraph: 'text-blue-500',
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

function Editor() { 
  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError,
  };

  const onChange = (editorState: string) => {
    console.log(3, editorState)
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder={'Enter some text...'}
            placeholder={<div>Enter some text...</div>}
            className='w-[200px] h-[200px] border border-gray-300 rounded-md p-2'
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={onChange} />
      {/* <HistoryPlugin /> */}
      {/* <AutoFocusPlugin /> */}
    </LexicalComposer>
  );
}

export default Editor;

/**
 * 1. lexicalComposer 是编辑器实例，可以配置主题。主题以对象的形式配置，对象的键是节点的类型，值是节点的样式类。
 */