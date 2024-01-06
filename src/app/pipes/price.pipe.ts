import { Pipe, PipeTransform } from '@angular/core';
import { Wycieczka } from '../structures/wycieczka.model';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(tours: Wycieczka[], minInclusive: number | null, maxInclusive: number | null): Wycieczka[] {
    if(!tours)
      return [];
    if(minInclusive == null || maxInclusive == null){
      console.log("null!");
      return tours;
    }
    return tours.filter(tour => {
        return tour.CenaJednostkowa >= minInclusive && tour.CenaJednostkowa <= maxInclusive;                                                                    
        });
  }

}
