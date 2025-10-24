import { createFileRoute } from "@tanstack/react-router";
import { Configuration } from "@/components/configuration";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return <div className="p-6"><Configuration /></div>;
}
