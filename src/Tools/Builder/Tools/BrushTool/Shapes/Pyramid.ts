import { BrushToolShapes } from "../BrushToolShapes";
import { PyramidVoxelShapeSelection } from "@divinevoxel/vlox/Templates/Shapes/Selections/PyramidVoxelShapeSelection";
import { VoxelShapeShapeDirectionsArray } from "@divinevoxel/vlox/Templates/Shapes/VoxelShape.types";
import { SchemaEditor } from "../../../../../UI/Schemas/SchemaEditor";
import { IntProp, SelectProp } from "@amodx/schemas";
BrushToolShapes.registerShape(
  "Pyramid",
  (selection: PyramidVoxelShapeSelection) => {
    return SchemaEditor({
      properties: [
        IntProp("Falloff", {
          min: 1,
          max: 100,
          value: selection.fallOff,
          initialize: (node) => {
            node.observers.updatedOrLoadedIn.subscribe(
              () => (selection.fallOff = node.get())
            );
          },
        }),
        SelectProp("Direction", {
          options: VoxelShapeShapeDirectionsArray,
          value: selection.direction,
          initialize: (node) => {
            node.observers.updatedOrLoadedIn.subscribe(
              () => (selection.direction = node.get())
            );
          },
        }),
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
  }
);
