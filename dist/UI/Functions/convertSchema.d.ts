import { Property } from "@amodx/schemas";
import { Property as NCSProperty } from "@amodx/ncs";
import { SchemaCursor } from "@amodx/ncs/Schema/Schema.types";
export declare const traverseTransform: (parent: NCSProperty, property: Property<any, any>, target: any) => Property<any, any>;
/** Convert a NCS component schema into a a form schema for an UI. */
export default function convertSchema(schema: SchemaCursor): import("@amodx/schemas").ObjectSchemaInstanceBase;
