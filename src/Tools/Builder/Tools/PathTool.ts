import { frag } from "@amodx/elm";
import { Builder, BuilderToolIds } from "../Builder";
import { ToolUIElememt } from "./ToolUIElement";
import {
  PathTool,
  PathToolModes,
} from "@divinevoxel/vlox/Builder/Tools/Path/PahtTool";
import { SchemaEditor } from "../../../UI/Schemas/SchemaEditor";
import { SelectProp } from "@amodx/schemas";
import { VoxelSelectionHighlight } from "@divinevoxel/vlox-babylon/Tools/VoxelSelectionHighlight";
import { Vec3Array } from "@amodx/math";
import { VoxelPathControls } from "@divinevoxel/vlox-babylon/Tools/VoxelPathControls";
const colors: Record<PathToolModes, Vec3Array> = {
  [PathToolModes.PlacePoints]: [0, 0, 1],
  [PathToolModes.MovePoints]: [0, 1, 1],
  [PathToolModes.RemovePoints]: [1, 0, 0],
  [PathToolModes.FillPath]: [0, 1, 0],
  [PathToolModes.RemovePath]: [1, 0, 0],
};
export default function ({ builder }: { builder: Builder }) {
  let onDispose: (() => void) | null = null;
  const pathTool = new PathTool(builder.space);

  const voxelSelectionHighlight = new VoxelSelectionHighlight(builder.scene);
  voxelSelectionHighlight.mesh.setColor(...colors[pathTool.mode]);

  const controls = new VoxelPathControls(builder.scene, builder.rayProvider);
  controls.setPath(pathTool.path);

  const mountTool = () => {
    voxelSelectionHighlight.setEnabled(true);
    const pointerDown = builder.createEventListener(
      "pointer-down",
      async (event) => {
        if (event.detail.button !== 0) return;
        controls.update(true);
        if (pathTool.mode == PathToolModes.MovePoints) {
          controls.editHovered();
          return;
        }
        if (controls.isEditing()) return;
        if (pathTool.mode == PathToolModes.RemovePoints) {
          controls.removedHovered();
          return;
        }

        pathTool.use(builder.paintData);
      }
    );
    builder.addEventListener("pointer-down", pointerDown);
    const pointerUp = builder.createEventListener(
      "pointer-up",
      async (event) => {
        if (event.detail.button !== 0) return;
        controls.update(false);
      }
    );
    builder.addEventListener("pointer-up", pointerUp);
    const rayUpdated = builder.rayProvider.createEventListener(
      "updated",
      async () => {
        pathTool.updatePlacer();
        voxelSelectionHighlight.update(pathTool.selection);
      }
    );
    builder.rayProvider.addEventListener("updated", rayUpdated);

    onDispose = () => {
      builder.removeEventListener("pointer-down", pointerDown);
      builder.removeEventListener("pointer-up", pointerUp);
      builder.rayProvider.removeEventListener("updated", rayUpdated);
      onDispose = null;
    };
  };
  const unMountTool = () => {
    if (onDispose) onDispose();
    voxelSelectionHighlight.setEnabled(false);
    controls.setEnabled(false);
  };

  builder.addEventListener("tool-set", () => {
    if (builder.activeTool == BuilderToolIds.Path) return mountTool();
    unMountTool();
  });

  const updateModes = (newMode: PathToolModes) => {
    if (
      newMode == PathToolModes.MovePoints ||
      newMode == PathToolModes.RemovePoints
    ) {
      controls.setHoverEnabled(true);
    } else {
      controls.setHoverEnabled(false);
    }
    if (newMode !== PathToolModes.MovePoints) {
      controls.stopEditing();
    }
    if (newMode == PathToolModes.PlacePoints) {
      voxelSelectionHighlight.setEnabled(true);
    } else {
      voxelSelectionHighlight.setEnabled(false);
    }
    pathTool.setMode(newMode);
    controls.setColor(...colors[newMode]);
    voxelSelectionHighlight.mesh.setColor(...colors[newMode]);
  };
  updateModes(PathToolModes.PlacePoints);

  return ToolUIElememt({
    builder,
    toolId: BuilderToolIds.Path,
    children: frag(
      SchemaEditor({
        properties: [
          SelectProp("Modes", {
            options: PathTool.ModeArray,
            value: pathTool.mode,
            initialize(node) {
              node.observers.updatedOrLoadedIn.subscribe(() => {
                const newMode = node.get();
                updateModes(newMode);
              });
            },
          }),
        ],
      })
    ),
  });
}
