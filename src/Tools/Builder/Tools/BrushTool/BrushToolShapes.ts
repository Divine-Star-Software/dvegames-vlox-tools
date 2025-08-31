import { BasicVoxelShapeTemplate } from "@divinevoxel/vlox/Templates/Shapes/BasicVoxelShapeTemplate";
import {
  IVoxelShapeTemplate,
  IVoxelShapeTemplateData,
} from "@divinevoxel/vlox/Templates/Shapes/VoxelShapeTemplate.types";

export class BrushToolShapes {
  static ShapeRendered: Record<
    string,
    (
      template: IVoxelShapeTemplate<any, any, any>
    ) => HTMLElement | DocumentFragment
  > = {};

  static registerShape<Shape extends IVoxelShapeTemplate<any, any, any>>(
    id: string,
    create: (template: Shape) => HTMLElement | DocumentFragment
  ) {
    this.ShapeRendered[id] = create as any;
  }
}
