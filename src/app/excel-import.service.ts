import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Dosar } from '../dosar.model';

@Injectable({ providedIn: 'root' })
export class ExcelImportService {
  constructor() {}

  private toInt(v: unknown): number | null {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(String(v).trim());
    return Number.isFinite(n) ? n : null;
  }

  private toStr(v: unknown): string {
    return (v ?? '').toString().trim();
  }

  private isSeparatorOrEmptyRow(row: unknown[]): boolean {
    // [0] Nr. crt. | [1] Indicativ | [2] Conținut | [3] Date extreme | [4] Nr. File | [5] Observații | [6] Cutie
    const nrCrt = this.toInt(row[0]) ?? 0;
    const indicativ = this.toStr(row[1]);
    const continut = this.toStr(row[2]);
    const dataEnd = this.toStr(row[3]);
    const numarFile = this.toInt(row[4]) ?? 0;
    const observatii = this.toStr(row[5]);
    const cutie = this.toInt(row[6]) ?? 0;

    const allTextEmpty = !indicativ && !continut && !dataEnd && !observatii;
    const allNumsZero = numarFile === 0 && cutie === 0;

    return nrCrt === 0 && allTextEmpty && allNumsZero;
  }

  /** Returnează: { dosare, duplicateInFile } */
  importDosare(file: File): Promise<{ dosare: Dosar[]; duplicateInFile: number[] }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const arrayBuf = e.target?.result as ArrayBuffer;
          const data = new Uint8Array(arrayBuf);
          const wb = XLSX.read(data, { type: 'array' });
          const sheetName = wb.SheetNames[0];
          const ws = wb.Sheets[sheetName];

          // Antet la rândul 0
          const rows: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
          const out: Dosar[] = [];

          for (let i = 1; i < rows.length; i++) {
            const r = rows[i];
            if (!r || (r as unknown[]).length === 0) continue;
            if (this.isSeparatorOrEmptyRow(r)) continue;

            const nrCrt = this.toInt(r[0]);
            const indicativ = this.toStr(r[1]);
            const continut = this.toStr(r[2]);
            const dataEnd = this.toStr(r[3]);
            const numarFile = this.toInt(r[4]) ?? 0;
            const observatii = this.toStr(r[5]);
            const cutie = this.toInt(r[6]); // poate fi null

            const d: Dosar = {
              indicativNomenclator: indicativ,
              continut,
              dataStart: '',
              dataEnd,
              numarFile,
              observatii,
              cutie,
              inventar: undefined!,   // se setează în componentă după import
              tipPastrare: undefined!, // dacă folosești
              numarCriteriu: nrCrt && nrCrt !== 0 ? nrCrt : undefined
            };

            out.push(d);
          }

          // dubluri interne în fișier pe numarCriteriu
          const counts = new Map<number, number>();
          for (const d of out) {
            if (typeof d.numarCriteriu === 'number') {
              counts.set(d.numarCriteriu, (counts.get(d.numarCriteriu) ?? 0) + 1);
            }
          }
          const duplicateInFile = Array.from(counts.entries())
            .filter(([_, c]) => c > 1)
            .map(([n]) => n)
            .sort((a, b) => a - b);

          resolve({ dosare: out, duplicateInFile });
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }
}
