import { useState } from "react";
import { PromptEditor } from "../base/prompt-editor";
import { Button } from "../ui/button";
import VerticalResizable from "../ui/vertical-resizable";

const ConfigurationLayout = () => {
	const [textContent, setTextContent] = useState<string>("");
	const [isPromptDirty, setIsPromptDirty] = useState<boolean>(false);
	const [panelHeight, setPanelHeight] = useState<number>(200);
	return (
		<div className="rounded-md bg-gray-200 flex flex-col">
			{/* header */}
			<div className="flex h-14 items-center px-6">
				<span className="flex-1">编排</span>
				<Button>发布</Button>
			</div>
			<div className="flex-1">
				{/* content */}
				<div className="flex-1">
					<div className="flex-1 overflow-auto">
						<PromptEditor
							onTextContentChange={(_textContent: string) => {
								setTextContent(_textContent);
								setIsPromptDirty(true);
							}}
						/>
					</div>
				</div>
				<VerticalResizable
					className="bg-white rounded-md w-[200px]"
					height={panelHeight}
					onHeightChange={setPanelHeight}
					minHeight={200}
					minWidth={200}
					footer={
						<div className="bg-gray-300 rounded-md px-1 py-0.5 w-fit text-xs">
							{textContent.length}
						</div>
					}
				>
					<div className="px-2 py-1 h-full">
						<PromptEditor
							onTextContentChange={(_textContent: string) => {
								setTextContent(_textContent);
								setIsPromptDirty(true);
							}}
						/>
					</div>
				</VerticalResizable>
			</div>
			<div>
				<p>Text Content: {textContent}</p>
				<button type="button" onClick={() => setIsPromptDirty(false)}>
					{isPromptDirty ? "重制" : "正常UI"}
				</button>
			</div>
		</div>
	);
};

export default ConfigurationLayout;
