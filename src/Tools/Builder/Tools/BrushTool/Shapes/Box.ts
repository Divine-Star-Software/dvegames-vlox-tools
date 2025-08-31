import { BrushToolShapes } from "../BrushToolShapes";
import { BoxVoxelTemplate } from "@divinevoxel/vlox/Templates/Shapes/BoxVoxelTemplate";
import { SchemaEditor } from "../../../../../UI/Schemas/SchemaEditor";
import { IntProp } from "@amodx/schemas";
BrushToolShapes.registerShape("Box", (template: BoxVoxelTemplate) => {
  return SchemaEditor({
    properties: [
      IntProp("Width", {
        min: 1,
        max: 100,
        value: template.width,
        initialize: (node) => {
          node.observers.updatedOrLoadedIn.subscribe(
            () => (template.width = node.get())
          );
        },
      }),
      IntProp("Height", {
        min: 1,
        max: 100,
        value: template.height,
        initialize: (node) => {
          node.observers.updatedOrLoadedIn.subscribe(
            () => (template.height = node.get())
          );
        },
      }),
      IntProp("Depth", {
        min: 1,
        max: 100,
        value: template.depth,
        initialize: (node) => {
          node.observers.updatedOrLoadedIn.subscribe(
            () => (template.depth = node.get())
          );
        },
      }),
    ],
  });
});
