import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyword'
})
export class KeywordPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
