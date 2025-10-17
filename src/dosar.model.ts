import { Inventar } from './inventar.model';
import { TipPastrare } from './tip-pastrare.model';
import { Cutie } from './cutie.model';
import { Compartiment } from './compartiment.model';
import { Fond } from './fond.model';

export interface Dosar {
  id?: number;
  indicativNomenclator: string;
  continut: string;
  dataStart: string;
  dataEnd: string;
  observatii: string;
  inventar?: Inventar;
  tipPastrare: TipPastrare;
  cutie?: number | null;
  numarFile?: number;
  fonduri?: Fond;
  compartiment?: Compartiment;
  numarCriteriu?: any;   // <-- NOU
}
