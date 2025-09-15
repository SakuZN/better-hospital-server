import axios, { Method } from "axios";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as qs from "qs";
import { from } from "rxjs";
import logger from "@/util/local-logger";

interface RegisterProxyRouteOptions {
  app: FastifyInstance;
  upstream: string;
  prefix: string;
  rewritePrefix?: string;
  additionalHeaders?: Record<string, string>;
  shouldValidate?: boolean;
}

export default function registerProxyRoute({
  app,
  upstream,
  prefix,
  rewritePrefix,
  additionalHeaders,
  shouldValidate = true,
}: RegisterProxyRouteOptions) {
  // Define the route with wildcard to capture the remaining path
  const routeUrl = prefix.endsWith("/") ? `${prefix}*` : `${prefix}/*`;

  app.route({
    method: ["DELETE", "GET", "HEAD", "PATCH", "POST", "PUT", "OPTIONS"],
    url: routeUrl,
    preValidation: shouldValidate ? app.authenticate : undefined,
    handler: (req: FastifyRequest, res: FastifyReply) => {
      // Extract the wildcard path
      const wildcardPath = ((req.params as any)["*"] as string) || "";

      // Construct the upstream path
      let upstreamPath = "";

      if (rewritePrefix) {
        // Replace parameters in rewritePrefix with values from req.params
        upstreamPath = rewritePrefix.replace(
          /:([a-zA-Z0-9_]+)/g,
          (_, param) => {
            return encodeURIComponent((req.params as any)[param]);
          },
        );
      } else {
        // If no rewritePrefix, use the prefix
        upstreamPath = "";
      }

      // Append the wildcard path
      const combinedPath = [upstreamPath, wildcardPath]
        .filter(Boolean)
        .join("/")
        .replace(/\/+/g, "/");

      // Build the full upstream URL
      const upstreamUrlObj = new URL(upstream);
      upstreamUrlObj.pathname = [upstreamUrlObj.pathname, combinedPath]
        .join("/")
        .replace(/\/+/g, "/");

      // Prepare headers
      const headers = {
        ...req.headers,
        ...additionalHeaders,
      };

      // Remove hop-by-hop headers
      delete headers["host"];
      delete headers["content-length"];

      delete headers["x-real-ip"];
      delete headers["x-forwarded-for"];

      let data: any = undefined;

      // Special handling for GET requests with body
      const contentType = headers["content-type"] || headers["Content-Type"];

      if (
        req.method === "GET" &&
        contentType &&
        contentType.includes("application/x-www-form-urlencoded")
      ) {
        // Convert query parameters to x-www-form-urlencoded body
        data = qs.stringify(req.query);
        // Remove query params from URL
        upstreamUrlObj.search = "";
      } else if (
        contentType &&
        contentType.includes("application/x-www-form-urlencoded") &&
        typeof req.body === "object"
      ) {
        // Convert body to x-www-form-urlencoded string
        data = qs.stringify(req.body as any);
      } else if (req.body) {
        // For other content types, pass the body as is
        data = req.body;
      }
      from(
        axios.request({
          method: req.method as Method,
          url: upstreamUrlObj.toString(),
          headers,
          data,
          timeout: 10000,
          responseType: "stream", // Add this line
        }),
      ).subscribe({
        next: (axiosResponse) => {
          // Forward the response status and headers
          //if status is not 200, log the error
          if (axiosResponse.status !== 200) {
            logger.error("Proxy request error", axiosResponse);
          }
          res.status(axiosResponse.status);
          for (const [key, value] of Object.entries(axiosResponse.headers)) {
            if (key.toLowerCase() === "transfer-encoding") continue; // Skip hop-by-hop headers
            // Handle possible array of headers
            if (Array.isArray(value)) {
              res.header(key, value.join(","));
            } else {
              res.header(key, value as string);
            }
          }

          // Send the response data
          res.send(axiosResponse.data); // Axios response data is a stream
        },
        error: (error: any) => {
          // Handle request errors
          logger.error("Proxy request error", error);
          res
            .status(error.response?.status || 500)
            .send(error.response?.data || error.message);
        },
      });
    },
  });
}
