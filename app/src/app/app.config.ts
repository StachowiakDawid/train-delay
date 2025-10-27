import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { pl } from 'date-fns/locale';
import { DateFnsConfigurationService } from 'ngx-date-fns';
const polishConfig = new DateFnsConfigurationService();
polishConfig.setLocale(pl);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    { provide: DateFnsConfigurationService, useValue: polishConfig }
  ]
};
