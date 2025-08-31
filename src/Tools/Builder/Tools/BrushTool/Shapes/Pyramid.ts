import { BrushToolShapes } from "../BrushToolShapes";
import { PyramidVoxelTemplate } from "@divinevoxel/vlox/Templates/Shapes/PyramidVoxelTemplate";
import { VoxelShapeTemplateShapeDirectionsArray } from "@divinevoxel/vlox/Templates/Shapes/VoxelShapeTemplate.types";
import { SchemaEditor } from "../../../../../UI/Schemas/SchemaEditor";
import { IntProp, SelectProp } from "@amodx/schemas";
BrushToolShapes.registerShape("Pyramid", (template: PyramidVoxelTemplate) => {
  return SchemaEditor({
    properties: [
      IntProp("Falloff", {
        min: 1,
        max: 100,
        value: template.fallOff,
        initialize: (node) => {
          node.observers.updatedOrLoadedIn.subscribe(
            () => (template.fallOff = node.get())
          );
        },
      }),
      SelectProp("Direction", {
        options: VoxelShapeTemplateShapeDirectionsArray,
        value: template.direction,
        initialize: (node) => {
          node.observers.updatedOrLoadedIn.subscribe(
            () => (template.direction = node.get())
          );
        },
      }),
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
