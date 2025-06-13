import { VoxelNamedState } from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import { Observable } from "@amodx/core/Observers";
export default function ItemNode({ state, enabledObserver, isGroup, }: {
    state: VoxelNamedState;
    isGroup?: boolean;
    enabledObserver?: Observable<boolean>;
}): HTMLDivElement;
