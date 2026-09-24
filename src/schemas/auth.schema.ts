import { JSONSchemaType } from "ajv";

export interface RegisterSchema {
  nombre: string;
  email: string;
  password: string;
}

export const registerSchema: JSONSchemaType<RegisterSchema> = {
  type: "object",
  properties: {
    nombre: {
      type: "string",
      minLength: 2,
      maxLength: 100,
    },
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
      minLength: 6,
      maxLength: 100,
    },
  },
  required: ["nombre", "email", "password"],
  additionalProperties: false,
};

export interface LoginSchema {
  email: string;
  password: string;
}

export const loginSchema: JSONSchemaType<LoginSchema> = {
  type: "object",
  properties: {
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
      minLength: 1,
    },
  },
  required: ["email", "password"],
  additionalProperties: false,
};