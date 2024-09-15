import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PopUpComponent} from "../pop-up/pop-up.component";
import {FormsModule} from "@angular/forms";
import {ConvertorService} from "../../services/convertor.service";
import {DatePickerModel} from "../../models/DatePickerModel";
import {NumberInputComponent} from "../number-input/number-input.component";
import {UnitType} from "../../models/enums/UnitType";
import {DateModel} from "../../models/DateModel";
import {NumberInputOptionsModel} from "../../models/NumberInputOptionsModel";

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
  @Input() format: UnitType[];
  @Output() changed = new EventEmitter<Date>();
  @ViewChild('hours') hours: HTMLInputElement | undefined;
  @ViewChild('minutes') minutes: HTMLInputElement | undefined;
  @ViewChild('seconds') seconds: HTMLInputElement | undefined;
  // VARIABLES
  model: DatePickerModel;
  showCalendar: boolean = false;
  clickedInside: boolean = false;
  public options: { [unitType: string]: NumberInputOptionsModel } = {};
  public modelReferences: { [unitType: string]: number } = {};
  protected readonly UnitType = UnitType;

  constructor(private convertorService: ConvertorService) {
    this.date = new Date();
    this.model = this.convertorService.toModel(this.date);
    this.format = [UnitType.Date, UnitType.Month, UnitType.Year, UnitType.Hours, UnitType.Minutes, UnitType.Seconds];
    this.options[UnitType.Year] = <NumberInputOptionsModel>{min: 0, max: 2200, placeholder: 'yyyy', maxLength: 4};
    this.options[UnitType.Month] = <NumberInputOptionsModel>{min: 1, max: 12, placeholder: 'mm', maxLength: 2};
    this.options[UnitType.Date] = <NumberInputOptionsModel>{min: 1, max: 31, placeholder: 'dd', maxLength: 2};
    this.options[UnitType.Hours] = <NumberInputOptionsModel>{min: 0, max: 23, placeholder: 'hh', maxLength: 2};
    this.options[UnitType.Minutes] = <NumberInputOptionsModel>{min: 0, max: 59, placeholder: 'mm', maxLength: 2};
    this.options[UnitType.Seconds] = <NumberInputOptionsModel>{min: 0, max: 59, placeholder: 'ss', maxLength: 2};
    this.modelReferences[UnitType.Date] = this.model.date.day;
    this.modelReferences[UnitType.Month] = this.model.date.month;
    this.modelReferences[UnitType.Year] = this.model.date.year;
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
    this.date = this.convertorService.toDate(this.model);
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
