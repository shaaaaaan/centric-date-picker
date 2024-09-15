import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NumberInputOptionsModel} from "../../models/NumberInputOptionsModel";

@Component({
  selector: 'app-number-input',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.css'
})
export class NumberInputComponent {
  @Input() options: NumberInputOptionsModel | undefined;
  @Output() dataChange = new EventEmitter<number>();
  @Output() gotFocus = new EventEmitter<void>();
  @Output() focusPrev = new EventEmitter<void>();
  @Output() focusNext = new EventEmitter<void>();
  @ViewChild('domElement', {static: true}) domElement: ElementRef | undefined;
  // VARIABLES
  digitsEnteredOnGainingFocus: number = 0;

  _data: number | undefined;

  get data(): number | undefined {
    return this._data;
  }

  @Input() set data(value: number | undefined) {
    this._data = value;
    this.input(value);
  }

  _inputElement: HTMLInputElement | undefined;

  get inputElement(): HTMLInputElement | undefined {
    if (!this._inputElement) {
      this._inputElement = this.domElement?.nativeElement as HTMLInputElement;
    }
    return this._inputElement;
  }

  public focusMe() {
    this.inputElement?.focus();
  }

  input(valueFromSetter?: number) {
    const inputRef = this.inputElement;
    if (inputRef) {
      const inputVal = valueFromSetter ?? parseInt(inputRef.value);
      if (!isNaN(inputVal)) {
        let didPadding: boolean = false;
        if (this.options?.maxLength != null) {
          if (this.options.maxLength === 2) {
            if (inputVal < 10) {
              inputRef.value = '0' + inputVal;
              didPadding = true;
            }
          }
        }
        if (!didPadding) {
          inputRef.value = inputVal.toString();
        }
      }
      if (valueFromSetter == null) {
        console.debug('don\'t emit a change for setter doing a change, which will be a recursive event cycle');
        this.dataChange.emit(inputVal);
      }
    }
  }

  focus($event: FocusEvent) {
    console.debug('focusing on:', $event.target);
    this.digitsEnteredOnGainingFocus = 0;
    this.selectAllText();
    this.gotFocus.emit();
  }

  selectAllText() {
    setTimeout(() => {
      this.inputElement?.select();
    });
  }

  keyDown($event: KeyboardEvent) {
    let allowPassThrough: boolean = false;
    switch ($event.key) {
      case 'ArrowLeft':
        this.focusPrev.emit();
        break;
      case 'ArrowRight':
        this.focusNext.emit();
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        this.selectAllText();
        allowPassThrough = true;
        break;
      case 'Shift':
      case 'Tab':
        allowPassThrough = true;
        break;
      case 'Backspace':
      case 'Delete':
        this.inputElement!.value = '';
        this.digitsEnteredOnGainingFocus = 0;
        break;
    }
    const keyAsNumber = parseInt($event.key);
    if (isFinite(keyAsNumber)) {
      if (this.options) {
        if (this.options.max === 12) {
          if (keyAsNumber > 1) {
            console.debug('skip to next when month entered is > 1');
            setTimeout(() => {
              this.focusNext.emit();
            });
          }
        }

        if (this.options.maxLength != null &&
          this.digitsEnteredOnGainingFocus >= this.options.maxLength) {
          console.debug('we need to ensure if max length is reached we disallow further entry unless backspaced/deleted');
          $event.preventDefault();
          return;
        }
      }

      this.digitsEnteredOnGainingFocus++;
    } else if (allowPassThrough) {
      console.debug('pass through keypress:', $event.key);
    } else {
      // not a digit, neither a key we need to pass through, prevent the input element from reacting to the key (in unexpected ways), but let event propagate
      $event.preventDefault();
      console.debug('ignore keypress for cases we dont handle:', $event.key);
    }
  }

  keyUp() {
    if (this.options) {
      const valueAsNumber = parseInt(this.inputElement?.value ?? '');
      if (isFinite(valueAsNumber)) {
        if (this.options.max != null && valueAsNumber > this.options.max) {
          this.inputElement!.value = this.options.max.toString();
          this.focusNext.emit();
          return;
        } else if (this.options.min != null && valueAsNumber < this.options.min) {
          this.inputElement!.value = this.options.min.toString();
          this.focusNext.emit();
          return;
        }
      }
      if (this.digitsEnteredOnGainingFocus == this.options.maxLength) {
        console.debug('got enough keys, move to next');
        this.focusNext.emit();
      }
    }
  }
}
