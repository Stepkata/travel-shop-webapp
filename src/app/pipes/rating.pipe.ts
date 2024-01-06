import { Pipe, PipeTransform } from '@angular/core';
import { Wycieczka } from '../structures/wycieczka.model';

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
      let avg = this.getAverage(tour.Rating);
      return avg >= minInclusive && avg <= maxInclusive;                                                                    
      });
    }

  getAverage(rate: number[]){
    let sum = 0;
    for (const n of rate){
      sum += n;
    }
    return sum/rate.length;
  }
}
