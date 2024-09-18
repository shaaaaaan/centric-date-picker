import {DateModel} from "./DateModel";
import {TimeModel} from "./TimeModel";

export class DatePickerModel {
  date: DateModel;
  time: TimeModel;
  constructor(date: DateModel, time: TimeModel) {
    this.date = date;
    this.time = time;
  }
}
