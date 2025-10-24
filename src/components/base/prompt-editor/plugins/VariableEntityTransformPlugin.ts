import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, TextNode } from "lexical";
import { useEffect } from "react";
import { $createVariableNode, $isVariableNode, VariableNode } from "../nodes/VariableNode";

const VAR_REGEX_GLOBAL = /\{\{[^{}\n]+\}\}/g;
const VAR_REGEX_EXACT = /^\{\{[^{}\n]+\}\}$/;

export default function VariableEntityTransformPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		const unregisterText = editor.registerNodeTransform(TextNode, (node) => {
			// 组合输入时不转换，避免 IME 抖动
			if (node.isComposing()) return;
			// 已经是实体节点时跳过（VariableNode 继承自 TextNode，所以这里可能命中）
			if ($isVariableNode(node as unknown)) return;
			const text = node.getTextContent();
			if (!text.includes("{{") || !text.includes("}}")) return;

			// 整段是一个实体：直接替换
			if (VAR_REGEX_EXACT.test(text)) {
				node.replace($createVariableNode(text));
				return;
			}

			// 含有多个实体，按边界拆分
			VAR_REGEX_GLOBAL.lastIndex = 0;
			const splitOffsets: number[] = [];
			let matchesCount = 0;
			let m: RegExpExecArray | null = VAR_REGEX_GLOBAL.exec(text);
			while (m) {
				const start = m.index;
				const end = start + m[0].length;
				if (start > 0) splitOffsets.push(start);
				if (end < text.length) splitOffsets.push(end);
				matchesCount += 1;
				m = VAR_REGEX_GLOBAL.exec(text);
			}
			// 防御：单节点内匹配过多则跳过，避免过度分片
			const MAX_MATCHES_PER_NODE = 300;
			if (matchesCount > MAX_MATCHES_PER_NODE) return;
			if (splitOffsets.length === 0) return;

			const uniqueSorted = Array.from(new Set(splitOffsets)).sort((a, b) => a - b);
			const segments = node.splitText(...uniqueSorted);
			for (const seg of segments) {
				const segText = seg.getTextContent();
				if (VAR_REGEX_EXACT.test(segText)) {
					seg.replace($createVariableNode(segText));
				}
			}
		});

		// VariableNode 失配时降级为普通文本
		const unregisterVar = editor.registerNodeTransform(VariableNode, (node) => {
			// 组合输入期间不降级，等输入完成后再判断
			if (node.isComposing()) return;
			const text = node.getTextContent();
			if (!VAR_REGEX_EXACT.test(text)) {
				node.replace($createTextNode(text));
			}
		});

		return () => {
			unregisterText();
			unregisterVar();
		};
	}, [editor]);

	return null;
}


