import { elm, frag } from "@amodx/elm";
import { ToolPanelViews } from "../../ToolPanelViews";
import { useFileDownload } from "../../UI/Hooks/useFileDownload";
import { useFileUpload } from "../../UI/Hooks/useFileUpload";
import { SchemaEditor } from "../../UI/Schemas/SchemaEditor";
import { BooleanProp, Schema } from "@amodx/schemas";
import { Node } from "@amodx/ncs/";
import { WorldArchiverComponent } from "@dvegames/vlox/Archive/WorldArchiver.component";
import { DimensionProviderComponent } from "@dvegames/vlox/Providers/DimensionProvider.component";
import { BinaryObject } from "@amodx/binary";
import { Compressor } from "@amodx/core/Compression";
import { CacheManager } from "@divinevoxel/vlox/Cache/CacheManager";
import ImportArchivedAreaJSON from "@divinevoxel/vlox/World/Archive/Functions/JSON/ImportArchivedAreaJSON";
export default function (graph) {
    const node = graph
        .addNode(Node("Archiver", [
        DimensionProviderComponent({}),
        WorldArchiverComponent(),
    ]))
        .cloneCursor();
    const archiver = WorldArchiverComponent.getRequired(node);
    ToolPanelViews.registerView("Archiver", (component) => {
        const { downloadFile } = useFileDownload();
        const { fileInput, uploadFile } = useFileUpload();
        return frag(elm("div", {
            style: {
                display: "flex",
                flexDirection: "sector",
            },
        }, elm("button", {
            async onclick() {
                console.warn("Archive world");
                const archivedData = await archiver.data.archive();
                //  const json = await ExportArchivedAreaJSON(archivedData);
                //   downloadFile("archived-world.json", JSON.stringify(json));
                const compressed = await Compressor.core.compressArrayBuffer(BinaryObject.objectToBuffer(archivedData));
                downloadFile("archived-world.bin", compressed.buffer);
            },
        }, "Archive World"), elm("button", {
            async onclick() {
                console.log("IMPORT WORLD");
                const jsonString = await uploadFile("string");
                if (!jsonString)
                    return;
                const json = JSON.parse(jsonString);
                console.log(json);
                const archive = await ImportArchivedAreaJSON(json);
                console.log(archive);
                await archiver.data.load(archive);
                /*      const binary = await uploadFile("binary");
                if (!binary) return;
                BinaryObject.setUseSharedMemory(true);
                const archive = BinaryObject.bufferToObject(
                  (await Compressor.core.decompressArrayBuffer(binary))
                    .buffer as any
                ) as any;
                BinaryObject.setUseSharedMemory(false);
                await archiver.data.load(archive); */
            },
        }, "Import World"), elm("button", {
            async onclick() {
                const archivedData = CacheManager.getCachedData();
                const compressed = await Compressor.core.compressArrayBuffer(BinaryObject.objectToBuffer(archivedData));
                downloadFile("dve-cache.bin", compressed.buffer);
            },
        }, "Archive Cache"), SchemaEditor({
            schemaInstance: Schema.CreateInstance(BooleanProp("Cached Data", {
                value: Boolean(localStorage.getItem("cached-data")),
                initialize(node) {
                    node.observers.updated.subscribe((node) => {
                        const v = Boolean(node.get());
                        v
                            ? localStorage.setItem("cached-data", "true")
                            : localStorage.removeItem("cached-data");
                    });
                },
            })),
        }), fileInput));
    });
}
