import { VoxelPaintDataComponent } from "@dvegames/vlox/Voxels/VoxelPaintData.component";
import { PaintVoxelData } from "@divinevoxel/vlox/Voxels";
import { Observable } from "@amodx/core/Observers";
export declare class BuilderState {
    static paintData: (typeof VoxelPaintDataComponent)["default"];
    static voxelUpdated: Observable<void>;
    static setData(data: Partial<PaintVoxelData>): void;
}
