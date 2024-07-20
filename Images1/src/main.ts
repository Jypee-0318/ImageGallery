import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { registerLicense } from '@syncfusion/ej2-base'
import { AppModule } from './app/app.module';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF5cXmZCdkx3THxbf1x0ZFRHalxTTndcUiweQnxTdEFjXn1ecXVVRGFYV0FzVg==')
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
