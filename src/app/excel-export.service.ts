import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { Dosar } from '../dosar.model';
import { AuditService } from './audit.service';

interface AuditLogEntry {
  timestamp: Date;
  action: string;
}

@Injectable({ providedIn: 'root' })
export class ExcelExportService {
  private auditLog: AuditLogEntry[] = [];

  constructor(private audit: AuditService) {}
  exportDosare(dosare: Dosar[]): void {
    this.logAction('Export dosare în Excel');
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Dosare');
  
    // Extrage meta din primul dosar (dacă există)
    const first = dosare?.[0];
    const inventar = first?.inventar as any; // tipul tău Inventar dacă e definit în model
    const compartiment = inventar?.compartiment;
    const fond = compartiment?.fond;
  
    const fondText = ` ${fond?.nume ?? ''}`;
    const compartimentText = ` ${compartiment?.nume ?? ''}`;
    const inventarText = ` ${inventar?.an ?? ''} | Timp păstrare: ${inventar?.pastrare ?? ''}`;
  
    // Rândurile 1–3: meta (mergem A..G ca să fie pe toată lățimea tabelului)
    worksheet.addRow([fondText]);
    worksheet.addRow([compartimentText]);
    worksheet.addRow([inventarText]);
  
    // Stilizare (bold) + merge cells pe A1:G1, A2:G2, A3:G3
    const lastCol = 7; // avem 7 coloane în tabel
    worksheet.mergeCells(1, 1, 1, lastCol);
    worksheet.mergeCells(2, 1, 2, lastCol);
    worksheet.mergeCells(3, 1, 3, lastCol);
  
    [1, 2, 3].forEach(r => {
      const row = worksheet.getRow(r);
      row.font = { bold: true };
      row.alignment = { vertical: 'middle', horizontal: 'left' };
    });
  
    // Rând gol
    worksheet.addRow([]);
  
    // Antete tabel
    worksheet.addRow([
      'Nr. crt.',
      'Indicativ după nomenclator',
      'Conținutul pe scurt al dosarului',
      'Date extreme',
      'Număr file',
      'Observații',
      'Nr. cutie'
    ]);
  
    // Bold pentru header
    const headerRowIndex = worksheet.lastRow?.number ?? 6;
    const headerRow = worksheet.getRow(headerRowIndex);
    headerRow.font = { bold: true };
  
    // Date
    let totalFile = 0;
    dosare.forEach((d) => {
      const fileCount = d.numarFile || 0;
      totalFile += fileCount;
  
      worksheet.addRow([
        d.numarCriteriu,
        d.indicativNomenclator,
        d.continut,
        d.dataEnd,
        fileCount,
        d.observatii || '',
        d.cutie || ''
      ]);
    });
  
    // Rânduri de sumar
    worksheet.addRow([]);
    worksheet.addRow(['', '', `Prezentul inventar format din ${totalFile} file`, '', '', '', '']);
    worksheet.addRow(['', '', `Conține ${dosare.length} dosare`, '', '', '', '']);
  
    // Lățimi coloane
    worksheet.columns.forEach(col => {
      col.width = 20;
    });
  
    workbook.xlsx.writeBuffer().then((buffer: any) => {
      FileSaver.saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `Export_Inventar.xlsx`
      );
    });
  }
  

  /** Log pentru import */
  logImport() {
    this.logAction('Import dosare din Excel');
  }

  /** Log + trimitere la backend */
  private logAction(action: string) {
    const username = localStorage.getItem('username') || 'anonymous';

    // log local
    this.auditLog.push({ timestamp: new Date(), action });
    console.log(`Audit local: ${action} la ${new Date().toLocaleString()}`);

    // trimitere backend
    this.audit.log(username, action);
  }

  exportAuditLog() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Audit Log');

    worksheet.addRow(['Timestamp', 'Acțiune']);

    this.auditLog.forEach(entry => {
      worksheet.addRow([entry.timestamp.toLocaleString(), entry.action]);
    });

    worksheet.columns.forEach(col => {
      col.width = 30;
    });

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      FileSaver.saveAs(
        new Blob([buffer], { type: 'application/octet-stream' }),
        `AuditLog.xlsx`
      );
    });
  }
}
