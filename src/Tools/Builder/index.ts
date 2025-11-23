import { elm, frag } from "@amodx/elm";
import VoxelDisplay from "./Components/VoxelDisplay";
import VoxelSelect from "./Components/Select/VoxelSelect";
import { ToolPanelViews } from "../../ToolPanelViews";
import { Graph, Node } from "@amodx/ncs/";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { Schema, SelectProp } from "@amodx/schemas";
import { Builder, BuilderToolIds } from "./Builder";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { RendererContext } from "@dvegames/vlox/Contexts/Renderer.context";
import HandTool from "./Tools/HandTool";
import BrushTool from "./Tools/BrushTool/index";
import BoxTool from "./Tools/SculptTool";
import WandTool from "./Tools/WandTool";
import PathTool from "./Tools/PathTool";
import WrenchTool from "./Tools/WrenchTool";
import CollapsibleSection from "../../UI/Components/CollapsibleSection";
import Guides from "./Guides";
import Templates from "./Templates";
import TemplateTool from "./Tools/TemplateTool";
import ShapeTool from "./Tools/ShapeTool";
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
    return frag(
      CollapsibleSection(
        { title: "Tools", opened: true },
        elm(
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
                  BuilderToolIds.Sculpt,
                  BuilderToolIds.Brush,
                  BuilderToolIds.Shape,
                  BuilderToolIds.Wand,
                  BuilderToolIds.Path,
                  BuilderToolIds.Wrench,
                  BuilderToolIds.Template,
                ],
                initialize(node) {
                  node.observers.updatedOrLoadedIn.subscribe(() =>
                    builder.setTool(node.get())
                  );
                },
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
            WrenchTool({ builder }),
            ShapeTool({ builder }),
            TemplateTool({ builder })
          ),
          elm("hr"),
          VoxelDisplay({ builder }),
          VoxelSelect({ builder })
        )
      ),
      Templates(graph),
      Guides(graph)
    );
  });
}
