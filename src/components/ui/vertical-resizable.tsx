import { Resizable } from "re-resizable";
import type { FC, ReactNode } from "react";

interface VerticalResizableProps {
	minWidth?: number;
	minHeight?: number;
	initialHeight?: number;
	height?: number; // controlled height
	onHeightChange?: (height: number) => void; // controlled callback
	className?: string;
	handleClassName?: string;
	children?: ReactNode;
	footer?: ReactNode;
}

const VerticalResizable: FC<VerticalResizableProps> = ({
	minWidth,
	minHeight = 200,
	initialHeight = 200,
	height: controlledHeight,
	onHeightChange,
	className,
	handleClassName,
	children,
	footer,
}: VerticalResizableProps) => {
	return (
		<Resizable
			size={{
				width: "auto",
				height: controlledHeight ?? initialHeight,
			}}
			minWidth={minWidth}
			minHeight={minHeight}
			enable={{
				top: false,
				right: false,
				bottom: true,
				left: false,
				topRight: false,
				bottomRight: false,
				bottomLeft: false,
				topLeft: false,
			}}
			onResizeStop={(_e, _direction, _ref, d) => {
				const newHeight = (controlledHeight ?? initialHeight) + d.height;
				onHeightChange?.(newHeight);
			}}
			handleStyles={{
				bottom: {
					bottom: 0,
					height: "24px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: "row-resize",
				},
			}}
			handleComponent={{
				bottom: (
					<div className="w-full h-full flex items-center justify-center">
						<div className={`w-6 h-0.5 bg-gray-300 rounded-full ${handleClassName ?? ""}`} />
					</div>
				),
			}}
			className={`flex flex-col ${className ?? ""}`}
		>
			<div className="flex-1 overflow-auto">{children}</div>
			{footer && <div className="pl-2 py-1">{footer}</div>}
		</Resizable>
	);
};

export default VerticalResizable;


