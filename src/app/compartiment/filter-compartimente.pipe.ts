import { Pipe, PipeTransform } from '@angular/core';
import { Compartiment } from '../../compartiment.model';

@Pipe({
  name: 'filterCompartimente',
  standalone: true
})
export class FilterCompartimentePipe implements PipeTransform {
  transform(compartimente: Compartiment[], searchText: string): Compartiment[] {
    if (!compartimente || !searchText) return compartimente;

    const lower = searchText.toLowerCase();
    return compartimente.filter(c =>
      c.nume?.toLowerCase().includes(lower) ||
      c.fond?.nume?.toLowerCase().includes(lower)
    );
  }
}