import { ElementChildren } from "@amodx/elm";
import { ToolPanelComponent } from "./ToolPanel.component";
type ViewRenderFunction = (component: typeof ToolPanelComponent["default"]) => ElementChildren;
export declare class ToolPanelViews {
    static views: Map<string, ViewRenderFunction>;
    static registerView(id: string, view: ViewRenderFunction): void;
    static getView(id: string): ViewRenderFunction;
    static getViews(): string[];
}
export {};
