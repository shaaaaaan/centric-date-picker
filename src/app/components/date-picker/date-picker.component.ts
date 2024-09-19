import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PopUpComponent} from "../pop-up/pop-up.component";
import {FormsModule} from "@angular/forms";
import {ConvertorService} from "../../services/convertor.service";
import {DatePickerModel} from "../../models/DatePickerModel";
import {NumberInputComponent} from "../number-input/number-input.component";
import {UnitType} from "../../models/enums/UnitType";
import {DateModel} from "../../models/DateModel";
import {NumberInputOptionsModel} from "../../models/NumberInputOptionsModel";
import {DateUtilsService} from "../../services/date-utils.service";
import dayjs from "dayjs";

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    PopUpComponent,
    FormsModule,
    NumberInputComponent
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent implements OnInit {
  @Input() date: Date;
  @Input() mode: 'date' | 'time' | 'datetime' = 'datetime';
  @Input() showSeconds: boolean;
  @Output() input = new EventEmitter<string>();
  @ViewChild('hours') hours: NumberInputComponent | undefined;
  @ViewChild('minutes') minutes: NumberInputComponent | undefined;
  @ViewChild('seconds') seconds: NumberInputComponent | undefined;

  // VARIABLES
  model: DatePickerModel;
  showCalendar: boolean = false;
  clickedInside: boolean = false;
  protected options: { [unitType: string]: NumberInputOptionsModel } = {};
  protected readonly UnitType = UnitType;
  get hasTime(): boolean {
    return this.mode === 'datetime' || this.mode ==='time';
  }
  get hasDate(): boolean {
    return this.mode === 'datetime' || this.mode ==='date';
  }

  constructor(
    private convertorService: ConvertorService,
    private dateUtilsService: DateUtilsService
  ) {
    this.date = new Date();
    this.model = this.convertorService.toModel(this.date);
    this.showSeconds = true;
    this.options[UnitType.Year] = <NumberInputOptionsModel>{min: 1800, max: 2200, placeholder: 'YYYY', length: 4};
    this.options[UnitType.Month] = <NumberInputOptionsModel>{min: 1, max: 12, placeholder: 'MM', length: 2};
    this.options[UnitType.Date] = <NumberInputOptionsModel>{min: 1, max: 31, placeholder: 'DD', length: 2};
    this.options[UnitType.Hours] = <NumberInputOptionsModel>{min: 0, max: 23, placeholder: 'hh', length: 2};
    this.options[UnitType.Minutes] = <NumberInputOptionsModel>{min: 0, max: 59, placeholder: 'mm', length: 2};
    this.options[UnitType.Seconds] = <NumberInputOptionsModel>{min: 0, max: 59, placeholder: 'ss', length: 2};
    this.modelChanged();
  }

  ngOnInit() {
  }

  @HostListener('click')
  clickIn() {
    this.clickedInside = true;
    this.showCalendar = true;
  }

  @HostListener('document:click')
  clickOut() {
    if (!this.clickedInside) {
      this.showCalendar = false;
    }
    this.clickedInside = false;
  }

  modelChanged() {
    // number input changes(model already bound), update the date
    this.date = this.convertorService.toDate(this.model, 'datetime'); // store datetime information for valid date time object

    // update the max value, to account for month/year changes
    this.options[UnitType.Date].max = this.dateUtilsService.getLastDateOfMonth(this.date).getDate();

    const STRIPED_OUTPUT = this.convertorService.toDate(this.model, this.mode);
    let DESIRED_OUTPUT = '';
    switch (this.mode) {
      case 'datetime': DESIRED_OUTPUT = STRIPED_OUTPUT.toString(); break;
      case 'date': DESIRED_OUTPUT = dayjs(STRIPED_OUTPUT).format('DD-MM-YYYY'); break;
      case 'time': DESIRED_OUTPUT = dayjs(STRIPED_OUTPUT).format('HH:mm:ss'); break;
    }
    this.input.emit(DESIRED_OUTPUT);
    console.log(`${this.mode} changed:`, DESIRED_OUTPUT);
  }

  datePickerChanged(selectedCalendarDate: Date | undefined) {
    // this was fired by the pop-up calendar, update the model's date part & fire model updated
    if (selectedCalendarDate) {
      this.model.date = <DateModel>{
        year: selectedCalendarDate.getFullYear(),
        month: selectedCalendarDate.getMonth() + 1,
        day: selectedCalendarDate.getDate()
      };
      this.modelChanged();
    } else {
      this.date = new Date();
      this.model = this.convertorService.toModel(this.date);
      this.modelChanged();
    }
  }

  numberFocused() {
    this.showCalendar = true;
  }
}
