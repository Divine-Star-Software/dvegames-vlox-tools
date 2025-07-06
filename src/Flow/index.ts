import { FlowEditorElement } from "./FlowEditor.element";

declare global {
  interface HTMLElementTagNameMap {
    "flow-editor": FlowEditorElement;
  }
}

export function RegisterElements(currentWindow: Window = window) {
  currentWindow.customElements.define("flow-editor", FlowEditorElement);
}

RegisterElements();
