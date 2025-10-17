// src/app/inventar.model.ts
import { Compartiment } from './compartiment.model';
import { Fond } from './fond.model';

export interface Inventar {
  id?: number;
  an: any;
  pastrare:string;
  compartiment: Compartiment;
  fonduri?: Fond;


}
