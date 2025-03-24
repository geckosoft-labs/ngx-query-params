import { DestroyRef, Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

const equal = (a: unknown, b: unknown): boolean => {
  const aArray = Array.isArray(a);
  const bArray = Array.isArray(b);

  if (aArray && bArray) {
    return a.length === b.length && a.every((x, i) => equal(x, b[i]));
  }

  if (aArray !== bArray) {
    return false;
  }

  return `${a}` === `${b}`;
};

export const qpMap = <T>(key: string, f: (x: string[]) => T) => {
  const route = inject(ActivatedRoute);
  const r = signal(f(route.snapshot.queryParamMap.getAll(key)), { equal });
  const sub = route.queryParamMap.subscribe((x) => r.set(f(x.getAll(key))));

  const qpService = inject(QueryParamsService);
  effect(() => qpService.set(key, r()));
  inject(DestroyRef).onDestroy(() => {
    sub.unsubscribe();
  });

  return r;
};

export function qpMap1<T>(key: string, f: (x: string) => T, defaultValue: T): WritableSignal<T>;
export function qpMap1<T>(key: string, f: (x: string) => T, defaultValue?: T): WritableSignal<T | undefined>;
export function qpMap1<T>(key: string, f: (x: string) => T, defaultValue?: T) {
  return qpMap(key, (values) => (values.length === 1 ? f(values[0]) : defaultValue));
}

export function qp(key: string, defaultValue: string): WritableSignal<string>;
export function qp(key: string, defaultValue?: string): WritableSignal<string | undefined>;
export function qp(key: string, defaultValue?: string) {
  return qpMap1(key, (x) => x, defaultValue);
}

export function qpNum(key: string, defaultValue: number): WritableSignal<number>;
export function qpNum(key: string, defaultValue?: number): WritableSignal<number | undefined>;
export function qpNum(key: string, defaultValue?: number) {
  return qpMap1(key, (x) => +x, defaultValue);
}


export function qpBool(key: string, defaultValue: boolean): WritableSignal<boolean>;
export function qpBool(key: string, defaultValue?: boolean): WritableSignal<boolean | undefined>;
export function qpBool(key: string, defaultValue?: boolean) {
  return qpMap1(key, (x) => x === 'true', defaultValue);
}

export const qpMapN = <T>(key: string, f: (x: string) => T) => qpMap(key, (values) => values.map(f));

export function qpCast1<T extends string>(key: string, defaultValue: T): WritableSignal<T>;
export function qpCast1<T extends string>(key: string, defaultValue?: T): WritableSignal<T | undefined>;
export function qpCast1<T extends string>(key: string, defaultValue?: T) {
  return qpMap1(key, (x) => x as T, defaultValue);
}

export const qpCastN = <T extends string>(key: string) => qpMap(key, (values) => values as T[]);

const emptyQp = {};

@Injectable({
  providedIn: 'root',
})
export class QueryParamsService {
  private readonly router = inject(Router);
  private readonly mapSignal = signal<Params>(emptyQp, { equal: () => false });

  constructor() {
    effect(() => {
      const queryParams = this.mapSignal();
      if (queryParams !== emptyQp) {
        this.mapSignal.set(emptyQp);
        void this.router.navigate([], {
          queryParams,
          replaceUrl: true,
          queryParamsHandling: 'merge',
          preserveFragment: true,
        });
      }
    });
  }

  set(key: string, value: unknown) {
    this.mapSignal.update((prev) => ({
      ...prev,
      [key]: value,
    }));
  }
}
