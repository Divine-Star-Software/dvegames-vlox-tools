interface UseFileUploadObject {
    fileInput: HTMLInputElement;
    uploadFile(type: "string"): Promise<string | null>;
    uploadFile(type: "binary"): Promise<ArrayBuffer | null>;
}
export declare function useFileUpload(): UseFileUploadObject;
export {};
