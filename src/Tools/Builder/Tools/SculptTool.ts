import { elm, frag } from "@amodx/elm";
import { Builder, BuilderToolIds } from "../Builder";
import { ToolUIElememt } from "./ToolUIElement";
import {
  SculptTool,
  SculptToolModes,
} from "@divinevoxel/vlox/Builder/Tools/Sculpt/SculptTool";
import { SchemaEditor } from "../../../UI/Schemas/SchemaEditor";
import { SelectProp } from "@amodx/schemas";
import { VoxelSelectionHighlight } from "@divinevoxel/vlox-babylon/Tools/VoxelSelectionHighlight";
import { Vec3Array } from "@amodx/math";
const colors: Record<SculptToolModes, Vec3Array> = {
  [SculptToolModes.Fill]: [0, 1, 0],
  [SculptToolModes.Remove]: [1, 0, 0],
  [SculptToolModes.Extrude]: [1, 1, 0],
};

export default function ({ builder }: { builder: Builder }) {
  let onDispose: (() => void) | null = null;
  const boxTool = new SculptTool(builder.space);

  const voxelSelectionHighlight = new VoxelSelectionHighlight(builder.scene);
  voxelSelectionHighlight.mesh.setColor(...colors[boxTool.mode]);

  const mountTool = () => {
    voxelSelectionHighlight.setEnabled(true);
    const pointerDown = builder.createEventListener(
      "pointer-down",
      async (event) => {
        if (event.detail.button !== 0) return;
        await boxTool.update("start");
        voxelSelectionHighlight.update(boxTool.selection);
      }
    );
    builder.addEventListener("pointer-down", pointerDown);

    const pointerUp = builder.createEventListener(
      "pointer-up",
      async (event) => {
        if (event.detail.button !== 0) return;
        if (!boxTool.isSelectionStarted()) return;
        await boxTool.update("end");
        voxelSelectionHighlight.update(boxTool.selection);
        boxTool.voxelData = builder.paintData;
        await boxTool.use();
      }
    );
    builder.addEventListener("pointer-up", pointerUp);

    const wheelUp = builder.createEventListener("wheel-up", () => {
      if (!boxTool.isSelectionStarted()) return;
      boxTool.updateOffset(boxTool.boxSelection.offset + 1);
      voxelSelectionHighlight.update(boxTool.selection);
    });
    builder.addEventListener("wheel-up", wheelUp);

    const wheelDown = builder.createEventListener("wheel-down", () => {
      if (!boxTool.isSelectionStarted()) return;
      boxTool.updateOffset(boxTool.boxSelection.offset - 1);
      voxelSelectionHighlight.update(boxTool.selection);
    });
    builder.addEventListener("wheel-down", wheelDown);

    const rayUpdated = builder.rayProvider.createEventListener(
      "updated",
      async () => {
        await boxTool.update();
        voxelSelectionHighlight.update(boxTool.selection);
      }
    );
    builder.rayProvider.addEventListener("updated", rayUpdated);

    onDispose = () => {
      builder.removeEventListener("pointer-down", pointerDown);
      builder.removeEventListener("pointer-up", pointerUp);
      builder.removeEventListener("wheel-up", wheelUp);
      builder.removeEventListener("wheel-down", wheelDown);
      builder.rayProvider.removeEventListener("updated", rayUpdated);
      onDispose = null;
      voxelSelectionHighlight.setEnabled(false);
    };
  };
  const unMountTool = () => {
    if (onDispose) onDispose();
  };

  builder.addEventListener("tool-set", () => {
    if (builder.activeTool == BuilderToolIds.Sculpt) return mountTool();
    unMountTool();
  });

  return ToolUIElememt({
    builder,
    toolId: BuilderToolIds.Sculpt,
    children: frag(
      SchemaEditor({
        properties: [
          SelectProp("Modes", {
            options: SculptTool.ModeArray,
            value: boxTool.mode,
            initialize(node) {
              node.observers.updatedOrLoadedIn.subscribe(() => {
                boxTool.mode = node.get();
                voxelSelectionHighlight.mesh.setColor(...colors[boxTool.mode]);
              });
            },
          }),
        ],
      })
    ),
  });
}
