import { of, zip, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { FastifyRequest } from "fastify";
import logger from "@/util/local-logger";

interface ErrorWithResponse extends Error {
  response?: {
    status: number;
    statusText: string;
    data: any;
  };
  status_code?: number;
}

interface RequestData {
  request: {
    body: any;
    params: any;
    query: any;
    url: string;
    method: string;
  };
  err: any;
  status_code?: number;
  message?: string;
}

export const catchErrorFunc =
  (req: FastifyRequest, enable_discord = true) =>
  (err: any): Observable<any> => {
    let data: RequestData = {
      request: {
        body: req.body,
        params: req.params,
        query: req.query,
        url: req.raw.url!,
        method: req.raw.method!,
      },
      err: {},
    };

    if (err instanceof Error) {
      data.err = {
        message: err.message,
        stack: err.stack,
      };

      const errorWithResponse = err as ErrorWithResponse;
      if (errorWithResponse.response) {
        data.err["status"] = errorWithResponse.response.status;
        data.err["statusText"] = errorWithResponse.response.statusText;
        data.err["data"] = errorWithResponse.response.data;
      }
    } else {
      data.err = err;
    }
    let o$: Observable<any> = of(1);

    if (err && (err.status || err.status_code)) {
      enable_discord = false;
      data["status_code"] = err.status || err.status_code;
      data["message"] = err.message || err.statusText;
    }

    return zip(of(err), o$).pipe(
      map(([e]) => e),
      catchError((e) => {
        logger.error(`Error: ${e.message}`);
        return of(data);
      }),
    );
  };
