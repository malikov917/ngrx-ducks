import { MemoizedSelector } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { NgRxDucksNotConnectedError } from '../create-duck/create-duck-not-connected.error';

export type SelectorConditional<
  T extends MemoizedSelector<any, any>
> = T extends MemoizedSelector<any, infer TResult>
  ? Observable<TResult>
  : never;

export type Selectors<
  T extends { [key: string]: MemoizedSelector<any, any> }
> = { [K in keyof T]: SelectorConditional<T[K]> };

export function bindSelectors<
  T extends { [key: string]: MemoizedSelector<any, any> }
>(selectors: T): Selectors<T> {
  const selectorsFailing = Object.keys(selectors).reduce(
    (fakes, selector) => ({
      ...fakes,
      [selector]: throwError(new NgRxDucksNotConnectedError())
    }),
    {}
  );

  return {
    ...selectorsFailing,
    __ngrx_ducks__selectors_original: selectors
  } as any;
}
