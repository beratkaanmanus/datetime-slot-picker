import { r as registerInstance, e as createEvent, h } from './index-3f21ef97.js';

let builtInTranslations = {
  en: {
    Mon: 'Mon',
    Tue: 'Tue',
    Wed: 'Wed',
    Thu: 'Thu',
    Fri: 'Fri',
    Sat: 'Sat',
    Sun: 'Sun',
    AM: 'AM',
    PM: 'PM',
    Jan: 'Jan',
    Feb: 'Feb',
    Mar: 'Mar',
    Apr: 'Apr',
    May: 'May',
    Jun: 'Jun',
    Jul: 'Jul',
    Aug: 'Aug',
    Sep: 'Sep',
    Oct: 'Oct',
    Nov: 'Nov',
    Dec: 'Dec'
  }
};

const monthIndex = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function generateDateGrid(slots) {
  let dateGrids = [];
  //Validate formats and consistency
  //Get min and max date
  //Create grid for each month
  let isInputValid = true;
  let minDate, maxDate;
  for (let slot of slots) {
    if (slot.date && slot.date.substring(5) && slot.date.substring(5).split(' ').length === 3 &&
      monthIndex[slot.date.substring(5).split(' ')[1]] > -1 && parseInt(slot.date.substring(5).split(' ')[2])
      && parseInt(slot.date.substring(5).split(' ')[0])) {
      let parsedDate = new Date(parseInt(slot.date.substring(5).split(' ')[2]), monthIndex[slot.date.substring(5).split(' ')[1]], parseInt(slot.date.substring(5).split(' ')[0]));
      if (!minDate || minDate > parsedDate)
        minDate = parsedDate;
      if (!maxDate || maxDate < parsedDate)
        maxDate = parsedDate;
    }
    else {
      isInputValid = false;
      break;
    }
  }
  if (isInputValid && minDate && maxDate) {
    let { m1, y1 } = { m1: minDate.getMonth(), y1: minDate.getFullYear() };
    let { m2, y2 } = { m2: maxDate.getMonth(), y2: maxDate.getFullYear() };
    do {
      let dateGrid = {
        monthYear: months[m1] + ' ' + y1,
        weeks: []
      };
      //Lets create all days for m1, y1
      let allDays = [];
      let startDate = new Date(y1, m1, -1);
      let lastDate = new Date(y1, m1 + 1, 0);
      for (let frontPadCounter = 0; frontPadCounter <= startDate.getDay(); frontPadCounter++) {
        allDays.push(null);
      }
      for (let dayCounter = 1; dayCounter <= lastDate.getDate(); dayCounter++) {
        let currentDate = new Date(y1, m1, dayCounter);
        let dateText = days[currentDate.getDay()] + ', ' + dayCounter + ' ' + months[m1] + ' ' + y1;
        let slot = slots.find(s => s.date === dateText);
        allDays.push({
          dayOfMonth: dayCounter,
          isEnabled: slot ? true : false,
          dateText: dateText
        });
        console.log('currentDate', currentDate);
        console.log('dateText', currentDate);
        console.log('currentDate', currentDate);
      }
      for (let backPadCounter = allDays.length + 1; backPadCounter <= 42; backPadCounter++) {
        allDays.push(null);
      }
      for (let weekCounter = 1; weekCounter <= 6; weekCounter++) {
        let week = { days: [] };
        for (let weekdayCounter = 1; weekdayCounter <= 7; weekdayCounter++) {
          week.days.push(allDays.shift());
        }
        dateGrid.weeks.push(week);
      }
      dateGrids.push(dateGrid);
      if (m1 === 11) {
        m1 = 0;
        y1++;
      }
      else {
        m1++;
      }
    } while (m1 !== m2 || y1 !== y2);
  }
  return dateGrids;
}

