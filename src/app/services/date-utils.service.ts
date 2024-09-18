import {Injectable} from '@angular/core';
import {CalendarData} from "../models/CalendarData";

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  constructor() {
  }

  getFirstDateOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
  }

  getLastDateOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0, 0);
  }

  /**
   Pass as input getDay function called on a Date object.
   <br>
   Returns: 0 - Monday, 1 - Tuesday ...
   **/
  getWorkDay(standardDay: number): number {
    switch (standardDay) {
      case 0:
        return 6; // Sunday
      default:
        return standardDay - 1;
      // case 1: return 0; // Monday
      // case 2: return 1; // Tuesday
      // case 3: return 2; // Wednesday
      // case 4: return 3; // Thursday
      // case 5: return 4; // Friday
      // case 6: return 5; // Saturday
    }
  }

  daysToMilliseconds(days: number): number {
    return days * 24 * 60 * 60 * 1000;
  }

  getMonthTitle(date: Date): string {
    return date.toLocaleString('default', {month: 'long'});
  }

  getDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  generateCalendar(date: Date): CalendarData[] {
    const calendar = [];
    const DAYS_IN_WEEK: number = 7;
    const FIRST_DATE_OF_MONTH: Date = this.getFirstDateOfMonth(date);
    const FIRST_DAY_OF_MONTH = this.getWorkDay(FIRST_DATE_OF_MONTH.getDay());
    const START_DATE_OF_CALENDAR = new Date(FIRST_DATE_OF_MONTH.getTime() - this.daysToMilliseconds(FIRST_DAY_OF_MONTH));

    const LAST_DATE_OF_MONTH: Date = this.getLastDateOfMonth(date);
    const LAST_DAY_OF_MONTH = this.getWorkDay(LAST_DATE_OF_MONTH.getDay());
    const LAST_DATE_OF_CALENDAR = new Date(LAST_DATE_OF_MONTH.getTime() + this.daysToMilliseconds(DAYS_IN_WEEK - LAST_DAY_OF_MONTH));

    const MAIN_MONTH = date.getMonth();
    const ORIGIN_DATE_WITHOUT_TIME = this.getDateOnly(date);
    console.debug('ORIGIN_DATE_WITHOUT_TIME', ORIGIN_DATE_WITHOUT_TIME);
    for (let currentDate = START_DATE_OF_CALENDAR;
         currentDate.getTime() < LAST_DATE_OF_CALENDAR.getTime();
         currentDate = this.getNextDate(currentDate)) {

      const isMainMonth = currentDate.getMonth() === MAIN_MONTH;
      const isOriginDate = currentDate.getTime() === ORIGIN_DATE_WITHOUT_TIME.getTime();
      console.debug('processed date', currentDate);
      calendar.push(<CalendarData>{date: currentDate, isMainMonth, isOriginDate});
    }

    return calendar;
  }

  firstDayOfPrevMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() - 1, 1, 0, 0, 0, 0);
  }

  firstDayOfNextMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0, 0);
  }

  today(): Date {
    const todayWithTime = new Date();
    return new Date(todayWithTime.getFullYear(), todayWithTime.getMonth(), todayWithTime.getDate(), 0, 0, 0, 0);
  }

  getNextDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, 0, 0, 0, 0);
  }
}
