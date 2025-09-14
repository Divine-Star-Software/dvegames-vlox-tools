import { frag } from "@amodx/elm";
import { Builder, BuilderToolIds } from "../../Builder";
import { ToolUIElememt } from "../ToolUIElement";
import {
  BrushTool,
  BrushToolModes,
} from "@divinevoxel/vlox/Builder/Tools/Brush/BrushTool";
import { SchemaEditor } from "../../../../UI/Schemas/SchemaEditor";
import { Schema, SelectProp } from "@amodx/schemas";
import { VoxelSelectionHighlight } from "@divinevoxel/vlox-babylon/Tools/VoxelSelectionHighlight";
import { Vec3Array } from "@amodx/math";
import { BrushToolShapes } from "./BrushToolShapes";
import "./Shapes/index";
const colors: Record<BrushToolModes, Vec3Array> = {
  [BrushToolModes.Fill]: [0, 1, 0],
  [BrushToolModes.Extrude]: [1, 1, 0],
  [BrushToolModes.Remove]: [1, 0, 0],
};
export default function ({ builder }: { builder: Builder }) {
  let onDispose: (() => void) | null = null;
  const brushTool = new BrushTool(builder.space);

  const voxelSelectionHighlight = new VoxelSelectionHighlight(builder.scene);
  voxelSelectionHighlight.mesh.setColor(...colors[brushTool.mode]);
  const shapeContainer = document.createElement("div");

  const mountTool = () => {
    voxelSelectionHighlight.setEnabled(true);
    const pointerDown = builder.createEventListener(
      "pointer-down",
      async (event) => {
        if (event.detail.button !== 0) return;

        brushTool.voxelData = { fill: builder.paintData };
        await brushTool.use();
      }
    );
    builder.addEventListener("pointer-down", pointerDown);
    const rayUpdated = builder.rayProvider.createEventListener(
      "updated",
      async () => {
        await brushTool.update();
        if (!brushTool.picked) {
          if (voxelSelectionHighlight.isEnaebled())
            voxelSelectionHighlight.setEnabled(false);
          return;
        }
        if (!voxelSelectionHighlight.isEnaebled())
          voxelSelectionHighlight.setEnabled(true);

        voxelSelectionHighlight.update(brushTool.selection);
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
    if (builder.activeTool == BuilderToolIds.Brush) return mountTool();
    unMountTool();
  });

  const setShape = () => {
    shapeContainer.innerHTML = "";
    shapeContainer.append(
      BrushToolShapes.ShapeRendered[brushTool.shape](brushTool.template)
    );
  };

  setShape();
  return ToolUIElememt({
    builder,
    toolId: BuilderToolIds.Brush,
    children: frag(
      SchemaEditor({
        schemaInstance: Schema.CreateInstance(
          SelectProp("Modes", {
            options: BrushTool.ModeArray,
            value: brushTool.mode,
            initialize: (node) =>
              node.observers.updatedOrLoadedIn.subscribe(() => {
                brushTool.mode = node.get();
                voxelSelectionHighlight.mesh.setColor(
                  ...colors[brushTool.mode]
                );
              }),
          }),
          SelectProp("Shapes", {
            options: BrushTool.ShapesArray,
            value: brushTool.mode,
            initialize: (node) =>
              node.observers.updatedOrLoadedIn.subscribe(() => {
                brushTool.updateShape(node.get());
                setShape();
              }),
          }),
          SelectProp("X Posiiton Mode", {
            options: BrushTool.PositionModeArray,
            value: brushTool.axisXPositionMode,
            initialize: (node) =>
              node.observers.updatedOrLoadedIn.subscribe(() => {
                brushTool.axisXPositionMode = node.get();
              }),
          }),
          SelectProp("Y Posiiton Mode", {
            options: BrushTool.PositionModeArray,
            value: brushTool.axisYPositionMode,
            initialize: (node) =>
              node.observers.updatedOrLoadedIn.subscribe(() => {
                brushTool.axisYPositionMode = node.get();
              }),
          }),
          SelectProp("Z Posiiton Mode", {
            options: BrushTool.PositionModeArray,
            value: brushTool.axisZPositionMode,
            initialize: (node) =>
              node.observers.updatedOrLoadedIn.subscribe(() => {
                brushTool.axisZPositionMode = node.get();
              }),
          })
        ),
      }),
      shapeContainer
    ),
  });
}
