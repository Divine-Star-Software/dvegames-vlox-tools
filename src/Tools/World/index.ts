import { elm, frag } from "@amodx/elm";
import { DivineVoxelEngineRender } from "@divinevoxel/vlox/Contexts/Render";
import { ToolPanelViews } from "../../ToolPanelViews";
import { useFileDownload } from "../../UI/Hooks/useFileDownload";
import { useFileUpload } from "../../UI/Hooks/useFileUpload";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { BooleanProp, Schema } from "@amodx/schemas";
import { Graph, Node } from "@amodx/ncs/";
import { WorldArchiverComponent } from "@dvegames/vlox/Archive/WorldArchiver.component";
import { DimensionProviderComponent } from "@dvegames/vlox/Providers/DimensionProvider.component";
import { BinaryObject } from "@amodx/binary";
import { Compressor } from "@amodx/core/Compression";
import { CacheManager } from "@divinevoxel/vlox/Cache/CacheManager";
import ImportArchivedAreaJSON from "@divinevoxel/vlox/World/Archive/Functions/JSON/ImportArchivedAreaJSON";
import ExportArchivedAreaJSON from "@divinevoxel/vlox/World/Archive/Functions/JSON/ExportArchivedAreaJSON";

import CollapsibleSection from "../../UI/Components/CollapsibleSection";
export default function (graph: Graph) {
  ToolPanelViews.registerView("World", (component) => {
    const node = graph
      .addNode(
        Node("Archiver", [
          DimensionProviderComponent({}),
          WorldArchiverComponent(),
        ])
      )
      .cloneCursor();
    const archiver = WorldArchiverComponent.getRequired(node);

    const { downloadFile } = useFileDownload();
    const { fileInput, uploadFile } = useFileUpload();

    const settings = Schema.CreateInstance<{
      "JSON Mode": boolean;
    }>(
      BooleanProp("JSON Mode", {
        value: false,
        initialize(node) {},
      })
    );
    return frag(
      CollapsibleSection(
        { title: "World Simulation", opened: true },
        elm(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "row",
            },
          },
          elm(
            "button",
            {
              async onclick() {
                DivineVoxelEngineRender.instance.threads.world.runTask(
                  "start-world",
                  ["main", 0, 0, 0]
                );
              },
            },
            "Start World Generation"
          )
        ),
        elm(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "row",
            },
          },
          elm(
            "button",
            {
              async onclick() {
                DivineVoxelEngineRender.instance.threads.world.runTask(
                  "start-world-gen",
                  ["main", 0, 0, 0]
                );
              },
            },
            "Start World Building"
          )
        )
      ),

      CollapsibleSection(
        { title: "Archive" },

        elm(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "sector",
            },
          },
          elm(
            "button",
            {
              async onclick() {
                console.warn("Archive world");
                const archivedData = await archiver.data.archive();
                if (settings["JSON Mode"]) {
                  const json = await ExportArchivedAreaJSON(archivedData);
                  downloadFile("archived-world.json", JSON.stringify(json));
                } else {
                  const compressed = await Compressor.core.compressArrayBuffer(
                    BinaryObject.objectToBuffer(archivedData)
                  );
                  downloadFile("archived-world.bin", compressed.buffer);
                }
              },
            },
            "Archive World"
          ),
          elm(
            "button",
            {
              async onclick() {
                console.warn("Import world");
                if (settings["JSON Mode"]) {
                  const jsonString = await uploadFile("string");
                  if (!jsonString) return;
                  const json = JSON.parse(jsonString);
                  const archive = await ImportArchivedAreaJSON(json);
                  await archiver.data.load(archive);
                } else {
                  const binary = await uploadFile("binary");
                  if (!binary) return;
                  BinaryObject.setUseSharedMemory(true);
                  const archive = BinaryObject.bufferToObject(
                    (await Compressor.core.decompressArrayBuffer(binary))
                      .buffer as any
                  ) as any;
                  BinaryObject.setUseSharedMemory(false);
                  await archiver.data.load(archive);
                }
              },
            },
            "Import World"
          ),
          SchemaEditor({
            schemaInstance: settings,
          }),
          fileInput
        )
      )
    );
  });
}
