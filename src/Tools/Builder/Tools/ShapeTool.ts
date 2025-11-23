import { elm, frag } from "@amodx/elm";
import { Builder, BuilderToolIds } from "../Builder";
import { ToolUIElememt } from "./ToolUIElement";
import {
  ShapeTool,
  ShapeToolModes,
} from "@divinevoxel/vlox/Builder/Tools/Shape/ShapeTool";
import { SchemaEditor } from "../../../UI/Schemas/SchemaEditor";
import { SelectProp } from "@amodx/schemas";
import { VoxelSelectionHighlight } from "@divinevoxel/vlox-babylon/Tools/VoxelSelectionHighlight";
import { Vec3Array } from "@amodx/math";
const colors: Record<ShapeToolModes, Vec3Array> = {
  [ShapeToolModes.Fill]: [0, 1, 0],
  [ShapeToolModes.Remove]: [1, 0, 0],
};

export default function ({ builder }: { builder: Builder }) {
  let onDispose: (() => void) | null = null;
  const shapeTool = new ShapeTool(builder.space);

  const voxelSelectionHighlight = new VoxelSelectionHighlight(builder.scene);
  voxelSelectionHighlight.mesh.setColor(...colors[shapeTool.mode]);

  const mountTool = () => {
    voxelSelectionHighlight.setEnabled(true);
    const pointerDown = builder.createEventListener(
      "pointer-down",
      async (event) => {
        if (event.detail.button !== 0) return;
        await shapeTool.update("start");
        voxelSelectionHighlight.update(shapeTool.selection);
      }
    );
    builder.addEventListener("pointer-down", pointerDown);

    const pointerUp = builder.createEventListener(
      "pointer-up",
      async (event) => {
        if (event.detail.button !== 0) return;
        if (!shapeTool.isSelectionStarted()) return;
        await shapeTool.update("end");
        voxelSelectionHighlight.update(shapeTool.selection);
        shapeTool.voxelData = builder.paintData;
        shapeTool.distance = defaultDistance;
        await shapeTool.use();
      }
    );
    builder.addEventListener("pointer-up", pointerUp);

    const defaultDistance = shapeTool.distance;
    const wheelUp = builder.createEventListener("wheel-up", () => {
      if (!shapeTool.isSelectionStarted()) return;
      shapeTool.distance++;
      voxelSelectionHighlight.update(shapeTool.selection);
    });
    builder.addEventListener("wheel-up", wheelUp);

    const wheelDown = builder.createEventListener("wheel-down", () => {
      if (!shapeTool.isSelectionStarted()) return;
      shapeTool.distance--;
      voxelSelectionHighlight.update(shapeTool.selection);
    });
    builder.addEventListener("wheel-down", wheelDown);

    const rayUpdated = builder.rayProvider.createEventListener(
      "updated",
      async () => {
        await shapeTool.update(null);
        if (shapeTool.boxSelection) {
          voxelSelectionHighlight.update(shapeTool.boxSelection.selection);
        } else {
          voxelSelectionHighlight.update(shapeTool.selection);
        }
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
      shapeTool.distance = defaultDistance;
      voxelSelectionHighlight.setEnabled(false);
    };
  };
  const unMountTool = () => {
    if (onDispose) onDispose();
  };

  builder.addEventListener("tool-set", () => {
    if (builder.activeTool == BuilderToolIds.Shape) return mountTool();
    unMountTool();
  });

  return ToolUIElememt({
    builder,
    toolId: BuilderToolIds.Shape,
    children: frag(
      SchemaEditor({
        properties: [
          SelectProp("Modes", {
            options: ShapeTool.ModeArray,
            value: shapeTool.mode,
            initialize(node) {
              node.observers.updatedOrLoadedIn.subscribe(() => {
                shapeTool.mode = node.get();
                voxelSelectionHighlight.mesh.setColor(
                  ...colors[shapeTool.mode]
                );
              });
            },
          }),
        ],
      })
    ),
  });
}
