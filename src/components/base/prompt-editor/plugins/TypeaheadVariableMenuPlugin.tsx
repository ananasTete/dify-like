import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, $getSelection, $isRangeSelection, $isTextNode, COMMAND_PRIORITY_HIGH, KEY_ARROW_DOWN_COMMAND, KEY_ARROW_UP_COMMAND, KEY_ENTER_COMMAND, KEY_ESCAPE_COMMAND } from "lexical";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { $createVariableNode } from "../nodes/VariableNode";

interface TypeaheadVariableMenuPluginProps {
	options?: string[];
}

const DEFAULT_OPTIONS = ["变量", "日期", "用户"];

function getCaretClientRect(): DOMRect | null {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return null;
	const range = selection.getRangeAt(0).cloneRange();
	range.collapse(true);
	const rects = range.getClientRects();
	const rect = rects[0] || range.getBoundingClientRect();
	return rect ?? null;
}

export default function TypeaheadVariableMenuPlugin({ options }: TypeaheadVariableMenuPluginProps) {
	const [editor] = useLexicalComposerContext();
	const allOptions = useMemo(() => options ?? DEFAULT_OPTIONS, [options]);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
	const [activeId, setActiveId] = useState<string | null>(null);

	const isOpenRef = useRef(isOpen);
	useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

	const filtered = useMemo(() => allOptions, [allOptions]);

	// 监听编辑器变化，决定是否触发与更新查询
	useEffect(() => {
		return editor.registerUpdateListener(({ editorState }) => {
			let shouldOpen = false;
			editorState.read(() => {
				const selection = $getSelection();
				if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;
				const anchor = selection.anchor;
				const node = anchor.getNode();
				if (!$isTextNode(node)) return;
				// 组合输入期间不触发菜单，避免 IME 抖动
				if (node.isComposing()) return;
				const offset = anchor.offset;
				const text = node.getTextContent();
				const charBefore = offset > 0 ? text[offset - 1] : "";
				// 触发字符：'/' 或 '{'
				if (charBefore === "/" || charBefore === "{") {
					shouldOpen = true;
					return;
				}
			});

			if (shouldOpen) {
				const rect = getCaretClientRect();
				if (rect) {
					const nextPos = { top: rect.bottom + window.scrollY, left: rect.left + window.scrollX };
					setPosition((prev) => (prev && prev.top === nextPos.top && prev.left === nextPos.left ? prev : nextPos));
					setIsOpen(true);
					setSelectedIndex(0);
				} else {
					setIsOpen(false);
					setPosition(null);
				}
			} else {
				setIsOpen(false);
				setPosition(null);
				setActiveId(null);
			}
		});
	}, [editor]);

	const insertVariable = useCallback((label: string) => {
		editor.update(() => {
			const selection = $getSelection();
			if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;
			const anchor = selection.anchor;
			const node = anchor.getNode();
			if (!$isTextNode(node)) return;
			const offset = anchor.offset;
			const text = node.getTextContent();
			// 删除触发字符与查询
			let i = offset - 1;
			while (i >= 0 && text[i] !== "/" && text[i] !== "{") i--;
			if (i < 0) return;
			const before = text.slice(0, i);
			const after = text.slice(offset);
			// 用实体节点替换触发串
			const variableText = `{{${label}}}`;
			// 将当前 TextNode 替换为三段：before + VariableNode + after
			node.setTextContent(before);
			node.selectEnd();
			node.insertAfter($createVariableNode(variableText));
			const afterNode = $createTextNode(after);
			node.getNextSibling()?.insertAfter(afterNode) ?? node.insertAfter(afterNode);
			afterNode.select(0, 0);
		});
		setIsOpen(false);
		setPosition(null);
	}, [editor]);

	// 键盘处理：上下、回车、ESC
	useEffect(() => {
		const unregisterDown = editor.registerCommand(KEY_ARROW_DOWN_COMMAND, (e) => {
			if (!isOpenRef.current || filtered.length === 0) return false;
			e?.preventDefault();
			setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
			return true;
		}, COMMAND_PRIORITY_HIGH);
		const unregisterUp = editor.registerCommand(KEY_ARROW_UP_COMMAND, (e) => {
			if (!isOpenRef.current || filtered.length === 0) return false;
			e?.preventDefault();
			setSelectedIndex((i) => Math.max(i - 1, 0));
			return true;
		}, COMMAND_PRIORITY_HIGH);
		const unregisterEnter = editor.registerCommand(KEY_ENTER_COMMAND, (e) => {
			if (!isOpenRef.current || filtered.length === 0) return false;
			e?.preventDefault();
			insertVariable(filtered[selectedIndex] ?? filtered[0]);
			return true;
		}, COMMAND_PRIORITY_HIGH);
		const unregisterEsc = editor.registerCommand(KEY_ESCAPE_COMMAND, (e) => {
			if (!isOpenRef.current) return false;
			e?.preventDefault();
		setIsOpen(false);
		setPosition(null);
			return true;
		}, COMMAND_PRIORITY_HIGH);
		return () => {
			unregisterDown();
			unregisterUp();
			unregisterEnter();
			unregisterEsc();
		};
	}, [editor, filtered, selectedIndex, insertVariable]);

if (!isOpen || !position) return null;

	return createPortal(
		<div role="listbox" tabIndex={0} aria-label="插入变量" aria-activedescendant={activeId ?? undefined} style={{ position: "absolute", top: position.top, left: position.left, zIndex: 50 }} className="min-w-[200px] rounded-md border bg-white shadow-md">
			<div className="py-1">
				{filtered.map((opt, idx) => (
					<button
						type="button"
						role="option"
						aria-selected={idx === selectedIndex}
						id={`typeahead-opt-${opt}`}
						key={opt}
						className={"w-full text-left px-3 py-2 cursor-default select-none text-sm " + (idx === selectedIndex ? "bg-gray-100 text-gray-900" : "text-gray-700")}
						onMouseEnter={() => setSelectedIndex(idx)}
						onMouseDown={(e) => { e.preventDefault(); insertVariable(opt); }}
					>
						{opt}
					</button>
				))}
				{/* 不需要搜索筛选提示 */}
			</div>
		</div>,
		document.body,
	);
}


