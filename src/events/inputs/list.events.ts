export class ListEvents {
    when?: WhenEventFilter = WhenEventFilter.All;
    page: number = 1;
    limit: number = 2;
  }
  
  export enum WhenEventFilter {
    All = 1,
    Today,
    Tommorow,
    ThisWeek,
    NextWeek
  }