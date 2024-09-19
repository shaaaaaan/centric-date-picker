import {Injectable} from '@angular/core';
import {DatePickerModel} from "../models/DatePickerModel";
import {DateModel} from "../models/DateModel";
import {TimeModel} from "../models/TimeModel";

@Injectable({
  providedIn: 'root'
})
export class ConvertorService {

  constructor() {
  }

  toDate(model: DatePickerModel, mode: 'date' | 'time' | 'datetime'): Date {
    switch (mode) {
      case 'datetime':
        return new Date(model.date.year, model.date.month - 1, model.date.day, model.time.hours, model.time.minutes, model.time.seconds, 0);
      case 'date':
        return new Date(model.date.year, model.date.month - 1, model.date.day, 0,0,0,0);
      case 'time':
        return new Date(0,0,0, model.time.hours, model.time.minutes, model.time.seconds, 0);
    }
  }

  toModel(date: Date): DatePickerModel {
    return new DatePickerModel(
      new DateModel(date.getDate(), date.getMonth() + 1, date.getFullYear()),
      new TimeModel(date.getHours(), date.getMinutes(), date.getSeconds())
    )
  }
}