function generateTimeGrid(slot, datesHiddenWhenTimesShown) {
  let timeGrids = [];
  let times = slot.timeSlots.filter(ts => {
    let isValid = true;
    if (!ts)
      isValid = false;
    //TODO Check if time format is like 9 AM / 9:00 AM / 10 AM - 11 AM / 10:00 AM - 11:00 AM
    return isValid;
  });
  //Determine number of columns
  //Determine number of grids
  if (times.length) {
    let noOfRows = datesHiddenWhenTimesShown ? 7 : 4;
    let noOfColumns = times[0].length <= 8 ? 4 : 2;
    let noOfCells = noOfColumns * noOfRows;
    let noOfGrids = Math.ceil(times.length / noOfCells);
    if (datesHiddenWhenTimesShown && noOfGrids > 1) {
      noOfRows = Math.ceil(times.length / noOfColumns);
      noOfGrids = 1;
    }
    for (let gridCounter = 1; gridCounter <= noOfGrids; gridCounter++) {
      let timeGrid = {
        dateText: slot.date.substring(5),
        rows: []
      };
      for (let rowCounter = 1; rowCounter <= noOfRows; rowCounter++) {
        let row = { times: [] };
        for (let columnCounter = 1; columnCounter <= noOfColumns; columnCounter++) {
          let time = times.shift();
          row.times.push(time ? { timeText: time } : null);
        }
        timeGrid.rows.push(row);
      }
      timeGrids.push(timeGrid);
    }
  }
  return timeGrids;
}

const datetimeSlotPickerCss = ":host{display:block !important}.neo-slot-picker{position:relative !important}.neo-popup{position:absolute !important;z-index:999 !important;background-color:white !important;padding:2px !important;margin:3px 0px !important;box-shadow:0 0 10px lightgray !important;border:1px solid whitesmoke !important}.neo-scroll{max-height:200px !important;overflow-y:overlay !important}.neo-scroll::-webkit-scrollbar{-webkit-appearance:none}.neo-scroll::-webkit-scrollbar:vertical{width:12px}.neo-scroll::-webkit-scrollbar:horizontal{height:12px}.neo-scroll::-webkit-scrollbar-thumb{border-radius:5px;border:3px solid white;background-color:rgba(0, 0, 0, .5)}.neo-scroll::-webkit-scrollbar-track{border-radius:10px;background-color:#ffffff}.neo-input{min-width:275px !important;cursor:pointer !important}.neo-paginate,.neo-close,.neo-back{padding:2px 10px !important;cursor:pointer !important;font-size:medium !important}.neo-paginate-disabled{color:lightgrey !important}.neo-table{table-layout:fixed !important;width:100% !important;margin-bottom:0px !important}.neo-tr.neo-equal-width>*:nth-last-child(2)~*{width:50% !important}.neo-tr.neo-equal-width>*:nth-last-child(3)~*{width:33.3% !important}.neo-tr.neo-equal-width>*:nth-last-child(4)~*{width:25% !important}.neo-tr.neo-equal-width>*:nth-last-child(5)~*{width:20% !important}.neo-tr.neo-equal-width>*:nth-last-child(6)~*{width:16.7% !important}.neo-tr.neo-equal-width>*:nth-last-child(7)~*{width:14.3% !important}.neo-th,.neo-td{border:1px solid whitesmoke !important;border-collapse:collapse !important}.neo-table{border:1.5px solid whitesmoke !important;border-collapse:collapse !important}.neo-th,.neo-td{padding:3px !important;text-align:center !important;overflow:hidden !important}.neo-right-end{text-align:right !important;width:15% !important}.neo-left-end{text-align:left !important;width:15% !important}.neo-grid{font-size:small !important;min-width:275px !important}.neo-day,.neo-time{padding:2px !important}.neo-cell-enabled{color:black !important}.neo-grid .neo-tr{height:1.75rem !important}@media only screen and (min-width: 768px){.neo-cell-enabled:hover{color:white !important;background-color:black !important}}.neo-cell-selected{color:white !important;background-color:black !important}.neo-day-enabled,.neo-day-selected,.neo-time-enabled,.neo-time-selected{cursor:pointer !important}.neo-day-disabled{color:lightgray !important;cursor:not-allowed !important}.neo-center{border-right:0px !important;border-left:0px !important}.neo-left-end{border-right:0px !important}.neo-right-end{border-left:0px !important}.neo-empty-grid .neo-th,.neo-empty-grid .neo-td{border:1px solid white !important}.neo-no-slots-text{color:gray !important}";

