import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateUtilsService} from "../../services/date-utils.service";
import {CalendarData} from "../../models/CalendarData";

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.css'
})
export class PopUpComponent implements OnInit {
  @Input() show: boolean = false;
  @Output() datePickerChange = new EventEmitter<Date | undefined>();
  @Output() showChange = new EventEmitter<boolean>();
  monthTitle: string | undefined;
  calendar: CalendarData[] | undefined;
  _date: Date | undefined;
  @Input() get date(): Date | undefined {
    return this._date;
  }
  set date(value: Date | undefined) {
    if (value) {
      const newDate = this.dateUtilsService.getDateOnly(value);
      this._date = newDate;
      this.renderCalendar(newDate);
    }
  }

  constructor(private dateUtilsService: DateUtilsService) {}

  ngOnInit() {
    if (!this.date) {
      this.date = new Date();
    }
  }

  renderCalendar(date: Date) {
    this.monthTitle = this.dateUtilsService.getMonthTitle(date);
    this.calendar = this.dateUtilsService.generateCalendar(date);
  }

  prevMonth(): void {
    if (this.date) {
      this.date = this.dateUtilsService.reduceMonth(this.date)
      this.datePickerChange.emit(this.date);
    }
  }

  nextMonth(): void {
    if (this.date) {
      this.date = this.dateUtilsService.increaseMonth(this.date)
      this.datePickerChange.emit(this.date);
    }
  }

  today(): void {
    if (this.date) {
      this.datePickerChange.emit(this.dateUtilsService.today());
    }
  }

  clear(): void {
    this.datePickerChange.emit(undefined);
  }

  onDateClick(date?: Date): void {
    this.show = false;
    this.datePickerChange.emit(date);
  }
}
