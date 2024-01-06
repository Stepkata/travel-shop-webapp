import { Pipe, PipeTransform } from '@angular/core';
import { Wycieczka } from '../structures/wycieczka.model';

@Pipe({
  name: 'rating'
})
export class RatingPipe implements PipeTransform {

  transform(tours: Wycieczka[], rating: number[] | null): Wycieczka[] {
    if (!tours)
     return [];
    if (!rating || rating.length == 0)
     return tours;
    let retTours : Wycieczka[] = [];
      rating.forEach(rate => {
        let filtered = tours.filter(tour => {
          let avg = tour.Rating.reduce( ( p, c ) => p + c, 0 ) / tour.Rating.length; 
          console.log(rate);
          console.log(avg);
          return avg >= rate && avg < rate + 1; 
        });
        retTours = retTours.concat(filtered);
      });
      return retTours;
     } 
}
