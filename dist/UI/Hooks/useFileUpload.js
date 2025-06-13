export function useFileUpload() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    return {
        fileInput,
        uploadFile(type = "binary") {
            return new Promise((resolve) => {
                const listener = () => {
                    const file = fileInput.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (type === "string") {
                                resolve(reader.result);
                            }
                            else {
                                resolve(reader.result);
                            }
                        };
                        if (type === "string") {
                            reader.readAsText(file);
                        }
                        if (type === "binary") {
                            reader.readAsArrayBuffer(file);
                        }
                    }
                    else {
                        resolve(null);
                    }
                    fileInput.removeEventListener("change", listener);
                };
                fileInput.addEventListener("change", listener);
                fileInput.click();
            });
        },
    };
}
