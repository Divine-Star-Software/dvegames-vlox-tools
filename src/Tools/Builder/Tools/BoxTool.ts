import { elm, frag } from "@amodx/elm";
import { Builder, BuilderToolIds } from "../Builder";
import { ToolUIElememt } from "./ToolUIElement";
import {
  BoxTool,
  BoxToolModes,
} from "@divinevoxel/vlox/Builder/Tools/Box/BoxTool";
import { SchemaEditor } from "../../../UI/Schemas/SchemaEditor";
import { ButtonProp, SelectProp } from "@amodx/schemas";
import { VoxelSelectionHighlight } from "@divinevoxel/vlox-babylon/Tools/VoxelSelectionHighlight";
import { Vec3Array } from "@amodx/math";
import { VoxelBoxSelectionControls } from "@divinevoxel/vlox-babylon/Tools/VoxelBoxSelectionControls";
const colors: Record<BoxToolModes, Vec3Array> = {
  [BoxToolModes.Fill]: [0, 1, 0],
  [BoxToolModes.Remove]: [1, 0, 0],
  [BoxToolModes.Extrude]: [1, 1, 0],
  [BoxToolModes.Template]: [0, 0, 1],
};

export default function ({ builder }: { builder: Builder }) {
  let onDispose: (() => void) | null = null;
  const boxTool = new BoxTool(builder.space);

  const voxelSelectionHighlight = new VoxelSelectionHighlight(builder.scene);
  voxelSelectionHighlight.mesh.setColor(...colors[boxTool.mode]);

  let templateDipose: (() => void) | null = null;
  const templateContainer = document.createElement("div");

  const mountTool = () => {
    let isPointerDown = false;
    let currentTemplateControls: VoxelBoxSelectionControls | null = null;
    voxelSelectionHighlight.setEnabled(true);
    const pointerDown = builder.createEventListener(
      "pointer-down",
      async (event) => {
        if (event.detail.button !== 0) return;
        isPointerDown = true;
        if (currentTemplateControls) return;
        const picked = await builder.space.pick(
          builder.rayProvider.origin,
          builder.rayProvider.direction,
          100
        );
        if (!picked) return;
        boxTool.updatePlacer(picked, "start");
        voxelSelectionHighlight.update(boxTool.selection);
      }
    );
    builder.addEventListener("pointer-down", pointerDown);

    const pointerUp = builder.createEventListener(
      "pointer-up",
      async (event) => {
        if (event.detail.button !== 0) return;
        isPointerDown = false;
        if (currentTemplateControls || !boxTool.isSelectionStarted()) return;
        boxTool.updatePlacer(null, "end");
        voxelSelectionHighlight.update(boxTool.selection);
        boxTool.use(builder.paintData);
      }
    );
    builder.addEventListener("pointer-up", pointerUp);

    const wheelUp = builder.createEventListener("wheel-up", () => {
      if (currentTemplateControls) {
        currentTemplateControls.dispatch("move-up", null);
        return;
      }
      if (!boxTool.isSelectionStarted()) return;
      boxTool.updateOffset(boxTool.boxSelection.offset + 1);
      voxelSelectionHighlight.update(boxTool.selection);
    });
    builder.addEventListener("wheel-up", wheelUp);

    const wheelDown = builder.createEventListener("wheel-down", () => {
      if (currentTemplateControls) {
        currentTemplateControls.dispatch("move-down", null);
        return;
      }
      if (!boxTool.isSelectionStarted()) return;
      boxTool.updateOffset(boxTool.boxSelection.offset - 1);
      voxelSelectionHighlight.update(boxTool.selection);
    });
    builder.addEventListener("wheel-down", wheelDown);

    const rayUpdated = builder.rayProvider.createEventListener(
      "updated",
      async () => {
        if (!boxTool.isSelectionStarted()) {
          const picked = await builder.space.pick(
            builder.rayProvider.origin,
            builder.rayProvider.direction,
            100
          );
          boxTool.updatePlacer(picked);
        } else {
          boxTool.updatePlacer(null);
        }

        voxelSelectionHighlight.update(boxTool.selection);
      }
    );
    builder.rayProvider.addEventListener("updated", rayUpdated);

    const templateCreated = boxTool.createEventListener(
      "template-created",
      async (event) => {
        const boxTemplate = event.detail;
        currentTemplateControls = new VoxelBoxSelectionControls(
          builder.scene,
          builder.rayProvider,
          boxTemplate.selection
        );
        voxelSelectionHighlight.setEnabled(false);
        const updateObserver = builder.scene.onBeforeRenderObservable.add(
          () => {
            if (!currentTemplateControls) return;
            currentTemplateControls.update(isPointerDown);
          }
        );

        templateDipose = () => {
          templateContainer.innerHTML = "";
          voxelSelectionHighlight.setEnabled(true);
          if (currentTemplateControls) currentTemplateControls.dispose();
          currentTemplateControls = null;
          builder.scene.onBeforeRenderObservable.remove(updateObserver);
        };

        templateContainer.append(
          SchemaEditor({
            properties: [
              ButtonProp("place", {
                name: "Place",
                value: () => boxTemplate.place(),
              }),
              ButtonProp("clear", {
                name: "Clear",
                value: () => boxTemplate.clear(),
              }),
              ButtonProp("delete", {
                name: "Delete",
                value: () => {
                  if (templateDipose) templateDipose();
                },
              }),
            ],
          })
        );
      }
    );
    boxTool.addEventListener("template-created", templateCreated);

    onDispose = () => {
      builder.removeEventListener("pointer-down", pointerDown);
      builder.removeEventListener("pointer-up", pointerUp);
      builder.removeEventListener("wheel-up", wheelUp);
      builder.removeEventListener("wheel-down", wheelDown);
      builder.rayProvider.removeEventListener("updated", rayUpdated);
      boxTool.removeEventListener("template-created", templateCreated);
      onDispose = null;
      if (templateDipose) templateDipose();
      voxelSelectionHighlight.setEnabled(false);
    };
  };
  const unMountTool = () => {
    if (onDispose) onDispose();
  };

  builder.addEventListener("tool-set", () => {
    if (builder.activeTool == BuilderToolIds.Box) return mountTool();
    unMountTool();
  });

  return ToolUIElememt({
    builder,
    toolId: BuilderToolIds.Box,
    children: frag(
      SchemaEditor({
        properties: [
          SelectProp("Modes", {
            options: BoxTool.ModeArray,
            value: boxTool.mode,
            initialize: (node) =>
              node.observers.updatedOrLoadedIn.subscribe(() => {
                boxTool.mode = node.get();
                voxelSelectionHighlight.mesh.setColor(...colors[boxTool.mode]);
              }),
          }),
        ],
      }),
      templateContainer
    ),
  });
}
