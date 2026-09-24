import { JSONSchemaType } from "ajv";

export interface CreateTaskSchema {
  titulo: string;
  descripcion?: string | null;
  fecha_vencimiento?: string | null;
  estado?: "pendiente" | "en curso" | "completada";
}

export const createTaskSchema: JSONSchemaType<CreateTaskSchema> = {
  type: "object",
  properties: {
    titulo: {
      type: "string",
      minLength: 1,
      maxLength: 200,
    },
    descripcion: {
      type: "string",
      nullable: true,
      maxLength: 1000,
    },
    fecha_vencimiento: {
      type: "string",
      nullable: true,
      format: "date",
    },
    estado: {
      type: "string",
      enum: ["pendiente", "en curso", "completada"],
      nullable: true,
    },
  },
  required: ["titulo"],
  additionalProperties: false,
};

export interface UpdateTaskSchema {
  titulo: string;
  descripcion?: string | null;
  fecha_vencimiento?: string | null;
  estado: "pendiente" | "en curso" | "completada";
}

export const updateTaskSchema: JSONSchemaType<UpdateTaskSchema> = {
  type: "object",
  properties: {
    titulo: {
      type: "string",
      minLength: 1,
      maxLength: 200,
    },
    descripcion: {
      type: "string",
      nullable: true,
      maxLength: 1000,
    },
    fecha_vencimiento: {
      type: "string",
      nullable: true,
      format: "date",
    },
    estado: {
      type: "string",
      enum: ["pendiente", "en curso", "completada"],
    },
  },
  required: ["titulo", "estado"],
  additionalProperties: false,
};