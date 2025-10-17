// src/app/models/compartiment.model.ts
import { Fond } from './fond.model';

export interface Compartiment {
  id?: number;
  nume: string;
  fond?: Fond;
}
