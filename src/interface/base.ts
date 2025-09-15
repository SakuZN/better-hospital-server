import { typeNumber, typeString } from "@/util/fastify-helper";

export interface IBaseAPIResponseModel {
  status_code: number;
  message?: string;
}

export const BaseResponseSchema = {
  status_code: typeNumber,
  message: typeString,
};

export const errorExamples = {
  "403": [
    {
      summary: "Invalid API Key Provided",
      value: {
        status_code: 403,
        message: "Invalid API key.",
      },
    },
  ],
};