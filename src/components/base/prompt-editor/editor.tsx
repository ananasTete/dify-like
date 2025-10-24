import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { VariableNode } from "./nodes/VariableNode";
import TypeaheadVariableMenuPlugin from "./plugins/TypeaheadVariableMenuPlugin";
import VariableEntityTransformPlugin from "./plugins/VariableEntityTransformPlugin";

interface PromptEditorV2Props {
	onTextContentChange?: (textContent: string) => void;
	options?: string[];
}

const theme = {
	variable: "variable-node",
};

function onError(error: Error) {
	console.error(error);
}

const initialConfig = {
	namespace: "Dify_Like_Prompt_Editor_V2",
	theme,
	onError,
	nodes: [VariableNode],
};

export default function PromptEditorV2({ options }: PromptEditorV2Props) {
	return (
		<LexicalComposer initialConfig={initialConfig}>
			<RichTextPlugin
				contentEditable={
					<ContentEditable
						aria-placeholder={"Enter some text..."}
						placeholder={<div></div>}
						className="w-full h-full focus-within:outline-none"
					/>
				}
				ErrorBoundary={LexicalErrorBoundary}
			/>
			<VariableEntityTransformPlugin />
			<TypeaheadVariableMenuPlugin options={options} />
			<HistoryPlugin />
			<AutoFocusPlugin />
		</LexicalComposer>
	);
}
