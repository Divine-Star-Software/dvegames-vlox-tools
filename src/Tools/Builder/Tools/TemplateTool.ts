import { elm, frag } from "@amodx/elm";
import { Builder, BuilderToolIds } from "../Builder";
import { ToolUIElememt } from "./ToolUIElement";
import {
  TemplateTool,
  TemplateToolModes,
} from "@divinevoxel/vlox/Builder/Tools/Template/TemplateTool";
import { SchemaEditor } from "../../../UI/Schemas/SchemaEditor";
import { ButtonProp, SelectProp } from "@amodx/schemas";
import { VoxelSelectionHighlight } from "@divinevoxel/vlox-babylon/Tools/VoxelSelectionHighlight";
import { Vec3Array, Vector3Axes, Vector3Like } from "@amodx/math";
import { VoxelBoundsSelectionControls } from "@divinevoxel/vlox-babylon/Tools/VoxelBoundsSelectionControls";
import { VoxelBoundsSelection } from "@divinevoxel/vlox/Templates/Selection/VoxelBoundsSelection";
import { VoxelTemplateControls } from "@divinevoxel/vlox-babylon/Tools/VoxelTemplateControls";

const colors: Record<TemplateToolModes, Vec3Array> = {
  [TemplateToolModes.Select]: [0, 0, 1],
  [TemplateToolModes.Place]: [0, 1, 0],
  [TemplateToolModes.Remove]: [1, 0, 0],
};

