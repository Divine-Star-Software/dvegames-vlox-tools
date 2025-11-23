import {
  IVoxelShapeSelection,
  
} from "@divinevoxel/vlox/Templates/Shapes/Selections/VoxelShapeSelection";

export class BrushToolShapes {
  static ShapeRendered: Record<
    string,
    (
      template: IVoxelShapeSelection<any, any>
    ) => HTMLElement | DocumentFragment
  > = {};

  static registerShape<Shape extends IVoxelShapeSelection<any, any>>(
    id: string,
    create: (template: Shape) => HTMLElement | DocumentFragment
  ) {
    this.ShapeRendered[id] = create as any;
  }
}
