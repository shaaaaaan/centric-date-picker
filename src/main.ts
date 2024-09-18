import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {createCustomElement} from "@angular/elements";
import {DatePickerComponent} from "./app/components/date-picker/date-picker.component";

bootstrapApplication(AppComponent, appConfig)
  .then((app) => {
    const DatePickerElement = createCustomElement(DatePickerComponent, {
      injector: (app).injector
    });
    customElements.define('centric-date-picker', DatePickerElement);
  })
  .catch((err) => console.error(err));
