import { Pipe, PipeTransform } from '@angular/core';
import { HistoryItem } from '../structures/history-item';

@Pipe({
  name: 'hist'
})
export class HistoryStatePipe implements PipeTransform {

  transform(history: HistoryItem[], state: number | null): HistoryItem[] {
    if (!history)
      return [];
    if (state==null)
      return history;

   return history.filter( histItem => {
      return this.getState(histItem) === state;
   }

   )
  }

  getState(item: HistoryItem){
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    const currentDate = new Date();

    if (currentDate < startDate)
      return 0;
    else if (currentDate > endDate)
      return 2;
    else 
      return 1;
  }

}
