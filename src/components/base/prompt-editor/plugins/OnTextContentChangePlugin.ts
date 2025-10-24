import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

interface OnTextContentChangePluginProps {
	onChange: (textContent: string) => void;
}

const OnTextContentChangePlugin = ({
	onChange,
}: OnTextContentChangePluginProps) => {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const unregister = editor.registerTextContentListener(
			(textContent: string) => {
				onChange(textContent);
			},
		);

		return () => {
			unregister();
		};
	}, [editor, onChange]);

	return null;
};

export default OnTextContentChangePlugin;
