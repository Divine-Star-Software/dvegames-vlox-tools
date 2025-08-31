import { BrushToolShapes } from "../BrushToolShapes";
import { EllipsoidVoxelTemplate } from "@divinevoxel/vlox/Templates/Shapes/EllipsoidVoxelTemplate";
import { SchemaEditor } from "../../../../../UI/Schemas/SchemaEditor";
import { IntProp } from "@amodx/schemas";
BrushToolShapes.registerShape(
  "Ellipsoid",
  (template: EllipsoidVoxelTemplate) => {
    return SchemaEditor({
      properties: [
        IntProp("Radius X", {
          min: 1,
          max: 100,
          value: template.radiusX,
          initialize: (node) => {
            node.observers.updatedOrLoadedIn.subscribe(
              () => (template.radiusX = node.get())
            );
          },
        }),
        IntProp("Radius Y", {
          min: 1,
          max: 100,
          value: template.radiusY,
          initialize: (node) => {
            node.observers.updatedOrLoadedIn.subscribe(
              () => (template.radiusY = node.get())
            );
          },
        }),
        IntProp("Radius Z", {
          min: 1,
          max: 100,
          value: template.radiusZ,
          initialize: (node) => {
            node.observers.updatedOrLoadedIn.subscribe(
              () => (template.radiusZ = node.get())
            );
          },
        }),
      ],
    });
  }
);
