import { StateContext } from "@ngxs/store";
import { finalize, Observable } from "rxjs";

export function withLoading<T, S>(
  ctx: StateContext<S>,
  obs$: Observable<T>,
  loadingKey: keyof S
) {
  ctx.patchState({
    [loadingKey]: true
  } as Partial<S>);

  return obs$.pipe(
    finalize(() => {
      ctx.patchState({
        [loadingKey]: false
      } as Partial<S>);
    })
  );
}
