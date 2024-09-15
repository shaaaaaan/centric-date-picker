import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {DateUtilsService} from "../../services/date-utils.service";
import {CalendarData} from "../../models/CalendarData";

@Component({
  selector: 'app-pop-up',
  standalone: true,
  imports: [],
  templateUrl: './pop-up.component.html',
  styleUrl: './pop-up.component.css'
})
export class PopUpComponent implements OnInit, OnChanges {
  @Input() date: Date | undefined;
  @Input() show: boolean = false;
  @Output() datePickerChange = new EventEmitter<Date | undefined>();
  @Output() showChange = new EventEmitter<boolean>();
  monthTitle: string | undefined;
  calendar: CalendarData[] | undefined;

  constructor(private dateUtilsService: DateUtilsService) {
  }

  ngOnInit() {
    if (!this.date) {
      this.date = new Date();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['date']) {
      this.renderCalendar(changes['date'].currentValue as Date);
    }
  }

  renderCalendar(date: Date) {
    this.monthTitle = this.dateUtilsService.getMonthTitle(date);
    this.calendar = this.dateUtilsService.generateCalendar(date);
  }

  prevMonth(): void {
    if (this.date) {
      this.datePickerChange.emit(this.dateUtilsService.firstDayOfPrevMonth(this.date));
    }
  }

  nextMonth(): void {
    if (this.date) {
      this.datePickerChange.emit(this.dateUtilsService.firstDayOfNextMonth(this.date));
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
