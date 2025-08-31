import { elm } from "@amodx/elm";
import { Builder, BuilderToolIds } from "../Builder";

export function ToolUIElememt(props: {
  toolId: BuilderToolIds;
  builder: Builder;
  children: HTMLElement | DocumentFragment;
}) {
  return elm(
    "div",
    {
      className: "builder-tool",
      hooks: {
        afterRender(element) {
          const updateDisplay = () =>
            props.builder.activeTool == props.toolId
              ? (element.style.display = "block")
              : (element.style.display = "none");
          props.builder.addEventListener("tool-set", () => updateDisplay());
          updateDisplay();
        },
      },
    },
    props.children
  );
}
