import { ZodiosPlugin, ZodiosInstance, ZodiosEndpointDefinitions, 
  isErrorFromAlias } from "@zodios/core";
import type { AxiosError } from "axios";
import qs from "qs";
import { z, type ZodTypeAny } from "zod";

export const loggerPlugin: ZodiosPlugin = {
  request: async (_api, config) => {
    console.log(
      `[ZODIOS ▶] ${config.method.toUpperCase()} ${config.baseURL || ""}${config.url}`,
      { headers: config.headers, params: config.params, data: config.data, queries: config.queries, "full_url": `${config.baseURL || ""}${config.url}` }
    );
    return config;
  },
  response: async (_api, config, response) => {
    console.log(
      `[ZODIOS ◀] ${config.method.toUpperCase()} ${config.baseURL || ""}${config.url}`,
      { status: response.status }
    );
    return response;
  },
  error: async (_api, config, error) => {
    console.error(
      `[ZODIOS ⚠] ${config.method.toUpperCase()} ${config.baseURL || ""}${config.url}`,
    );
    //LOG ERROR MESSAGE
    console.error("Error message:", error.message || "Unknown error");
    throw error;
  },
};

export const repeatArrayPlugin: ZodiosPlugin = {
  request: async (_api, config) => {
    return {
      ...config,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' })
    };
  },
};

export type SafeResponse<T, E> = { data: T | null; error: E | null };

/* ---------------------------------- */
/*            Type Helpers            */
/* ---------------------------------- */

// Alias names present in API definitions and available on the client instance
type AliasKeys<Api extends ZodiosEndpointDefinitions> =
  Extract<Api[number], { alias: string }>["alias"] & Extract<keyof ZodiosInstance<Api>, string>;

type EndpointByAlias<
  Api extends ZodiosEndpointDefinitions,
  Alias extends string
> = Extract<Api[number], { alias: Alias }>;

type ErrorsForAlias<
  Api extends ZodiosEndpointDefinitions,
  Alias extends string
> = NonNullable<EndpointByAlias<Api, Alias>["errors"]>;

type InferIfZod<T> = T extends ZodTypeAny ? z.infer<T> : never;

type DefaultErrorSchemaForAlias<
  Api extends ZodiosEndpointDefinitions,
  Alias extends string
> = Extract<
  ErrorsForAlias<Api, Alias>[number],
  { status: "default" }
> extends { schema: infer S }
  ? S
  : never;

type AnyErrorSchemaForAlias<
  Api extends ZodiosEndpointDefinitions,
  Alias extends string
> = ErrorsForAlias<Api, Alias>[number] extends { schema: infer S }
  ? S
  : never;

export type ErrorDataForAlias<
  Api extends ZodiosEndpointDefinitions,
  Alias extends string
> = InferIfZod<AnyErrorSchemaForAlias<Api, Alias>> | InferIfZod<DefaultErrorSchemaForAlias<Api, Alias>>;

export type SafeClient<Api extends ZodiosEndpointDefinitions> =
  Omit<ZodiosInstance<Api>, AliasKeys<Api>> & {
    [A in AliasKeys<Api>]: ZodiosInstance<Api>[A] extends (
      ...args: infer P
    ) => Promise<infer R>
      ? (
          ...args: P
        ) => Promise<
          SafeResponse<R, AxiosError<ErrorDataForAlias<Api, A>> | Error>
        >
      : never;
  };

/* ---------------------------------- */
/*          Wrapper / Factory         */
/* ---------------------------------- */

export function createSafeClient<Api extends ZodiosEndpointDefinitions>(
  client: ZodiosInstance<Api>,
  api: Api
): SafeClient<Api> {
  const aliasSet = new Set(
    api.map((e) => e.alias).filter((a): a is string => typeof a === "string")
  );

  return new Proxy(client, {
    get(target, prop, receiver) {
      const original = Reflect.get(target, prop, receiver);
      if (typeof original !== "function") {
        return original;
      }

      return async (...args: any[]) => {
        try {
          const data = await (original as any)(...args);
          return { data, error: null } as SafeResponse<any, never>;
        } catch (err) {
          if (typeof prop === "string" && aliasSet.has(prop)) {
            const alias = prop as AliasKeys<Api>;
            if (isErrorFromAlias(api, alias as any, err)) {
              return {
                data: null,
                error: err as AxiosError<ErrorDataForAlias<Api, typeof alias>>,
              };
            }
          }
          return { data: null, error: err as Error };
        }
      };
    },
  }) as SafeClient<Api>;
}