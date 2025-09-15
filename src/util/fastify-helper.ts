export const typeString = { type: "string", nullable: true };
export const typeStringMaxLen = (maxLength = 100) => ({
  type: "string",
  maxLength,
});

interface TypeObjectOptions {
  properties: object;
  required?: any[];
  additionalProperties?: boolean | object;
  nullable?: boolean;
  examples?: object[];
}

export const typeNumber = { type: "number", nullable: true };
export const typeBoolean = { type: "boolean" };
export const typeArray = (items: any) => ({ type: "array", items });

export const typeObject = ({
  properties,
  required = [],
  additionalProperties = false,
  nullable = true,
  examples = [],
}: TypeObjectOptions) => {
  const schema: {
    type: string;
    properties: object;
    additionalProperties: boolean | object;
    nullable: boolean;
    required?: string[];
    examples?: object[];
  } = {
    type: "object",
    properties,
    additionalProperties,
    nullable,
  };

  if (required.length) {
    schema.required = required;
  }

  if (examples.length) {
    schema.examples = examples;
  }

  return schema;
};

export const typeOneOf = (data: any[]) => {
  return {
    oneOf: data,
  };
};

export const typeObjectError = (examples?: object[]) =>
  typeObject({
    properties: {
      status_code: typeNumber,
      message: typeString,
      error: typeString,
    },
    examples,
  });

export const typeObjectResponse = (body: object, examples?: object[]) =>
  typeObject({
    properties: {
      ...body,
    },
    examples,
  });

interface JSONResponseSchemaOptions {
  body: object;
  examples?: { [key: string]: object[] };
  errorExamples?: { [key: string]: object[] };
  statusCodes?: { [key: string]: boolean };
}

export function generateJSONResponseSchema(data: JSONResponseSchemaOptions) {
  const {
    body = {},
    examples = {},
    errorExamples = {},
    statusCodes = {}, // Add statusCodes parameter
  } = data;
  const responseSchema: { [key: string]: object } = {};

  const defaultStatusCodes = {
    "102": true,
    "200": true,
    "202": true,
    "400": true,
    "401": true,
    "403": true,
    "404": true,
    "409": true,
    "500": true,
  };

  const codes = statusCodes || defaultStatusCodes;

  if (codes["102"]) {
    responseSchema["102"] = typeObjectResponse(body, examples?.["102"]);
  }
  if (codes["200"]) {
    responseSchema["200"] = typeObjectResponse(body, examples?.["200"]);
  }
  if (codes["202"]) {
    responseSchema["202"] = typeObjectResponse(body, examples?.["202"]);
  }
  if (codes["400"]) {
    responseSchema["400"] = typeObjectError(errorExamples?.["400"]);
  }
  if (codes["401"]) {
    responseSchema["401"] = typeObjectError(errorExamples?.["401"]);
  }
  if (codes["403"]) {
    responseSchema["403"] = typeObjectError(errorExamples?.["403"]);
  }
  if (codes["404"]) {
    responseSchema["404"] = typeObjectError(errorExamples?.["404"]);
  }
  if (codes["409"]) {
    responseSchema["409"] = typeObjectError(errorExamples?.["409"]);
  }
  if (codes["500"]) {
    responseSchema["500"] = typeObjectError(errorExamples?.["500"]);
  }

  return responseSchema;
}
