import { BrushToolShapes } from "../BrushToolShapes";
import { EllipsoidVoxelShapeSelection } from "@divinevoxel/vlox/Templates/Shapes/Selections/EllipsoidVoxelShapeSelection";
import { SchemaEditor } from "../../../../../UI/Schemas/SchemaEditor";
import { IntProp } from "@amodx/schemas";
BrushToolShapes.registerShape(
  "Ellipsoid",
  (selection: EllipsoidVoxelShapeSelection) => {
    return SchemaEditor({
      properties: [
        IntProp("Radius X", {
          min: 1,
          max: 100,
          value: selection.radiusX,
          initialize: (node) => {
            node.observers.updatedOrLoadedIn.subscribe(
              () => (selection.radiusX = node.get())
            );
          },
        }),
        IntProp("Radius Y", {
          min: 1,
          max: 100,
          value: selection.radiusY,
          initialize: (node) => {
            node.observers.updatedOrLoadedIn.subscribe(
              () => (selection.radiusY = node.get())
            );
          },
        }),
        IntProp("Radius Z", {
          min: 1,
          max: 100,
          value: selection.radiusZ,
          initialize: (node) => {
            node.observers.updatedOrLoadedIn.subscribe(
              () => (selection.radiusZ = node.get())
            );
          },
        }),
      ],
    });
  }
);
