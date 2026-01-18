import { Scene } from "@babylonjs/core/scene";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math.vector";
import { BrushTool } from "@divinevoxel/vlox/Builder/Tools/Brush/BrushTool";
import { HandTool } from "@divinevoxel/vlox/Builder/Tools/Hand/HandTool";
import { VoxelBuildSpace } from "@divinevoxel/vlox/Builder/VoxelBuildSpace";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { RayProvider } from "@divinevoxel/vlox/Builder/RayProvider";
import { Vector3Like } from "@amodx/math";
import { Ray } from "@babylonjs/core/Culling/ray";
import { PointerEventTypes } from "@babylonjs/core/Events/pointerEvents";
import { TypedEventTarget } from "@divinevoxel/vlox/Util/TypedEventTarget";
import { PaintVoxelData } from "@divinevoxel/vlox/Voxels";

export enum BuilderToolIds {
  Hand = "Hand",
  Sculpt = "Sculpt",
  Shape = "Shape",
  Brush = "Brush",
  Wand = "Wand",
  Wrench = "Wrench",
  Path = "Path",
  Template = "Template",
  Debug = "Debug",
}
type RayModes = "camera" | "mouse";

class BuilderTools {
  constructor(
    public handTool: HandTool,
    public brushTool: BrushTool,
  ) {}
}

class BuilderRayEvent<Data extends any = null> {
  constructor(public data: Data) {}
}

interface BuilderRayEvents {
  updated: BuilderRayEvent;
}

class BuilderRay
  extends TypedEventTarget<BuilderRayEvents>
  implements RayProvider
{
  origin = Vector3Like.Create();
  direction = Vector3Like.Create();
  length = 100;

  mode: RayModes = "mouse";

  private identity = Matrix.Identity();
  private ray = new Ray(Vector3.Zero(), Vector3.Zero());
  constructor(public scene: Scene) {
    super();
  }

  update() {
    const camera = this.scene.activeCamera!;
    if (this.mode == "mouse") {
      this.scene.createPickingRayToRef(
        this.scene.pointerX,
        this.scene.pointerY,
        this.identity,
        this.ray,
        camera,
      );
    } else {
      this.scene.createPickingRayToRef(
        this.scene.pointerX,
        this.scene.pointerY,
        this.identity,
        this.ray,
        camera,
      );
    }
    const changed =
      !Vector3Like.Equals(this.origin, this.ray.origin) ||
      !Vector3Like.Equals(this.direction, this.ray.direction);
    Vector3Like.Copy(this.origin, this.ray.origin);
    Vector3Like.Copy(this.direction, this.ray.direction);

    if (changed) this.dispatch("updated", new BuilderRayEvent(null));
  }
}

interface BuilderEvents {
  "pointer-down": MouseEvent;
  "pointer-up": MouseEvent;
  "wheel-up": MouseEvent;
  "wheel-down": MouseEvent;
  "pointer-move": MouseEvent;
  "tool-set": BuilderToolIds;
  "voxel-updated": PaintVoxelData;
}

export class Builder extends TypedEventTarget<BuilderEvents> {
  tools: BuilderTools;
  space: VoxelBuildSpace;
  rayProvider: BuilderRay;
  activeTool = BuilderToolIds.Hand;
  paintData = PaintVoxelData.Create();

  setData(data: Partial<PaintVoxelData>) {
    PaintVoxelData.Set(this.paintData, data);
    this.dispatch("voxel-updated", this.paintData);
  }
  constructor(
    public DVER: DivineVoxelEngineRender,
    public scene: Scene,
  ) {
    super();
    this.rayProvider = new BuilderRay(scene);
    this.space = new VoxelBuildSpace(DVER, this.rayProvider);
    this.tools = new BuilderTools(
      new HandTool(this.space),
      new BrushTool(this.space),
    );
    this.rayMode = "mouse";
    this.scene.onPointerObservable.add((event) => {
      if (event.type == PointerEventTypes.POINTERDOWN) {
        this.dispatch("pointer-down", event.event as MouseEvent);
      }
      if (event.type == PointerEventTypes.POINTERUP) {
        this.dispatch("pointer-up", event.event as MouseEvent);
      }
      if (event.type == PointerEventTypes.POINTERWHEEL) {
        const wheelEvent = event.event as WheelEvent;
        if (wheelEvent.deltaY < 0) {
          this.dispatch("wheel-up", event.event as WheelEvent);
        } else {
          this.dispatch("wheel-down", event.event as WheelEvent);
        }
      }
      if (event.type == PointerEventTypes.POINTERMOVE) {
        this.dispatch("pointer-move", event.event as MouseEvent);
      }
    });
  }

  setTool(tool: BuilderToolIds) {
    this.activeTool = tool;
    this.dispatch("tool-set", tool);
  }

  private _onRayModeChange: (() => void) | null = null;
  get rayMode() {
    return this.rayProvider.mode;
  }
  set rayMode(mode: RayModes) {
    if (this._onRayModeChange) this._onRayModeChange();
    this.rayProvider.mode = mode;
    if (mode == "camera") {
      const obs = this.scene.onBeforeRenderObservable.add(() => {
        this.rayProvider.update();
      });
      this._onRayModeChange = () => {
        this.scene.onBeforeRenderObservable.remove(obs);
      };
    } else {
      const obs = this.scene.onPointerObservable.add((event) => {
        if (event.type == PointerEventTypes.POINTERMOVE) {
          this.rayProvider.update();
        }
      });
      this._onRayModeChange = () => {
        this.scene.onPointerObservable.remove(obs);
      };
    }
  }
}
