import type {
	EditorConfig,
	LexicalEditor,
	NodeKey,
	SerializedTextNode,
} from "lexical";
import { TextNode } from "lexical";

export class VariableNode extends TextNode {
	static getType(): string {
		return "variable";
	}

	static clone(node: VariableNode): VariableNode {
		return new VariableNode(node.__text, node.__key);
	}

	constructor(text: string, key?: NodeKey) {
		super(text, key);
	}

	isTextEntity(): boolean {
		return true;
	}

	createDOM(config: EditorConfig, editor?: LexicalEditor): HTMLElement {
		const dom = super.createDOM(config, editor);
		dom.classList.add("variable-node");
		return dom;
	}

	static importJSON(serializedNode: SerializedVariableNode): VariableNode {
		const node = new VariableNode(serializedNode.text);
		return node;
	}

	exportJSON(): SerializedVariableNode {
		const base = super.exportJSON() as SerializedTextNode;
		return {
			...base,
			type: "variable",
			version: 1,
		};
	}
}

export function $createVariableNode(text: string): VariableNode {
	return new VariableNode(text);
}

export function $isVariableNode(node: unknown): node is VariableNode {
	return node instanceof VariableNode;
}

export type SerializedVariableNode = SerializedTextNode & {
	type: "variable";
	version: 1;
};
