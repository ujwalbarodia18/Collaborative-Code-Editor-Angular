import { Injectable } from '@angular/core';

declare global {
  interface Window {
    google?: any;
  }
}

@Injectable({ providedIn: 'root' })
export class GoogleAuthLoaderService {
  private loaded = false;
  private loadingPromise?: Promise<boolean>;

  constructor() {}

  load(): Promise<boolean> {
    if (this.loaded) return Promise.resolve(true);
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = new Promise(resolve => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.loaded = !!window.google;
        resolve(this.loaded);
      };

      script.onerror = () => {
        console.log("Error here");
        resolve(false)
      };
      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }
}
