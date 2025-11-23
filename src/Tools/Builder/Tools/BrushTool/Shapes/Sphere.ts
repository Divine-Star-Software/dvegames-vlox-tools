import { BrushToolShapes } from "../BrushToolShapes";
import { SphereVoxelShapeSelection } from "@divinevoxel/vlox/Templates/Shapes/Selections/SphereVoxelShapeSelection";
import { SchemaEditor } from "../../../../../UI/Schemas/SchemaEditor";
import { IntProp } from "@amodx/schemas";
BrushToolShapes.registerShape(
  "Sphere",
  (selection: SphereVoxelShapeSelection) => {
    return SchemaEditor({
      properties: [
        IntProp("Radius", {
          min: 1,
          max: 100,
          value: selection.radius,
          initialize: (node) => {
            node.observers.updatedOrLoadedIn.subscribe(
              () => (selection.radius = node.get())
            );
          },
        }),
      ],
    });
  }
);
