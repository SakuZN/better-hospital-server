import { Subject, from, EMPTY } from "rxjs";
import { concatMap, catchError, tap } from "rxjs/operators";

class WriteQueue {
    private queue$ = new Subject<{
        operation: () => Promise<any>;
        context?: string;
    }>();

    constructor() {
        this.queue$
            .pipe(
                concatMap(({ operation, context }) =>
                    from(operation()).pipe(
                        tap(() => {
                            if (context) {
                                console.log(`Operation for ${context} completed successfully`);
                            }
                        }),
                        catchError((error) => {
                            if (context) {
                                console.error(`Operation for ${context} failed:`, error);
                            } else {
                                console.error("Queue operation failed:", error);
                            }
                            return EMPTY;
                        }),
                    ),
                ),
            )
            .subscribe({
                complete: () => console.log("Queue completed"),
            });
    }

    enqueue(writeOp: () => Promise<any>, context?: string) {
        this.queue$.next({ operation: writeOp, context });
    }
}

export const writeQueue = new WriteQueue();
