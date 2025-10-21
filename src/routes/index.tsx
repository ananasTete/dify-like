import { createFileRoute } from '@tanstack/react-router'
import Editor from '@/components/base/prompt-editor/editor'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      123
      <Editor />
    </div>
  )
}
