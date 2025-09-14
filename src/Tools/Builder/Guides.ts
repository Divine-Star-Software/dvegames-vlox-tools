import { elm, frag } from "@amodx/elm";
import { Graph, Node } from "@amodx/ncs/";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { Builder } from "./Builder";
import { BabylonContext } from "@dvegames/vlox/Babylon/Babylon.context";
import { RendererContext } from "@dvegames/vlox/Contexts/Renderer.context";
import CollapsibleSection from "../../UI/Components/CollapsibleSection";
import { TransformComponent } from "@dvegames/vlox/Transform.component";
import { AxesViewerComponent } from "@dvegames/vlox/Debug/AxesViewer.component";
import { VoxelPositionGuideComponent } from "@dvegames/vlox/Debug/VoxelPositionGuide.component";
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

  const axesNode = graph
    .addNode(Node("Guides", [AxesViewerComponent()]))
    .cloneCursor();
  const guideNode = graph
    .addNode(
      Node({}, [
        TransformComponent({
          position: { x: 0, y: 30, z: 0 },
        }),
        VoxelPositionGuideComponent(),
      ])
    )
    .cloneCursor();

  return CollapsibleSection(
    { title: "Guides" },
    frag(
      elm("p", {}, "World Axes"),
      SchemaEditor({
        schema: AxesViewerComponent.get(axesNode)!.schema,
      }),
      elm("p", {}, "Voxel Position Guide"),
      SchemaEditor({
        schema: TransformComponent.get(guideNode)!.schema,
      }),
      SchemaEditor({
        schema: VoxelPositionGuideComponent.get(guideNode)!.schema,
      })
    )
  );
}
