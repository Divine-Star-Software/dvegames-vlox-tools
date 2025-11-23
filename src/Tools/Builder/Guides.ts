import { elm, frag } from "@amodx/elm";
import { Graph, Node } from "@amodx/ncs/";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
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
  const axesNode = AxesViewerComponent.getRequired(
    graph.addNode(Node("Guides", [AxesViewerComponent({})]))
  );
  axesNode.schema.visible = false;
  const guideNode = VoxelPositionGuideComponent.getRequired(
    graph.addNode(
      Node({}, [
        TransformComponent({
          position: { x: 0, y: 30, z: 0 },
        }),
        VoxelPositionGuideComponent(),
      ])
    )
  );
  guideNode.schema.visible = false;

  return CollapsibleSection(
    { title: "Guides" },
    frag(
      elm("p", {}, "World Axes"),
      SchemaEditor({
        schema: axesNode.schema,
      }),
      elm("p", {}, "Voxel Position Guide"),
      SchemaEditor({
        schema: TransformComponent.get(guideNode?.node)!.schema,
      }),
      SchemaEditor({
        schema: guideNode!.schema,
      })
    )
  );
}
