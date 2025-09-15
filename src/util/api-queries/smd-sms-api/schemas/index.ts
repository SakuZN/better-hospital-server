import { z } from "zod";
import { parametersBuilder } from "@zodios/core";

// Common Schemas
const MobileSchema = z
  .string({ required_error: "Mobile number is required." })
  .regex(/^(\+639|639|09|9)\d{9}$/, "Invalid Philippine mobile number format.");

const EmailSchema = z
  .string({ required_error: "Email is required." })
  .email("Invalid email format.");

export const ApiErrorSchema = z.object({
  status_code: z.number().optional().nullable(),
  message: z.string().optional().nullable(),
  error: z.string().optional().nullable(),
});

// OTP Generation
export const GenerateOtpPayloadSchema = z
  .object({
    email: EmailSchema.optional(),
    mobile: MobileSchema.optional(),
    expiry_minutes: z.number().optional().nullable(),
    config: z
      .object({
        length: z.number().optional().nullable(),
        type: z.string().optional().nullable(),
        expiry_minutes: z.number().optional().nullable(),
        next_retry_minutes: z.number().optional().nullable(),
        grace_period_seconds: z.number().optional().nullable(),
      })
      .optional()
      .nullable(),
    params: z
      .object({
        company: z.string({ required_error: "Company name is required." }),
        companyLogo: z
          .string()
          .url()
          .refine(
            (val) =>
              !val ||
              /^https:\/\/[^/]+\/.*\.(png|jpg|jpeg|gif|webp)$/i.test(val),
            {
              message:
                "companyLogo must be a valid https URL ending with .png, .jpg, .jpeg, .gif, or .webp",
            }
          )
          .optional()
          .nullable(),
      })
      .optional()
      .nullable(),
  })
  .refine((data) => !!data.email || !!data.mobile, {
    message: "Either 'email' or 'mobile' must be provided.",
  });

export const GenerateOtpResponseSchema = z.object({
  status_code: z.number().optional().nullable(),
  message: z.string().optional().nullable(),
  data: z
    .object({
      next_retry_at: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export const generateOtpParameters = parametersBuilder()
  .addHeader("x-partner-id", z.string())
  .addHeader("x-partner-token", z.string())
  .addBody(GenerateOtpPayloadSchema)
  .build();

// OTP Verification
export const VerifyOtpPayloadSchema = z
  .object({
    email: EmailSchema.optional(),
    mobile: MobileSchema.optional(),
    code: z.string({ required_error: "OTP code is required." }),
  })
  .refine((data) => !!data.email || !!data.mobile, {
    message: "Either 'email' or 'mobile' must be provided.",
  });

export const VerifyOtpResponseSchema = z.object({
  status_code: z.number().optional().nullable(),
  message: z.string().optional().nullable(),
});

export const verifyOtpParameters = parametersBuilder()
  .addHeader("x-partner-id", z.string())
  .addHeader("x-partner-token", z.string())
  .addBody(VerifyOtpPayloadSchema)
  .build();

// SMS Sending
export const SendSmsPayloadSchema = z.object({
  mobile: MobileSchema,
  message: z.string({ required_error: "Message is required." }),
});

export const SendSmsResponseSchema = z.object({
  status_code: z.number().optional().nullable(),
  message: z.string().optional().nullable(),
});

export const sendSmsParameters = parametersBuilder()
  .addHeader("x-partner-id", z.string())
  .addHeader("x-partner-token", z.string())
  .addBody(SendSmsPayloadSchema)
  .build();

export const BaseEmailFields = z.object({
  to_email: EmailSchema,
  template_id: z.coerce.number({
    required_error: "Template ID is required.",
  }),
  params: z.record(z.any()).optional().nullable(),
  subject: z.string().optional().nullable(),
  html_content: z.string().optional().nullable(),
  reply_to: z.string().email().optional().nullable(),
  attachments: z.array(z.instanceof(File)).optional(),
});

// Email Sending
export const SendEmailFieldsSchema = BaseEmailFields.extend({
  confirmation_email: BaseEmailFields.optional().nullable(),
})

export const SendEmailResponseSchema = z.object({
  status_code: z.number().optional().nullable(),
  message: z.string().optional().nullable(),
});

export const SendEmailPayloadSchema = SendEmailFieldsSchema.transform((fields) => {
  const fd = new FormData();

  fd.append("to_email", fields.to_email);
  fd.append("template_id", String(fields.template_id));

  if (fields.subject ?? null) fd.append("subject", fields.subject as string);
  if (fields.html_content ?? null) fd.append("html_content", fields.html_content as string);
  if (fields.reply_to ?? null) fd.append("reply_to", fields.reply_to as string);
  if (fields.confirmation_email ?? null) {
    fd.append("confirmation_email", JSON.stringify(fields.confirmation_email));
  }

  if (fields.params ?? null) {
    // Send params as JSON; adjust if your API expects flattened keys
    fd.append("params", JSON.stringify(fields.params));
  }

  if (fields.attachments?.length) {
    for (const file of fields.attachments) {
      fd.append("attachments", file);
    }
  }

  return fd;
});

export const sendEmailParameters = parametersBuilder()
  .addHeader("x-partner-id", z.string())
  .addHeader("x-partner-token", z.string())
  .addBody(SendEmailPayloadSchema)
  .build();

// Type Exports
export type GenerateOtpPayload = z.infer<typeof GenerateOtpPayloadSchema>;
export type VerifyOtpPayload = z.infer<typeof VerifyOtpPayloadSchema>;
export type SendSmsPayload = z.infer<typeof SendSmsPayloadSchema>;
export type SendEmailFields = z.infer<typeof SendEmailFieldsSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;