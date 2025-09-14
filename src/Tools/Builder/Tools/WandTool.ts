import { frag } from "@amodx/elm";
import { Builder, BuilderToolIds } from "../Builder";
import { ToolUIElememt } from "./ToolUIElement";
import {
  WandTool,
  WandToolModes,
} from "@divinevoxel/vlox/Builder/Tools/Wand/WandTool";
import { SchemaEditor } from "../../../UI/Schemas/SchemaEditor";
import { Schema, SelectProp } from "@amodx/schemas";
import { VoxelSelectionHighlight } from "@divinevoxel/vlox-babylon/Tools/VoxelSelectionHighlight";
import { Vec3Array } from "@amodx/math";
const colors: Record<WandToolModes, Vec3Array> = {
  [WandToolModes.Place]: [0, 1, 0],
  [WandToolModes.Extrude]: [1, 1, 0],
  [WandToolModes.Remove]: [1, 0, 0],
};
export default function ({ builder }: { builder: Builder }) {
  let onDispose: (() => void) | null = null;
  const wandTool = new WandTool(builder.space);

  const voxelSelectionHighlight = new VoxelSelectionHighlight(builder.scene);
  voxelSelectionHighlight.mesh.setColor(...colors[wandTool.mode]);

  const mountTool = () => {
    voxelSelectionHighlight.setEnabled(true);
    const pointerDown = builder.createEventListener(
      "pointer-down",
      async (event) => {
        if (event.detail.button !== 0) return;
        wandTool.voxelData = builder.paintData;
        await wandTool.use();
      }
    );
    builder.addEventListener("pointer-down", pointerDown);
    const rayUpdated = builder.rayProvider.createEventListener(
      "updated",
      async () => {
        await wandTool.update();
        if (!wandTool.picked) {
          if (voxelSelectionHighlight.isEnaebled())
            voxelSelectionHighlight.setEnabled(false);
          return;
        }
        if (!voxelSelectionHighlight.isEnaebled())
          voxelSelectionHighlight.setEnabled(true);
        voxelSelectionHighlight.update(wandTool.selection);
      }
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
    if (builder.activeTool == BuilderToolIds.Wand) return mountTool();
    unMountTool();
  });

  return ToolUIElememt({
    builder,
    toolId: BuilderToolIds.Wand,
    children: frag(
      SchemaEditor({
        properties: [
          SelectProp("Modes", {
            options: WandTool.ModeArray,
            value: wandTool.mode,
            initialize: (node) =>
              node.observers.updatedOrLoadedIn.subscribe(() => {
                wandTool.mode = node.get();
                voxelSelectionHighlight.mesh.setColor(...colors[wandTool.mode]);
              }),
          }),
        ],
      })
    ),
  });
}
