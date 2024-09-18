import {Injectable} from '@angular/core';
import {CalendarData} from "../models/CalendarData";
import dayjs from "dayjs";

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {

  constructor() {
  }

  /**
   Pass as input getDay function called on a Date object.
   <br>
   Returns: 0 - Monday, 1 - Tuesday ...
   **/
  getDayOfWeek(standardDay: number): number {
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

  getMonthTitle(date: Date): string {
    return date.toLocaleString('default', {month: 'long'});
  }

  getFirstDateOfMonth(date: Date): Date {
    return dayjs(date).date(1).toDate();
  }

  getLastDateOfMonth(date: Date): Date {
    return dayjs(date).endOf("month").startOf('day').toDate();
  }

  getDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  }

  reduceMonth(date: Date): Date {
    if (dayjs(date).endOf('month').date() === date.getDate()) {
      console.debug('is last day of month, when going back 1 month, go to last day');
      return dayjs(date).startOf('month').subtract(1, 'month').endOf('month').toDate();
    } else {
      return dayjs(date).subtract(1, 'month').toDate();
    }
  }

  increaseMonth(date: Date): Date {
    if (dayjs(date).endOf('month').date() === date.getDate()) {
      console.debug('is last day of month, when moving forward 1 month, go to last day');
      return dayjs(date).startOf('month').add(1, 'month').endOf('month').toDate();
    } else {
      return dayjs(date).add(1, 'month').toDate();
    }
  }

  today(): Date {
    const todayWithTime = new Date();
    return new Date(todayWithTime.getFullYear(), todayWithTime.getMonth(), todayWithTime.getDate(), 0, 0, 0, 0);
  }

  generateCalendar(date: Date): CalendarData[] {
    const calendar = [];
    const DAYS_IN_WEEK: number = 7;
    const FIRST_DATE_OF_MONTH: Date = this.getFirstDateOfMonth(date);
    const DAY_IDX_OF_FIRST_WEEK = this.getDayOfWeek(FIRST_DATE_OF_MONTH.getDay());
    const START_DATE_OF_CALENDAR = dayjs(FIRST_DATE_OF_MONTH).subtract(DAY_IDX_OF_FIRST_WEEK, 'day');

    const LAST_DATE_OF_MONTH: Date = this.getLastDateOfMonth(date);
    const DAY_IDX_OF_LAST_WEEK = this.getDayOfWeek(LAST_DATE_OF_MONTH.getDay());
    const LAST_DATE_OF_CALENDAR = dayjs(LAST_DATE_OF_MONTH).add((DAYS_IN_WEEK - DAY_IDX_OF_LAST_WEEK), 'day');

    const MAIN_MONTH = date.getMonth();
    const ORIGIN_DATE_WITHOUT_TIME = this.getDateOnly(date);

    for (let currentDate = START_DATE_OF_CALENDAR;
         currentDate.isBefore(LAST_DATE_OF_CALENDAR);
         currentDate = currentDate.add(1, 'day')) {

      const isMainMonth = currentDate.month() === MAIN_MONTH;
      const isOriginDate = currentDate.isSame(ORIGIN_DATE_WITHOUT_TIME);
      calendar.push(<CalendarData>{date: currentDate.toDate(), isMainMonth, isOriginDate});
    }

    return calendar;
  }
}
