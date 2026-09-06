import { DestroyRef, Injectable, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Viewport {
  private readonly media = window.matchMedia('(max-width: 767px)');
  readonly isMobile = signal(this.media.matches);

  constructor() {
    const listener = (event: MediaQueryListEvent): void => this.isMobile.set(event.matches);
    this.media.addEventListener('change', listener);
    inject(DestroyRef).onDestroy(() => this.media.removeEventListener('change', listener));
  }
}
