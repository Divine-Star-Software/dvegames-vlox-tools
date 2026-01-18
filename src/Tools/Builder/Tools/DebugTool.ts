import { frag } from "@amodx/elm";
import { Builder, BuilderToolIds } from "../Builder";
import { ToolUIElememt } from "./ToolUIElement";
import { DebugTool } from "@divinevoxel/vlox/Builder/Tools/Debug/DebugTool";
import { VoxelSelectionHighlight } from "@divinevoxel/vlox-babylon/Tools/VoxelSelectionHighlight";

export default function ({ builder }: { builder: Builder }) {
  let onDispose: (() => void) | null = null;
  const debugTool = new DebugTool(builder.space);

  const voxelSelectionHighlight = new VoxelSelectionHighlight(builder.scene);
  voxelSelectionHighlight.mesh.setColor(0, 0, 1);

  const mountTool = () => {
    voxelSelectionHighlight.setEnabled(true);
    const pointerDown = builder.createEventListener(
      "pointer-down",
      async (event) => {
        if (event.detail.button !== 0) return;
        debugTool.voxelData = builder.paintData;
        await debugTool.use();
      },
    );
    builder.addEventListener("pointer-down", pointerDown);
    const rayUpdated = builder.rayProvider.createEventListener(
      "updated",
      async () => {
        await debugTool.update();
        if (!debugTool.picked) {
          if (voxelSelectionHighlight.isEnaebled())
            voxelSelectionHighlight.setEnabled(false);
          return;
        }

        if (!voxelSelectionHighlight.isEnaebled())
          voxelSelectionHighlight.setEnabled(true);

        voxelSelectionHighlight.update(debugTool.selection);
      },
    );
    builder.rayProvider.addEventListener("updated", rayUpdated);
    onDispose = () => {
      builder.removeEventListener("pointer-down", pointerDown);
      builder.rayProvider.removeEventListener("updated", rayUpdated);
      onDispose = null;
    };
  };
  const unMountTool = () => {
    if (onDispose) onDispose();
    voxelSelectionHighlight.setEnabled(false);
  };

  builder.addEventListener("tool-set", () => {
    if (builder.activeTool == BuilderToolIds.Debug) return mountTool();
    unMountTool();
  });

  return ToolUIElememt({
    builder,
    toolId: BuilderToolIds.Debug,
    children: frag(),
  });
}