export default function ({ builder }: { builder: Builder }) {
  let onDispose: (() => void) | null = null;
  const templateTool = new TemplateTool(builder.space);

  const voxelSelectionHighlight = new VoxelSelectionHighlight(builder.scene);
  voxelSelectionHighlight.mesh.setColor(...colors[templateTool.mode]);

  let templateDipose: (() => void) | null = null;
  const controlsContainer = document.createElement("div");

  const mountTool = () => {
    console.warn("mout the template tool");
    let defaultDistnace = templateTool.distance;
    let isPointerDown = false;
    let currentSelectionControls: VoxelBoundsSelectionControls | null = null;
    let currentSelection: VoxelBoundsSelection | null = null;
    let currentTemplateControls: VoxelTemplateControls | null = null;
    voxelSelectionHighlight.setEnabled(true);
    const pointerDown = builder.createEventListener(
      "pointer-down",
      async (event) => {
        if (event.detail.button !== 0) return;
        isPointerDown = true;
        if (currentSelectionControls || currentTemplateControls) return;
        await templateTool.update("start");
        console.warn("start the thing", templateTool.selection.clone());
        voxelSelectionHighlight.update(templateTool.selection);
      }
    );
    builder.addEventListener("pointer-down", pointerDown);

    const pointerUp = builder.createEventListener(
      "pointer-up",
      async (event) => {
        if (event.detail.button !== 0) return;
        templateTool.distance = defaultDistnace;
        isPointerDown = false;
        if (
          currentSelectionControls ||
          currentTemplateControls ||
          !templateTool.isSelectionStarted()
        )
          return;
        console.warn("do the thing", pointerUp);
        await templateTool.use();
        await templateTool.update("end");

        console.warn("end the thing", templateTool.selection.clone());
        voxelSelectionHighlight.update(templateTool.selection);
      }
    );
    builder.addEventListener("pointer-up", pointerUp);

    const rayUpdated = builder.rayProvider.createEventListener(
      "updated",
      async () => {
        if (currentSelectionControls) {
          currentSelectionControls.update(isPointerDown);
          return;
        }
        if (currentTemplateControls) {
          currentTemplateControls.update(isPointerDown);
          return;
        }
        await templateTool.update(null);
        if (templateTool.boxSelection) {
          voxelSelectionHighlight.update(templateTool.boxSelection.selection);
        } else {
          voxelSelectionHighlight.update(templateTool.selection);
        }
      }
    );
    builder.rayProvider.addEventListener("updated", rayUpdated);

    const wheelUp = builder.createEventListener("wheel-up", async () => {
      if (currentSelectionControls) {
        currentSelectionControls.dispatch("move-up", null);
        return;
      }
      templateTool.distance++;
      await templateTool.update();
      voxelSelectionHighlight.update(templateTool.selection);
    });
    builder.addEventListener("wheel-up", wheelUp);

    const wheelDown = builder.createEventListener("wheel-down", async () => {
      if (currentSelectionControls) {
        currentSelectionControls.dispatch("move-down", null);
        return;
      }
      templateTool.distance--;
      await templateTool.update();
      voxelSelectionHighlight.update(templateTool.selection);
    });
    builder.addEventListener("wheel-down", wheelDown);

    const confirmSelection = async () => {
      if (!currentSelection) return;
      const template = await templateTool.selectionToTemplate(currentSelection);

      currentTemplateControls = new VoxelTemplateControls(
        builder.scene,
        builder.space,
        builder.space.rayProvider,
        template,
        currentSelection
      );

      currentSelectionControls?.dispose();
      currentSelectionControls = null;
      currentSelection = null;
      const updateObserver = builder.scene.onBeforeRenderObservable.add(() => {
        if (!currentTemplateControls) return;
        currentTemplateControls.update(isPointerDown);
      });

      templateDipose = () => {
        controlsContainer.innerHTML = "";
        voxelSelectionHighlight.setEnabled(true);
        if (currentTemplateControls) currentTemplateControls.dispose();
        currentTemplateControls = null;
        builder.scene.onBeforeRenderObservable.remove(updateObserver);
      };

      let axes: Vector3Axes = "y";
      controlsContainer.append(
        SchemaEditor({
          properties: [
            ButtonProp("place", {
              name: "Place",
              value: () => currentTemplateControls!.place(),
            }),
            SelectProp("axes", {
              name: "Axes",
              value: axes,
              options: [...Vector3Like.Keys()],
              initialize: (node) =>
                node.observers.updatedOrLoadedIn.subscribe(
                  () => (axes = node.get())
                ),
            }),
            ButtonProp("flip", {
              name: "Flip",
              value: () => {
                currentTemplateControls!.flip(axes);
                currentSelectionControls?.selectionHighlight.update(
                  currentTemplateControls!.selection
                );
              },
            }),
            ButtonProp("rotate", {
              name: "Rotate",
              value: () => {
                currentTemplateControls!.rotate(axes, 90);
                currentSelectionControls?.selectionHighlight.update(
                  currentTemplateControls!.selection
                );
              },
            }),
            ButtonProp("clear", {
              name: "Clear",
              value: () => currentTemplateControls!.clear(),
            }),
            ButtonProp("delete", {
              name: "Delete",
              value: () => templateDipose && templateDipose(),
            }),
          ],
        })
      );
    };

    const selectionCreated = templateTool.createEventListener(
      "selection-created",
      async (event) => {
        currentSelection = event.detail;
        currentSelectionControls = new VoxelBoundsSelectionControls(
          builder.scene,
          builder.rayProvider,
          currentSelection,
          true
        );

        const unMount = () => {
          controlsContainer.innerHTML = "";
          currentSelectionControls?.dispose();
          currentSelectionControls = null;
        };
        voxelSelectionHighlight.setEnabled(false);
        controlsContainer.append(
          SchemaEditor({
            properties: [
              ButtonProp("confirm", {
                name: "Confirm",
                value: async () => {
                  unMount();
                  await confirmSelection();
                  currentSelection = null;
                },
              }),
              ButtonProp("Cancel", {
                name: "Cancel",
                value: () => {
                  unMount();
                  currentSelection = null;
                },
              }),
            ],
          })
        );
        console.warn("template created", currentSelection);
      }
    );
    templateTool.addEventListener("selection-created", selectionCreated);

    onDispose = () => {
      builder.removeEventListener("pointer-down", pointerDown);
      builder.removeEventListener("pointer-up", pointerUp);
      builder.removeEventListener("wheel-up", wheelUp);
      builder.removeEventListener("wheel-down", wheelDown);
      builder.rayProvider.removeEventListener("updated", rayUpdated);
      templateTool.removeEventListener("selection-created", selectionCreated);
      onDispose = null;
      if (templateDipose) templateDipose();
      voxelSelectionHighlight.setEnabled(false);
    };
  };
  const unMountTool = () => {
    if (onDispose) onDispose();
  };

  builder.addEventListener("tool-set", () => {
    if (builder.activeTool == BuilderToolIds.Template) return mountTool();
    unMountTool();
  });

  return ToolUIElememt({
    builder,
    toolId: BuilderToolIds.Template,
    children: frag(
      SchemaEditor({
        properties: [
          SelectProp("Modes", {
            options: TemplateTool.ModeArray,
            value: templateTool.mode,
            initialize(node) {
              node.observers.updatedOrLoadedIn.subscribe(() => {
                templateTool.mode = node.get();
                voxelSelectionHighlight.mesh.setColor(
                  ...colors[templateTool.mode]
                );
              });
            },
          }),
        ],
      }),
      controlsContainer
    ),
  });
}
