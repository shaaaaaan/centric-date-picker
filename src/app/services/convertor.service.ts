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

  toDate(model: DatePickerModel): Date {
    return new Date(model.date.year, model.date.month - 1, model.date.day, model.time.hours, model.time.minutes, model.time.seconds);
  }

  toModel(date: Date): DatePickerModel {
    return new DatePickerModel(
      new DateModel(date.getDate(), date.getMonth() + 1, date.getFullYear()),
      new TimeModel(date.getHours(), date.getMinutes(), date.getSeconds())
    )
  }
}
