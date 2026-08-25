/**
 * Common Angular Decorators & Helpers
 * Useful decorators and patterns for common Angular tasks
 */

import { Component, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Decorator to automatically unsubscribe from observables on component destroy
 * Usage: @Component { @UntilDestroy() destroy$ = new Subject<void>(); }
 * Then use: subscription.pipe(takeUntil(this.destroy$))
 */
export function UntilDestroy() {
  return function <T extends { new(...args: any[]): {} }>(constructor: T) {
    const ngOnDestroy = constructor.prototype.ngOnDestroy;
    constructor.prototype.ngOnDestroy = function () {
      if (this.destroy$ && !this.destroy$.closed) {
        this.destroy$.next();
        this.destroy$.complete();
      }
      if (ngOnDestroy) {
        ngOnDestroy.call(this);
      }
    };
    return constructor;
  };
}

/**
 * Base component with automatic unsubscribe functionality
 * Extend this instead of Component for easy subscription management
 */
@Directive()
export abstract class BaseComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

/**
 * Memoization decorator for methods
 * Caches the result of expensive function calls
 * Usage: @Memoize() expensiveMethod(param: string): Result { }
 */
export function Memoize(): MethodDecorator {
  const cache = new Map();

  return function (
    target: any,
    propertyKey: string | symbol | undefined,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        return cache.get(key);
      }

      const result = originalMethod.apply(this, args);
      cache.set(key, result);

      return result;
    };

    return descriptor;
  };
}

/**
 * Debounce decorator for methods
 * Delays method execution until after a specified time
 * Usage: @Debounce(500) onSearchInput(query: string) { }
 */
export function Debounce(delay: number): MethodDecorator {
  let timeoutId: any;

  return function (
    target: any,
    propertyKey: string | symbol | undefined,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args);
      }, delay);
    };

    return descriptor;
  };
}

/**
 * Throttle decorator for methods
 * Limits method execution to once per specified interval
 * Usage: @Throttle(1000) onWindowResize() { }
 */
export function Throttle(interval: number): MethodDecorator {
  let lastCallTime = 0;

  return function (
    target: any,
    propertyKey: string | symbol | undefined,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const now = Date.now();

      if (now - lastCallTime >= interval) {
        lastCallTime = now;
        originalMethod.apply(this, args);
      }
    };

    return descriptor;
  };
}

/**
 * Async operation decorator
 * Automatically sets loading state on method execution
 * Usage: @AsyncOperation() async submitForm() { }
 */
export function AsyncOperation(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol | undefined,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        (this as any).isLoading = true;
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        console.error('Async operation failed:', error);
        throw error;
      } finally {
        (this as any).isLoading = false;
      }
    };

    return descriptor;
  };
}

/**
 * Lazy load directive
 * Lazy loads content when it enters viewport
 * Usage: <div appLazyLoad (lazyLoad)="onLoad()">Content</div>
 */
@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private elementRef: ElementRef) {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Load content
            this.observer?.unobserve(entry.target);
          }
        });
      });

      this.observer.observe(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
