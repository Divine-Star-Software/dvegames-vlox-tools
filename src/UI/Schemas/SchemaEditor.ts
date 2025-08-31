import { ElementChildren, elm, frag, wrap } from "@amodx/elm";
import {
  SchemaEditorNodeObservers,
  SchemaEditorObservers,
} from "./SEInputElement";
import { ObjectSchemaInstance, Property, Schema } from "@amodx/schemas";
import { SchemaEditorInputRegister } from "./SchemaEditorInputRegister";
import { SchemaNode } from "@amodx/schemas/Schemas/SchemaNode";
import "./Inputs/index";
import convertSchema from "../Functions/convertSchema";
import { SchemaCursor } from "@amodx/ncs/Schema/Schema.types";

function traverseCreate(
  node: SchemaNode,
  observers: SchemaEditorObservers,
  elements: ElementChildren[],
  nodeObservers: Map<SchemaNode, SchemaEditorNodeObservers>
) {
  if (node.children) {
    const children: HTMLElement[] = [];

    for (const child of node.children) {
      traverseCreate(child, observers, children, nodeObservers);
    }
    elements.push(
      elm(
        "div",
        "schema-editor-group",
        elm(
          "p",
          "schema-editor-group-title",
          node.property.name || node.property.id
        ),
        children
      )
    );
    return;
  }
  if (
    (typeof node.property.editable !== "undefined" &&
      !node.property.editable) ||
    !node.input
  )
    return;

  const nodeObserve = new SchemaEditorNodeObservers();
  const newElms = SchemaEditorInputRegister.get(node.input.data.type)({
    node,
    schema: observers,
    observers: nodeObserve,
  });

  elements.push(newElms);

  nodeObservers.set(node, nodeObserve);
}

export const SchemaEditor = wrap<
  {
    schemaInstance?: ObjectSchemaInstance;
    schema?: SchemaCursor<any>;
    properties?: Property<any, any>[];
  },
  "div"
>("div", true, (props) => {
  let schemaInstance =
    props.properties && props.properties.length
      ? Schema.CreateInstance(...props.properties)
      : props.schemaInstance
      ? props.schemaInstance
      : props.schema
      ? convertSchema(props.schema)
      : null;

  if (!schemaInstance) return frag();
  const observers = new SchemaEditorObservers();
  const elements: ElementChildren[] = [];
  const nodeObservers = new Map<SchemaNode, SchemaEditorNodeObservers>();
  const root = schemaInstance.getSchema().getRoot();

  if (root.children) {
    for (const child of root.children) {
      traverseCreate(child, observers, elements, nodeObservers);
    }
  }

  return elm(
    "div",
    {
      className: "schema-editor",
    },
    ...elements
  );
});
