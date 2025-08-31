import { elm } from "@amodx/elm";
import VoxelDisplay from "./Components/VoxelDisplay";
import VoxelSelect from "./Components/Select/VoxelSelect";
import { ToolPanelViews } from "../../ToolPanelViews";
import { Graph } from "@amodx/ncs/";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { Schema, SelectProp } from "@amodx/schemas";
import { Builder, BuilderToolIds } from "./Builder";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { RendererContext } from "@dvegames/vlox/Contexts/Renderer.context";
import HandTool from "./Tools/HandTool";
import BrushTool from "./Tools/BrushTool/index";
import BoxTool from "./Tools/BoxTool";
import WandTool from "./Tools/WandTool";
import PathTool from "./Tools/PathTool";
import WrenchTool from "./Tools/WrenchTool";

elm.css(/* css */ `
.builder {
  display: flex;
  flex-direction: column;
  overflow: hidden;


  hr {
    width: 100%;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

}
  `);
export default function (graph: Graph) {
  const rendererContext = RendererContext.getRequired(graph.root);
  const { scene } = BabylonContext.getRequired(graph.root).data;

  const builder = new Builder(rendererContext.data.dve, scene);

  scene.registerBeforeRender(() => {
    builder;
  });

  ToolPanelViews.registerView("Build", () => {
    return elm(
      "div",
      {
        className: "builder",
        hooks: {
          afterRender() {
            builder.setTool(BuilderToolIds.Hand);
          },
        },
      },
      SchemaEditor({
        schemaInstance: Schema.CreateInstance(
          SelectProp("tool", {
            options: [
              BuilderToolIds.Hand,
              BuilderToolIds.Box,
              BuilderToolIds.Brush,
              BuilderToolIds.Wand,
              BuilderToolIds.Path,
              BuilderToolIds.Wrench,
            ],
            initialize: (node) =>
              node.observers.updatedOrLoadedIn.subscribe(() =>
                builder.setTool(node.get())
              ),
          })
        ),
      }),
      elm(
        "div",
        {},
        HandTool({ builder }),
        WandTool({ builder }),
        BoxTool({ builder }),
        BrushTool({ builder }),
        PathTool({ builder }),
        WrenchTool({ builder })
      ),
      elm("hr"),
      VoxelDisplay({ builder }),
      VoxelSelect({ builder })
    );
  });
}
