import { makeEndpoint, makeErrors } from "@zodios/core";
import {
  ApiErrorSchema,
  generateOtpParameters,
  GenerateOtpResponseSchema,
  verifyOtpParameters,
  VerifyOtpResponseSchema,
  sendSmsParameters,
  SendSmsResponseSchema,
  sendEmailParameters,
  SendEmailResponseSchema,
} from "./schemas";

const errors = makeErrors([
  { status: 400, schema: ApiErrorSchema, description: "Bad Request" },
  { status: 401, schema: ApiErrorSchema, description: "Unauthorized" },
  { status: 403, schema: ApiErrorSchema, description: "Forbidden" },
  { status: 404, schema: ApiErrorSchema, description: "Not Found" },
  { status: 500, schema: ApiErrorSchema, description: "Internal Server Error" },
]);

export const generateOtpEndpoint = makeEndpoint({
  method: "post",
  path: "/api/otp/generate",
  alias: "generateOtp",
  description: "Generate and send an OTP to a user's email or mobile.",
  parameters: generateOtpParameters,
  status: 200,
  response: GenerateOtpResponseSchema,
  errors,
});

export const verifyOtpEndpoint = makeEndpoint({
  method: "post",
  path: "/api/otp/verify",
  alias: "verifyOtp",
  description: "Verify an OTP provided by a user.",
  parameters: verifyOtpParameters,
  status: 200,
  response: VerifyOtpResponseSchema,
  errors,
});

export const sendSmsEndpoint = makeEndpoint({
  method: "post",
  path: "/api/sms/send",
  alias: "sendSms",
  description: "Send a one-way informational SMS message.",
  parameters: sendSmsParameters,
  status: 202,
  response: SendSmsResponseSchema,
  errors,
});

export const sendEmailEndpoint = makeEndpoint({
    method: "post",
    path: "/api/email/send",
    alias: "sendEmail",
    description: "Sends a transactional email using multipart/form-data.",
    parameters: sendEmailParameters,
    status: 200,
    response: SendEmailResponseSchema,
    errors,
  });