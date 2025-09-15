import { FastifyRequest, FastifyReply } from "fastify";
import { defer, from, of, throwError } from "rxjs";
import { mergeMap } from "rxjs/operators";
import pocketbaseClient from "@/util/pocketbase";

export const privateAPIKeyHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void,
) => {
  const key = request.headers["apikey"] as string;
  const pbDB = pocketbaseClient();

  if (!key) {
    reply.code(403).send({
      status_code: 403,
      message: "Invalid API key.",
    });
    return;
  }

  const keyData$ = from(
    defer(() =>
      pbDB.collection("api_key").getFirstListItem(`key="${key}"`, {
        skipTotal: true,
      }),
    ),
  );

  keyData$
    .pipe(
      mergeMap((data) => {
        if (!data || data.access_level !== "private" || !data.active) {
          console.log("Invalid API key");
          return throwError(() => ({
            status_code: 403,
            message: "Invalid API key.",
          }));
        }
        return of(data);
      }),
    )
    .subscribe({
      next: () => done(),
      error: () =>
        reply.code(403).send({
          status_code: 403,
          message: "Invalid API key.",
        }),
    });
};

export const publicAPIKeyHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void,
) => {
  const key = request.headers["apikey"] as string;
  const pbDB = pocketbaseClient();

  if (!key) {
    reply.code(403).send({
      status_code: 403,
      message: "Invalid API key.",
    });
    return;
  }

  const keyData$ = from(
    defer(() =>
      pbDB.collection("api_key").getFirstListItem(`key="${key}"`, {
        skipTotal: true,
      }),
    ),
  );

  keyData$
    .pipe(
      mergeMap((data) => {
        if (!data || data.access_level !== "public" || !data.active) {
          console.log("Invalid API key");
          return throwError(() => ({
            status_code: 403,
            message: "Invalid API key.",
          }));
        }
        return of(data);
      }),
    )
    .subscribe({
      next: () => done(),
      error: () =>
        reply.code(403).send({
          status_code: 403,
          message: "Invalid API key.",
        }),
    });
};
