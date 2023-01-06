export interface TimeGrid {
  dateText: string;
  rows: TimeRow[];
}
export interface TimeRow {
  times: Time[];
}
export interface Time {
  timeText: string;
}
