import { BrushToolShapes } from "../BrushToolShapes";
import { SphereVoxelTemplate } from "@divinevoxel/vlox/Templates/Shapes/SphereVoxelTemplate";
import { SchemaEditor } from "../../../../../UI/Schemas/SchemaEditor";
import { IntProp } from "@amodx/schemas";
BrushToolShapes.registerShape("Sphere", (template: SphereVoxelTemplate) => {
  return SchemaEditor({
    properties: [
      IntProp("Radius", {
        min: 1,
        max: 100,
        value: template.radius,
        initialize: (node) => {
          node.observers.updatedOrLoadedIn.subscribe(
            () => (template.radius = node.get())
          );
        },
      }),
    ],
  });
});
