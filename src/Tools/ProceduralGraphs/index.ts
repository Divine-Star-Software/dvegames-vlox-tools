import { elm, frag } from "@amodx/elm";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { ToolPanelViews } from "../../ToolPanelViews";
import { Graph } from "@amodx/ncs";
import CreateFlowEditor from "../../Flow/CreateFlowEditor";
export default function (graph: Graph) {
  setTimeout(() => {
    CreateFlowEditor();
  }, 400);
  ToolPanelViews.registerView("Procedural Graphs", (component) => {
    return frag(
      elm(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "row",
          },
        },
        elm(
          "button",
          {
            async onclick() {
              CreateFlowEditor();
            },
          },
          "New Graph"
        )
      )
    );
  });
}
