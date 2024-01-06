import { Pipe, PipeTransform } from '@angular/core';
import { Wycieczka } from '../structures/wycieczka.model';

@Pipe({
  name: 'country'
})
export class CountryPipe implements PipeTransform {

  transform(tours: Wycieczka[], searchCountry: string[] | null): Wycieczka[] {
    if (!tours)
    return [];
    if (!searchCountry || searchCountry.length == 0)
    return tours;
    let retTours : Wycieczka[] = [];
    searchCountry.forEach(country => {
      country = country.toLowerCase();
      let filtered = tours.filter(tour => {
        return tour.Kraj.toLowerCase().includes(country);
      });
      retTours = retTours.concat(filtered);
    });
    return retTours;
    }

}
