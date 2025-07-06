export const JSONFileAPI = {
  /**
   * Internal file input element for JSON uploads.
   */
  _input: null as HTMLInputElement | null,

  /**
   * Initializes the file input element.
   * Must be called before using uploadJSON.
   */
  init(): void {
    if (this._input) return;
    this._input = document.createElement("input");
    this._input.type = "file";
    this._input.accept = ".json,application/json";
    this._input.style.display = "none";
    document.body.appendChild(this._input);
  },

  /**
   * Prompts the user to upload a JSON file and returns the parsed object.
   */
  async uploadJSON<T = any>(): Promise<T> {
    if (!this._input) throw new Error("Call JSONFileAPI.init() first");

    return new Promise<T>((resolve, reject) => {
      this._input!.onchange = () => {
        const file = this._input!.files?.[0];
        if (!file) return reject("No file selected");

        const reader = new FileReader();
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result as string);
            resolve(json);
          } catch (err) {
            reject("Invalid JSON");
          }
        };
        reader.onerror = () => reject("Failed to read file");
        reader.readAsText(file);
      };
      this._input!.click();
    });
  },

  /**
   * Triggers download of a given object as a JSON file.
   */
  downloadJSON(filename: string, obj: unknown): void {
    const jsonString = JSON.stringify(obj, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".json") ? filename : filename + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
