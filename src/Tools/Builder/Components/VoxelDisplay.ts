import { elm, frag, useRef } from "@amodx/elm";
import { IntProp, Schema, SelectProp } from "@amodx/schemas";
import { VoxelSchemas } from "@divinevoxel/vlox/Voxels/State/VoxelSchemas";
import { SchemaEditor } from "../../../UI/Schemas/SchemaEditor";
import { VoxelIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelIndex";
import { VoxelTextureIndex } from "@divinevoxel/vlox/Voxels/Indexes/VoxelTextureIndex";
import { Observable } from "@amodx/core/Observers";
import { Builder } from "../Builder";

elm.css(/* css */ `

.voxel-display {
  display: flex;
  flex-direction: row;
  align-content: center;
  width: 100%;


  .voxel-image-conatiner {
    width: 100px;
    height: 100%;

    .voxel-image {
      width: 64px;
      height: 64px;
      margin: auto;
      display: block;
      image-rendering: pixelated;
    }
  }

  .voxel-content-conatiner {
    display: flex;
    flex-direction : sector;
    width: 100%;
    .voxel-title {
      font-size: 16px;
    }
    .voxel-schema-conatiner {
      width: 100%;

      .schema-editor {
        width: 100%;
        
        .form-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-evenly;
          .label {
            width: 100%;
          }
          .input {
            width: 100%;
          }
        }
      }
    }
  }
}

  
`);

const schemaUpdated = new Observable();

function SchemaForm(voxelId: string, builder: Builder) {
  const paintData = builder.paintData;
  const stateSchema = VoxelSchemas.getStateSchema(voxelId)!;
  const modSchema = VoxelSchemas.mod.get(voxelId)!;
  stateSchema.startEncoding();
  modSchema.startEncoding();
  const updated = () => {
    paintData.state = stateSchema.getEncoded();
    paintData.mod = modSchema.getEncoded();
    schemaUpdated.notify();
  };

  const shapeStateSchema = stateSchema.nodes.length
    ? Schema.CreateInstance<Record<string, any>>(
        ...stateSchema.nodes.map((node) => {
          if (!node.valuePalette) {
            return IntProp(node.name, {
              initialize(schemaNode) {
                schemaNode.enableProxy(
                  () => stateSchema.getNumber(node.name),
                  (value) => {
                    stateSchema.setNumber(node.name, value);
                    updated();
                  }
                );
              },
            });
          }
          return SelectProp(node.name, {
            options: node.valuePalette._palette,
            initialize(schemaNode) {
              schemaNode.enableProxy(
                () => stateSchema.getValue(node.name),
                (value) => {
                  stateSchema.setValue(node.name, value);
                  updated();
                }
              );
            },
          });
        })
      )
    : null;

  const voxelModSchema = modSchema.nodes.length
    ? Schema.CreateInstance<Record<string, any>>(
        ...modSchema.nodes.map((node) => {
          if (!node.valuePalette) {
            return IntProp(node.name, {
              initialize(schemaNode) {
                schemaNode.enableProxy(
                  () => modSchema.getNumber(node.name),
                  (value) => {
                    modSchema.setNumber(node.name, value);
                    updated();
                  }
                );
              },
            });
          }
          return SelectProp(node.name, {
            options: node.valuePalette._palette,
            initialize(schemaNode) {
              schemaNode.enableProxy(
                () => modSchema.getValue(node.name),
                (value) => {
                  modSchema.setValue(node.name, value);
                  updated();
                }
              );
            },
          });
        })
      )
    : null;

  const loadIn = () => {
    stateSchema.startEncoding(paintData.state);
    modSchema.startEncoding(paintData.mod);
    if (shapeStateSchema) {
      stateSchema.nodes.forEach((node) => {
        if (node.valuePalette) {
          shapeStateSchema[node.name] = stateSchema.getValue(node.name);
          return;
        }
        shapeStateSchema[node.name] = stateSchema.getNumber(node.name);
      });
    }
    if (voxelModSchema) {
      modSchema.nodes.forEach((node) => {
        if (node.valuePalette) {
          voxelModSchema[node.name] = modSchema.getValue(node.name);
          return;
        }
        voxelModSchema[node.name] = modSchema.getNumber(node.name);
      });
    }
  };

  builder.addEventListener("voxel-updated", () => {
    loadIn();
  });

  return frag(
    (shapeStateSchema &&
      SchemaEditor({
        schemaInstance: shapeStateSchema,
      })) ||
      null,
    (voxelModSchema &&
      SchemaEditor({
        schemaInstance: voxelModSchema,
      })) ||
      null
  );
}
export default function VoxelDisplay({ builder }: { builder: Builder }) {
  const imageRef = useRef<HTMLImageElement>();
  const schameRef = useRef<HTMLDivElement>();
  const titleRef = useRef<HTMLHeadingElement>();

  const updateVoxel = () => {
    schameRef.current!.innerHTML = "";
    schameRef.current!.append(SchemaForm(builder.paintData.id, builder));
  };
  const updateDisplay = () => {
    const state = VoxelIndex.instance.getStateFromPaintData(builder.paintData);
    if (!state) {
      imageRef.current!.src = "";
      return;
    }
    titleRef.current!.innerText = state.data.name || state.data.id;
    const image = VoxelTextureIndex.getImage(state.voxelId, state.data.id);
    if (!image) {
      imageRef.current!.src = "";
      return;
    }
    imageRef.current!.src = image.src;
  };

  let voxelId = "";

  schemaUpdated.subscribe(() => {
    updateDisplay();
  });

  builder.addEventListener("voxel-updated", () => {
    if (builder.paintData.id != voxelId) {
      voxelId = builder.paintData.id;
      updateVoxel();
    }
    updateDisplay();
  });

  return elm(
    "div",
    {
      className: "voxel-display",
    },
    elm(
      "div",
      {
        className: "voxel-image-conatiner",
      },
      elm("img", {
        className: "voxel-image",
        ref: imageRef,
      })
    ),
    elm(
      "div",
      {
        className: "voxel-content-conatiner",
      },
      elm(
        "h2",
        {
          className: "voxel-title",
          ref: titleRef,
        },
        "Select Voxel"
      ),
      elm("div", {
        className: "voxel-schema-conatiner",
        ref: schameRef,
      })
    )
  );
}
