import { BrushToolShapes } from "../BrushToolShapes";
import { BoxVoxelShapeSelection } from "@divinevoxel/vlox/Templates/Shapes/Selections/BoxVoxelShapeSelection";
import { SchemaEditor } from "../../../../../UI/Schemas/SchemaEditor";
import { IntProp } from "@amodx/schemas";
BrushToolShapes.registerShape("Box", (selection: BoxVoxelShapeSelection) => {
  return SchemaEditor({
    properties: [
      IntProp("Width", {
        min: 1,
        max: 100,
        value: selection.width,
        initialize: (node) => {
          node.observers.updatedOrLoadedIn.subscribe(
            () => (selection.width = node.get())
          );
        },
      }),
      IntProp("Height", {
        min: 1,
        max: 100,
        value: selection.height,
        initialize: (node) => {
          node.observers.updatedOrLoadedIn.subscribe(
            () => (selection.height = node.get())
          );
        },
      }),
      IntProp("Depth", {
        min: 1,
        max: 100,
        value: selection.depth,
        initialize: (node) => {
          node.observers.updatedOrLoadedIn.subscribe(
            () => (selection.depth = node.get())
          );
        },
      }),
    ],
  });
});
