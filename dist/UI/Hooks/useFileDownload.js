export function useFileDownload() {
    return {
        downloadFile: (name, data, mmyType = "application/octet-stream") => {
            const blob = new Blob([data], {
                type: mmyType,
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
    };
}
