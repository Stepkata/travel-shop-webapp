import { Pipe, PipeTransform } from '@angular/core';
import { Wycieczka } from '../structures/wycieczka.model';
import { DataService } from '../services/data.service';

@Pipe({
  name: 'rating'
})
export class RatingPipe implements PipeTransform {

  transform(tours: Wycieczka[], minInclusive: number | null, maxInclusive: number | null): Wycieczka[] {
    if(!tours)
      return [];
    if(minInclusive == null || maxInclusive == null || minInclusive == 0){
      console.log("rating null!");
      return tours;
    }
    return tours.filter(tour => {
      return tour.Ocena >= minInclusive && tour.Ocena <= maxInclusive;                                                                    
      });
    }

}