const DatetimeSlotPicker = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.slotUpdate = createEvent(this, "slotUpdate", 7);
    this.placeholder = 'Pick a slot';
    this.timeSlotsText = 'Time Slot';
    this.noSlotsText = 'No slots are available';
    this.dateFormat = 'ddd, D MMM YYYY';
    this.timeFormat = 'h:mm A';
    this.slots = [];
    this.language = 'en';
    this.translations = builtInTranslations;
    this.datesHiddenWhenTimesShown = false;
  }
  handleClearSlot(event) {
    console.log('Clear event', event);
    this.resetSlot();
  }
  handleOnClick(event) {
    let isInsideCalendar = (event && event.target && event.target.className && typeof (event.target.className) === 'string' && event.target.className.includes('neo-')) ? true : false;
    if (!isInsideCalendar)
      this.closeGrid();
  }
  componentWillLoad() {
    this.processSlots(this.slots);
  }
  processSlots(slots) {
    if (this.slots) {
      //Reset the state
      this.isTimeSlotGridVisible = false;
      this.selectedDate = undefined;
      this.selectedTime = undefined;
      this.displayText = undefined;
      this.dateGrids = generateDateGrid(slots);
      if (this.dateGrids && this.dateGrids.length)
        this.activeDateGridPage = 0;
    }
  }
  togglePopup() {
    if (this.slots) {
      if (this.neoInput.getBoundingClientRect().top < window.innerHeight / 2)
        this.isNeoInputAboveFold = true;
      else
        this.isNeoInputAboveFold = false;
      if (this.neoInput.getBoundingClientRect().left < window.innerWidth / 2)
        this.isNeoInputLeftSide = true;
      else
        this.isNeoInputLeftSide = false;
      this.neoInputHeight = this.neoInput.getBoundingClientRect().bottom - this.neoInput.getBoundingClientRect().top;
      this.isPopped = !this.isPopped;
      this.isTimeSlotGridVisible = false;
    }
  }
  setSelectedDate(dateText) {
    if (dateText) {
      this.selectedDate = dateText;
      if (this.slots.length && this.slots[0].timeSlots) {
        //resetSlot until time is also chosen
        if (this.displayText)
          this.resetSlot();
        let slot = this.slots.find(s => s.date === this.selectedDate);
        this.timeGrids = generateTimeGrid(slot, this.datesHiddenWhenTimesShown);
        this.selectedTime = undefined;
        if (this.timeGrids && this.timeGrids.length)
          this.activeTimeGridPage = 0;
        this.isTimeSlotGridVisible = true;
      }
      else
        this.setSlot();
    }
  }
  setSelectedTime(timeText) {
    if (timeText) {
      this.selectedTime = timeText;
      this.setSlot();
    }
  }
  setSlot() {
    let translatedSelectedDate, translatedSelectedTime;
    if (this.dateFormat === 'MM-DD-YYYY') {
      let formattedDate = new Date(this.selectedDate);
      translatedSelectedDate = `${(formattedDate.getMonth() + 1)}-${formattedDate.getDate()}-${formattedDate.getFullYear()}`;
    }
    else { //ddd, D MMM YYYY
      let selectedDateParts = this.selectedDate.split(' ');
      translatedSelectedDate = this.getTranslation(selectedDateParts[0].substring(0, selectedDateParts[0].length - 1)) + ', ' +
        selectedDateParts[1] + ' ' + this.getTranslation(selectedDateParts[2]) + ' ' + selectedDateParts[3];
    }
    if (this.selectedTime) {
      translatedSelectedTime = this.formatTimeSlot(this.selectedTime);
      translatedSelectedTime = translatedSelectedTime.replace(/AM/g, this.getTranslation('AM'));
      translatedSelectedTime = translatedSelectedTime.replace(/PM/g, this.getTranslation('PM'));
    }
    this.displayText = translatedSelectedDate + (this.selectedTime ? (', ' + translatedSelectedTime) : '');
    this.slotUpdate.emit({
      date: this.selectedDate,
      timeSlot: this.selectedTime,
      translatedDate: translatedSelectedDate,
      translatedTimeSlot: translatedSelectedTime
    });
    this.isPopped = false;
    this.isTimeSlotGridVisible = false;
  }
  resetSlot() {
    this.displayText = undefined;
    this.slotUpdate.emit({
      date: null,
      timeSlot: null,
      translatedDate: null,
      translatedTimeSlot: null
    });
  }
  closeGrid() {
    this.isPopped = false;
    this.isTimeSlotGridVisible = false;
    if (!this.displayText) {
      this.selectedDate = undefined;
      this.selectedTime = undefined;
    }
  }
  goBack() {
    this.isTimeSlotGridVisible = false;
  }
  prevDateGrid() {
    if (this.activeDateGridPage > 0)
      this.activeDateGridPage--;
  }
  nextDateGrid() {
    if (this.activeDateGridPage < this.dateGrids.length - 1)
      this.activeDateGridPage++;
  }
  prevTimeGrid() {
    if (this.activeTimeGridPage > 0)
      this.activeTimeGridPage--;
  }
  nextTimeGrid() {
    if (this.activeTimeGridPage < this.timeGrids.length - 1)
      this.activeTimeGridPage++;
  }
  getTranslation(propertyName) {
    if (this.translations[this.language])
      return this.translations[this.language][propertyName];
    else
      return builtInTranslations['en'][propertyName]; //use default
  }
  formatTimeSlot(timeText) {
    //Util function - starts
    let changeToHhmm = (timeTextPart) => {
      let justTimePart = timeTextPart.replace(/ AM/g, '');
      justTimePart = justTimePart.replace(/ PM/g, '');
      if (timeTextPart.indexOf('AM') > -1) {
        let hourPart = justTimePart.split(':')[0].trim();
        if (hourPart.length === 1)
          hourPart = '0' + hourPart;
        if (hourPart.indexOf('12') === 0)
          hourPart = '00';
        return hourPart + ':' + (justTimePart.split(':')[1] ? justTimePart.split(':')[1].trim() : '00');
      }
      else if (timeTextPart.indexOf('PM') > -1) {
        let hourPart = justTimePart.split(':')[0].trim();
        if (hourPart.indexOf('12') !== 0)
          hourPart = (parseInt(hourPart) + 12).toString();
        return hourPart + ':' + (justTimePart.split(':')[1] ? justTimePart.split(':')[1].trim() : '00');
      }
    };
    //Util function - ends
    let formattedTimeText = timeText;
    if (this.timeFormat === 'HH:mm') {
      if (timeText.indexOf('-') > -1) {
        let timeTextParts;
        timeTextParts = timeText.split('-');
        timeTextParts = timeTextParts.map(timeTextPart => changeToHhmm(timeTextPart));
        formattedTimeText = timeTextParts[0] + ' - ' + timeTextParts[1];
      }
      else {
        formattedTimeText = changeToHhmm(timeText);
      }
    }
    return formattedTimeText;
  }
  render() {
    let popupStyle = {
      bottom: !this.isNeoInputAboveFold ? this.neoInputHeight + 'px' : undefined,
      left: this.isNeoInputLeftSide ? '0px' : undefined,
      right: !this.isNeoInputLeftSide ? '0px' : undefined
    };
    let activeMonthYear;
    if (this.dateGrids && this.dateGrids.length > 0)
      activeMonthYear = this.dateGrids[this.activeDateGridPage].monthYear.split(' ');
    return h("span", { class: "neo-slot-picker" }, h("input", { class: "neo-input", type: "text", readonly: true, placeholder: this.placeholder, value: this.displayText, onClick: () => this.togglePopup(), ref: (el) => this.neoInput = el }), this.isPopped &&
      h("div", { style: popupStyle, class: (this.isNeoInputAboveFold ? 'neo-popup neo-popup-below' : 'neo-popup neo-popup-above') }, (!this.isTimeSlotGridVisible || !this.datesHiddenWhenTimesShown) && this.dateGrids && this.dateGrids.length > 0 &&
        h("table", { class: "neo-table neo-grid neo-date-grid" }, h("tr", { class: "neo-tr" }, h("th", { class: "neo-th neo-left-end" }), h("th", { colSpan: 5, class: "neo-th neo-center" }, h("span", { class: this.activeDateGridPage > 0 ? 'neo-paginate' : 'neo-paginate neo-paginate-disabled', onClick: () => {
            if (this.activeDateGridPage > 0)
              this.prevDateGrid();
          } }, "<"), this.getTranslation(activeMonthYear[0]) + ' ' + activeMonthYear[1], h("span", { class: (this.activeDateGridPage < (this.dateGrids.length - 1)) ? 'neo-paginate' : 'neo-paginate neo-paginate-disabled', onClick: () => {
            if (this.activeDateGridPage < (this.dateGrids.length - 1))
              this.nextDateGrid();
          } }, ">")), h("th", { class: "neo-th neo-right-end" }, h("span", { class: "neo-close", onClick: () => this.closeGrid() }, "\u00D7"))), h("tr", { class: "neo-tr neo-equal-width" }, h("td", { class: "neo-td" }, this.getTranslation('Mon')), h("td", { class: "neo-td" }, this.getTranslation('Tue')), h("td", { class: "neo-td" }, this.getTranslation('Wed')), h("td", { class: "neo-td" }, this.getTranslation('Thu')), h("td", { class: "neo-td" }, this.getTranslation('Fri')), h("td", { class: "neo-td" }, this.getTranslation('Sat')), h("td", { class: "neo-td" }, this.getTranslation('Sun'))), this.dateGrids[this.activeDateGridPage].weeks.map(week => {
          return h("tr", { class: "neo-tr neo-equal-width" }, week.days.map(day => {
            return day
              ? h("td", { class: !day.isEnabled ? 'neo-td neo-cell neo-cell-disabled' : (day.dateText == this.selectedDate ? 'neo-td neo-cell neo-cell-selected' : 'neo-td neo-cell neo-cell-enabled'), onClick: () => this.setSelectedDate(day.isEnabled ? day.dateText : undefined) }, h("span", { class: !day.isEnabled ? 'neo-day neo-day-disabled' : (day.dateText == this.selectedDate ? 'neo-day neo-day-selected' : 'neo-day neo-day-enabled') }, day.dayOfMonth))
              : h("td", { class: 'neo-td' }, "\u00A0");
          }));
        })), (!this.isTimeSlotGridVisible || !this.datesHiddenWhenTimesShown) && this.dateGrids && !this.dateGrids.length &&
        h("table", { class: "neo-table neo-grid neo-empty-grid" }, h("tr", { class: "neo-tr" }, h("th", { class: "neo-th neo-left-end" }), h("th", { colSpan: 5, class: "neo-th neo-center" }, "\u00A0"), h("th", { class: "neo-th neo-right-end" }, h("span", { class: "neo-close", onClick: () => this.closeGrid() }, "\u00D7"))), h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0")), h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0")), h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td neo-no-slots-text" }, this.noSlotsText)), h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0")), h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0")), h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0")), h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0"))), (this.isTimeSlotGridVisible || (!this.datesHiddenWhenTimesShown && this.selectedDate)) && this.timeGrids && this.timeGrids.length > 0 &&
        h("div", null, this.datesHiddenWhenTimesShown &&
          h("table", { class: "neo-table neo-grid neo-time-grid" }, h("tr", { class: "neo-tr" }, h("th", { class: "neo-th neo-left-end" }, h("span", { class: "neo-back", onClick: () => this.goBack() }, "\u2190")), h("th", { class: "neo-th neo-center", colSpan: 6 }, this.timeSlotsText), h("th", { class: "neo-th neo-right-end" }, h("span", { class: "neo-close", onClick: () => this.closeGrid() }, "\u00D7")))), h("div", { class: (this.datesHiddenWhenTimesShown && this.isTimeSlotGridVisible ? ' neo-scroll' : '') }, h("table", { class: "neo-table neo-grid neo-time-grid" }, this.timeGrids[this.activeTimeGridPage].rows.map(row => {
          return h("tr", { class: "neo-tr neo-equal-width" }, row.times.map(time => {
            let translatedTimeText;
            if (time) {
              translatedTimeText = this.formatTimeSlot(time.timeText);
              translatedTimeText = translatedTimeText.replace(/AM/g, this.getTranslation('AM'));
              translatedTimeText = translatedTimeText.replace(/PM/g, this.getTranslation('PM'));
            }
            return time
              ? h("td", { colSpan: row.times.length === 2 ? 4 : 2, class: time.timeText == this.selectedTime ? 'neo-td neo-cell neo-cell-selected' : 'neo-td neo-cell neo-cell-enabled', onClick: () => this.setSelectedTime(time.timeText) }, h("span", { class: time.timeText == this.selectedTime ? 'neo-time neo-time-selected' : 'neo-time neo-time-enabled' }, translatedTimeText))
              : h("td", { colSpan: row.times.length === 2 ? 4 : 2, class: "neo-td" }, "\u00A0");
          }));
        }))), !this.datesHiddenWhenTimesShown && this.timeGrids && this.timeGrids.length > 0 &&
          h("table", { class: "neo-table neo-grid neo-time-grid" }, h("tr", { class: "neo-tr" }, h("th", { class: "neo-th neo-left-end" }, h("span", null, "\u00A0")), h("th", { class: "neo-th neo-center", colSpan: 6 }, h("span", { class: this.activeTimeGridPage > 0 ? 'neo-paginate' : 'neo-paginate neo-paginate-disabled', onClick: () => {
              if (this.activeTimeGridPage > 0)
                this.prevTimeGrid();
            } }, "<"), this.timeSlotsText, h("span", { class: (this.activeTimeGridPage < (this.timeGrids.length - 1)) ? 'neo-paginate' : 'neo-paginate neo-paginate-disabled', onClick: () => {
              if (this.activeTimeGridPage < (this.timeGrids.length - 1))
                this.nextTimeGrid();
            } }, ">")), h("th", { class: "neo-th neo-right-end" }, h("span", null, "\u00A0"))))), (this.isTimeSlotGridVisible || (!this.datesHiddenWhenTimesShown && this.selectedDate)) && this.timeGrids && !this.timeGrids.length &&
        h("table", { class: "neo-table neo-grid neo-empty-grid" }, h("tr", { class: "neo-tr" }, h("th", { class: "neo-th neo-left-end" }, this.datesHiddenWhenTimesShown
          ? h("span", { class: "neo-back", onClick: () => this.goBack() }, "\u2190")
          : h("span", null, "\u00A0")), h("th", { colSpan: 5, class: "neo-th neo-center" }, "\u00A0"), h("th", { class: "neo-th neo-right-end" }, this.datesHiddenWhenTimesShown
          ? h("span", { class: "neo-close", onClick: () => this.closeGrid() }, "\u00D7")
          : h("span", null, "\u00A0"))), this.datesHiddenWhenTimesShown &&
          h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0")), h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0")), h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td neo-no-slots-text" }, this.noSlotsText)), h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0")), h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0")), this.datesHiddenWhenTimesShown &&
          h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0")), this.datesHiddenWhenTimesShown &&
          h("tr", { class: "neo-tr" }, h("td", { colSpan: 7, class: "neo-td" }, "\u00A0")))));
  }
  static get watchers() { return {
    "slots": ["processSlots"]
  }; }
};
DatetimeSlotPicker.style = datetimeSlotPickerCss;

export { DatetimeSlotPicker as datetime_slot_picker };
