import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxsModule, provideStore } from '@ngxs/store';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { RoomState } from '../collaborative-code-editor/data-collaborative-code-editor/states/room/room.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      NgxsModule.forRoot([ RoomState ])
    )
  ]
};
