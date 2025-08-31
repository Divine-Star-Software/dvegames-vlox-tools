import { frag } from "@amodx/elm";
import { Builder, BuilderToolIds } from "../Builder";
import { ToolUIElememt } from "./ToolUIElement";
import {
  HandTool,
  HandToolModes,
} from "@divinevoxel/vlox/Builder/Tools/Hand/HandTool";
import { SchemaEditor } from "../../../UI/Schemas/SchemaEditor";
import { Schema, SelectProp } from "@amodx/schemas";
import { VoxelSelectionHighlight } from "@divinevoxel/vlox-babylon/Tools/VoxelSelectionHighlight";
import { Vec3Array } from "@amodx/math";
const colors: Record<HandToolModes, Vec3Array> = {
  [HandToolModes.Place]: [0, 1, 0],
  [HandToolModes.Remove]: [1, 0, 0],
};
export default function ({ builder }: { builder: Builder }) {
  let onDispose: (() => void) | null = null;
  const handTool = new HandTool(builder.space);

  const voxelSelectionHighlight = new VoxelSelectionHighlight(builder.scene);
  voxelSelectionHighlight.mesh.setColor(...colors[handTool.mode]);

  const mountTool = () => {
    voxelSelectionHighlight.setEnabled(true);
    const pointerDown = builder.createEventListener(
      "pointer-down",
      async (event) => {
        if (event.detail.button !== 0) return;
        const picked = await builder.space.pick(
          builder.rayProvider.origin,
          builder.rayProvider.direction,
          100
        );
        if (!picked) return;
        handTool.use(picked, builder.paintData);
      }
    );
    builder.addEventListener("pointer-down", pointerDown);
    const rayUpdated = builder.rayProvider.createEventListener(
      "updated",
      async () => {
        const picked = await builder.space.pick(
          builder.rayProvider.origin,
          builder.rayProvider.direction,
          100
        );
        if (!picked) {
          if (voxelSelectionHighlight.isEnaebled())
            voxelSelectionHighlight.setEnabled(false);
          return;
        }
        if (!voxelSelectionHighlight.isEnaebled())
          voxelSelectionHighlight.setEnabled(true);
        handTool.updatePlacer(picked);
        voxelSelectionHighlight.update(handTool.selection);
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
    if (builder.activeTool == BuilderToolIds.Hand) return mountTool();
    unMountTool();
  });

  return ToolUIElememt({
    builder,
    toolId: BuilderToolIds.Hand,
    children: frag(
      SchemaEditor({
        schemaInstance: Schema.CreateInstance(
          SelectProp("Modes", {
            options: HandTool.ModeArray,
            value: handTool.mode,
            initialize: (node) =>
              node.observers.updatedOrLoadedIn.subscribe(() => {
                handTool.mode = node.get();
                voxelSelectionHighlight.mesh.setColor(...colors[handTool.mode]);
              }),
          })
        ),
      })
    ),
  });
}
