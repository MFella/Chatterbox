import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toAgoTime'
})
export class ToAgoTimePipe implements PipeTransform {

  transform(value: Date): string {
    
    return value.toString().split('T')[1].split('Z')[0].split('.')[0];
  }

}
