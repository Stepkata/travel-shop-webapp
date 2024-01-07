import { Pipe, PipeTransform } from '@angular/core';
import { Wycieczka } from '../structures/wycieczka.model';

@Pipe({
  name: 'slicePages'
})
export class SlicePagesPipe implements PipeTransform {

  transform(tours: Wycieczka[], n1: number, n2: number): Wycieczka[] {
    if(!tours)
      return [];
    const length = tours.length;

      if (n1 === null || n1 < 0) {
        n1 = 0;
      }
  
      if (n2 === null || n2 > length) {
        n2 = length;
      }
  
      if (n1 > length || n1 > n2) {
        return [];
      }
  
      return tours.slice(n1, n2);
  }

}
