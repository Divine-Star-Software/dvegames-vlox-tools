import { elm, frag } from "@amodx/elm";
import { Builder, BuilderToolIds } from "../Builder";
import { ToolUIElememt } from "./ToolUIElement";
import {
  WrenchTool,
  WrenchToolVoxelScehmaNodes,
} from "@divinevoxel/vlox/Builder/Tools/Wrench/WrenchTool";
import { SchemaEditor } from "../../../UI/Schemas/SchemaEditor";
import { VoxelSelectionHighlight } from "@divinevoxel/vlox-babylon/Tools/VoxelSelectionHighlight";
import { IntProp, SelectProp } from "@amodx/schemas";

export default function ({ builder }: { builder: Builder }) {
  let onDispose: (() => void) | null = null;
  const wrenchTool = new WrenchTool(builder.space);

  const voxelSelectionHighlight = new VoxelSelectionHighlight(builder.scene);
  voxelSelectionHighlight.mesh.setColor(1, 1, 1);

  const schemaContainer = elm("div");

  const convertSchemas = (
    nodes: WrenchToolVoxelScehmaNodes[],
    update: () => void
  ) => {
    return nodes.map((_) => {
      if (_.type == "string") {
        return SelectProp(_.id, {
          name: _.label,
          options: _.values,
          initialize(node) {
            node.observers.updatedOrLoadedIn.subscribe(() => {
              _.value = node.get();
              update();
            });
          },
        });
      }
      return IntProp(_.id, {
        name: _.label,
        min: _.min,
        max: _.max,
        initialize(node) {
          node.observers.updatedOrLoadedIn.subscribe(() => {
            _.value = node.get();
            update();
          });
        },
      });
    });
  };

  const mountTool = () => {
    voxelSelectionHighlight.setEnabled(true);
    const pointerDown = builder.createEventListener(
      "pointer-down",
      async (event) => {
        if (wrenchTool.isUpdating()) return;
        if (event.detail.button !== 0) return;

        wrenchTool.use();
      }
    );
    builder.addEventListener("pointer-down", pointerDown);
    const rayUpdated = builder.rayProvider.createEventListener(
      "updated",
      async () => {
        if (wrenchTool.isUpdating()) return;
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
        wrenchTool.updatePlacer(picked);
        voxelSelectionHighlight.update(wrenchTool.selection);
      }
    );
    builder.rayProvider.addEventListener("updated", rayUpdated);

    const pickedListener = wrenchTool.createEventListener("picked", () => {
      schemaContainer.innerHTML = "";
      const schemas = wrenchTool.getPickedSchema()!;
      const update = () => {
        wrenchTool.updatePickedSchema(schemas);
        wrenchTool.use();
      };
      schemaContainer.append(
        elm("h3", "", "State"),
        SchemaEditor({
          properties: convertSchemas(schemas.stateSchema, update),
        }),
        elm("h3", "", "Mod"),
        SchemaEditor({
          properties: convertSchemas(schemas.modSchema, update),
        })
      );
    });
    wrenchTool.addEventListener("picked", pickedListener);
    onDispose = () => {
      builder.removeEventListener("pointer-down", pointerDown);
      wrenchTool.removeEventListener("picked", pickedListener);
      builder.rayProvider.removeEventListener("updated", rayUpdated);
      onDispose = null;
    };
  };
  const unMountTool = () => {
    if (onDispose) onDispose();
    voxelSelectionHighlight.setEnabled(false);
  };

  builder.addEventListener("tool-set", () => {
    if (builder.activeTool == BuilderToolIds.Wrench) return mountTool();
    unMountTool();
  });

  return ToolUIElememt({
    builder,
    toolId: BuilderToolIds.Wrench,
    children: frag(schemaContainer),
  });
}
