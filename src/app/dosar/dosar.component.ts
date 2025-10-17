import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Dosar } from '../../dosar.model';
import { DosarService } from '../dosar.service';
import { InventarService } from '../inventar.service';
import { TipPastrareService } from '../tip-pastrare.service';
import { CutieService } from '../cutie.service';
import { TipPastrare } from '../../tip-pastrare.model';
import { Inventar } from '../../inventar.model';
import { Cutie } from '../../cutie.model';
import { ActivatedRoute } from '@angular/router';
import { ExcelExportService } from '../excel-export.service';
import { FondService } from '../fond.service';
import { CompartimentService } from '../compartiment.service';
import { Compartiment } from '../../compartiment.model';
import { Fond } from '../../fond.model';
import { ExcelImportService } from '../excel-import.service';
import { AuditEntry, AuditService } from '../audit.service';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-dosar',
  standalone:false,
  templateUrl: './dosar.component.html',
  styleUrl: './dosar.component.css'
})
export class DosarComponent implements OnInit {
  dosare: Dosar[] = [];
  paginatedDosare: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  inventare: Inventar[] = [];
  tipuriPastrare: TipPastrare[] = [];
    fonduri: Fond[] = [];
  compartimente: Compartiment[] = [];
  cutii: Cutie[] = [];
  selectedDosar: Dosar | null = null;
  selectedInventarId: number = 0; 
  newDosar: Dosar = {
    indicativNomenclator: '',
    continut: '',
    dataStart: '',
    dataEnd: '',
    observatii: '',
    numarCriteriu: 0,
    inventar: undefined!, // Asigură-te că sunt definite corect
    tipPastrare: undefined!,
    cutie: null
  };

  
  constructor(
    private dosarService: DosarService,
    private inventarService: InventarService,
    private tipPastrareService: TipPastrareService,
    private cutieService: CutieService,
    private route: ActivatedRoute,
    private excelExportService: ExcelExportService,
    private fondService: FondService,
    private compartimentService: CompartimentService,
    private excelImportService: ExcelImportService,
    private audit: AuditService,
    public auth: AuthServiceService
  ) {}

  inventarId: number = 0;
  inventarAn: number | null = null; 
  username = '';
  isLoggedIn = false;


  auditLog: AuditEntry[] = [];
  ngOnInit(): void {
    this.inventarId = Number(this.route.snapshot.paramMap.get('inventarId'));
    this.inventarAn = Number(this.route.snapshot.paramMap.get('an')) || null;
    this.selectedInventarId = this.inventarId;

    this.loadAll();
    this.loadDosare();
    this.loadFonduri();
    this.loadCompartimente();
    this.loadInventare();

    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      this.username = storedUser;
      this.isLoggedIn = true;
      this.loadAuditLog();
    }
  }
  login() {
    if (this.username.trim()) {
      localStorage.setItem('username', this.username.trim());
      this.isLoggedIn = true;
      this.logAction('Login');
    }
  }

  logout() {
    this.logAction('Logout');
    localStorage.removeItem('username');
    this.username = '';
    this.isLoggedIn = false;
  }
  importDosare() {
    // cod import...
    this.logAction('Import dosare');
  }

  // exemplu: apel când faci export
  exportDosare() {
    // cod export...
    this.logAction('Export dosare');
  }
  logAction(action: string) {
    const entry: AuditEntry = {
      action,
      timestamp: new Date().toISOString(),
      username: this.username
    };
    this.auditLog.push(entry);
    localStorage.setItem('auditLog', JSON.stringify(this.auditLog));
  }

  loadAuditLog() {
    const storedLog = localStorage.getItem('auditLog');
    this.auditLog = storedLog ? JSON.parse(storedLog) : [];
  }
  
  loadFonduri(): void {
    this.fondService.getAll().subscribe(data => {
      this.fonduri = data;
    });
  }
  selectedCompartiment: Compartiment | null = null;
  fondId: number = 0;
  fondNume: string = '';  
  loadCompartimente(): void {
    this.compartimentService.getAll().subscribe((data) => {
  
      // Filtrează compartimentele care sunt asociate fondului curent
      this.compartimente = data.filter(comp => comp.fond && comp.fond.id === this.fondId); // Verifică dacă fond nu este undefined
      if (this.compartimente.length > 0) {
        this.selectedCompartiment = this.compartimente[0];  // Alege primul compartiment din listă
        if (this.selectedCompartiment.fond) {
          this.fondNume = this.selectedCompartiment.fond.nume || ''; // Dacă fond este definit, setează numele fondului
        }
      }
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    if (!file) return;
  
    if (!this.inventarId) {
      alert('Selectează un inventar înainte de import.');
      input.value = '';
      return;
    }
  
    this.excelImportService.importDosare(file)
      .then(({ dosare, duplicateInFile }) => {
        // 1) Dubluri interne în fișier
        if (duplicateInFile.length > 0) {
          alert(
            `Fișierul conține duplicate la "Număr Criteriu": ${duplicateInFile.join(', ')}.\n` +
            `Corectează fișierul și reîncearcă.`
          );
          return;
        }
  
        // 2) Verificare batch cu baza (pe inventarul curent)
        const nums: number[] = dosare
          .map((d: Dosar) => d.numarCriteriu)
          .filter((n: number | undefined): n is number => typeof n === 'number');
  
        const inventarRef = this.inventare.find(i => i.id != null && i.id === this.inventarId);
        if (!inventarRef) {
          alert('Inventarul selectat nu a fost găsit.');
          return;
        }
  
        // Detalii comune pentru audit (o singură dată)
        const invYear =
          (inventarRef as any).an ??
          (inventarRef as any).year ??
          (inventarRef as any).An ?? '-';
  
        const compName =
          (inventarRef as any).compartiment?.nume ??
          (inventarRef as any).compartiment?.denumire ??
          (inventarRef as any).compartiment?.name ?? '-';
  
        const fondName =
          (inventarRef as any).compartiment?.fond?.denumire ??
          (inventarRef as any).compartiment?.fond?.nume ??
          (inventarRef as any).fond?.denumire ??
          (inventarRef as any).fond?.nume ?? '-';
  
        const proceedWithUpsert = () => {
          // sortăm crescător după număr criteriu (cele fără număr la final)
          const dosareSorted: Dosar[] = [...dosare].sort((a, b) => {
            const ax = a.numarCriteriu ?? Number.POSITIVE_INFINITY;
            const bx = b.numarCriteriu ?? Number.POSITIVE_INFINITY;
            return ax - bx;
          });
  
          // Map local: numarCriteriu -> dosar existent (din lista deja încărcată în UI)
          const existingByCriteriu = new Map<number, Dosar>(
            this.dosare
              .filter((d: Dosar) => d.inventar?.id === this.inventarId && d.numarCriteriu != null)
              .map((d: Dosar) => [d.numarCriteriu as number, d])
          );
  
          // Colecții pentru audit (NUMERE doar)
          const createdNums: number[] = [];
          const updatedNums: number[] = [];
  
          let ok = 0, fail = 0;
  
          // Procesare SECVENȚIALĂ ca să păstrăm ordinea
          const process = (idx: number) => {
            if (idx >= dosareSorted.length) {
              // === FINAL: un singur audit cu detaliile comune + listele de nr. criteriu ===
              const user = localStorage.getItem('username') || 'anonymous';
              createdNums.sort((a, b) => a - b);
              updatedNums.sort((a, b) => a - b);
  
              const parts: string[] = [
                `inventar=${invYear}`,
                `compartiment=${compName}`,
                `fond=${fondName}`
              ];
              if (createdNums.length) parts.push(`create:[${createdNums.join(', ')}]`);
              if (updatedNums.length) parts.push(`update:[${updatedNums.join(', ')}]`);
  
              const action = `Import dosare — ${parts.join(' | ')}`;
  
              try {
                this.audit?.log(user, action);
              } catch (e) {
                console.warn('Audit log failed (frontend):', e);
              }
  
              this.loadDosare?.();
              alert(`Import finalizat.\nReușite: ${ok}\nErori: ${fail}`);
              return;
            }
  
            const d = dosareSorted[idx];
            d.inventar = inventarRef;
  
            if (d.numarCriteriu != null && existingByCriteriu.has(d.numarCriteriu)) {
              // UPDATE după număr criteriu
              const existing = existingByCriteriu.get(d.numarCriteriu)!;
              d.id = existing.id;
  
              this.dosarService.update(d).subscribe({
                next: () => {
                  ok++;
                  if (typeof d.numarCriteriu === 'number') updatedNums.push(d.numarCriteriu);
                  process(idx + 1);
                },
                error: (err) => {
                  fail++;
                  console.error('Eroare la update (upsert după numarCriteriu):', err);
                  process(idx + 1);
                }
              });
            } else {
              // CREATE
              this.dosarService.addDosar(d).subscribe({
                next: () => {
                  ok++;
                  if (typeof d.numarCriteriu === 'number') createdNums.push(d.numarCriteriu);
                  process(idx + 1);
                },
                error: (err) => {
                  fail++;
                  console.error('Eroare la adăugare:', err);
                  process(idx + 1);
                }
              });
            }
          };
  
          process(0);
        };
  
        if (nums.length === 0) {
          // nimic de verificat în DB
          proceedWithUpsert();
          return;
        }
  
        this.dosarService.existsNumarCriteriuBatch(this.inventarId, nums).subscribe({
          next: (existing: number[]) => {
            if (existing && existing.length > 0) {
              existing.sort((a, b) => a - b);
              alert(
                `Excelul conține "Număr Criteriu" deja existent(e) pe inventarul selectat: ${existing.join(', ')}.\n` +
                `Importul a fost oprit.`
              );
              return;
            }
            proceedWithUpsert();
          },
          error: (err) => {
            console.error('Eroare la verificarea batch:', err);
            alert('Nu s-a putut verifica unicitatea numerelor. Încearcă din nou.');
          }
        });
      })
      .catch((err) => {
        console.error('Eroare la import:', err);
        alert('Fișier Excel invalid sau corupt.');
      })
      .finally(() => {
        // reset pentru a putea reselecta același fișier
        (event.target as HTMLInputElement).value = '';
      });
  }
  
  
  
  // --- Căutare dosare ---
searchTextDosar: string = '';

// Listă filtrată (getter)
private get filteredDosare(): Dosar[] {
  const q = (this.searchTextDosar || '').toLowerCase().trim();
  if (!q) return this.dosare;

  return this.dosare.filter(d => {
    const nrCrt = (d.numarCriteriu ?? '').toString().toLowerCase();
    const indicativ = (d.indicativNomenclator ?? '').toLowerCase();
    const continut = (d.continut ?? '').toLowerCase();
    const dataStart = (d.dataStart ?? '').toLowerCase();
    const dataEnd = (d.dataEnd ?? '').toLowerCase();
    const nrFile = (d.numarFile ?? '').toString().toLowerCase();
    const obs = (d.observatii ?? '').toLowerCase();
    const cutie = (d.cutie ?? '').toString().toLowerCase();

    return (
      nrCrt.includes(q) ||
      indicativ.includes(q) ||
      continut.includes(q) ||
      dataStart.includes(q) ||
      dataEnd.includes(q) ||
      nrFile.includes(q) ||
      obs.includes(q) ||
      cutie.includes(q)
    );
  });
}

// Recalculează pagina la modificarea căutării
onDosarSearchChange(): void {
  this.currentPage = 1;
  this.updatePaginatedDosare();
}

loadDosare() {
  this.dosarService.getAll().subscribe(data => {
    // filtrează pe inventarul curent
    const filtered = data.filter(d => d.inventar?.id === this.inventarId);

    // SORTEAZĂ ÎNAINTE DE PAGINARE
    this.dosare = filtered.sort(this.compareDosareAsc);

    // recalcul paginarea după sort
    this.totalPages = Math.max(1, Math.ceil(this.dosare.length / this.pageSize));
    // protecție dacă inventarul s-a schimbat și pagina curentă e prea mare
    this.currentPage = Math.min(this.currentPage, this.totalPages);

    this.updatePaginatedDosare(); // va face slice din this.dosare deja sortat
  });
}
// adaugă în componentă un comparator reutilizabil
private compareDosareAsc = (a: Dosar, b: Dosar) => {
  // 1) numarCriteriu crescător; cele fără număr la final
  const ax = a.numarCriteriu ?? Number.POSITIVE_INFINITY;
  const bx = b.numarCriteriu ?? Number.POSITIVE_INFINITY;
  if (ax !== bx) return ax - bx;

  // 2) tie-breaker opțional: cutie (crescător; fără cutie la final)
  const ca = a.cutie ?? Number.POSITIVE_INFINITY;
  const cb = b.cutie ?? Number.POSITIVE_INFINITY;
  if (ca !== cb) return ca - cb;

  // 3) tie-breaker: indicativ alfabetico-numeric
  const ia = a.indicativNomenclator?.toString() ?? '';
  const ib = b.indicativNomenclator?.toString() ?? '';
  const ic = ia.localeCompare(ib, undefined, { numeric: true, sensitivity: 'base' });
  if (ic !== 0) return ic;

  // 4) fallback stabil: id
  return (a.id ?? 0) - (b.id ?? 0);
};

  
  
  exportToExcel(): void {
    if (!this.inventarAn) {
      alert('Anul inventarului nu este definit!');
      return;
    }
    this.excelExportService.exportDosare(this.dosare);
    this.logAction('Export dosare');

  }
  
  
  updatePaginatedDosare() {
    const list = this.filteredDosare;
    this.totalPages = Math.max(1, Math.ceil(list.length / this.pageSize));
  
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedDosare = list.slice(startIndex, endIndex);
  }
  

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedDosare();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedDosare();
    }
  }
  loadInventare(): void {
    this.inventarService.getAll().subscribe((data) => {
      this.inventare = data;
    });
  }

  loadAll(): void {
    this.dosarService.getAll().subscribe({
      next: (data) => {
        this.dosare = this.inventarId ? data.filter(d => d.inventar?.id === this.inventarId) : data;
  
        // Dacă inventarAn nu e setat din URL, îl luăm din primul dosar
        if (!this.inventarAn && this.dosare.length > 0) {
          this.inventarAn = this.dosare[0].inventar?.an || new Date().getFullYear();
        }
      },
      error: (error) => {
        console.error('Eroare:', error);
      }
    });
  }
  addDosar() {
    const invId = this.inventarId; // <- din rută, nu din select
    if (!invId) {
      alert('Inventarul curent nu este setat.');
      return;
    }
    if (!this.newDosar?.numarCriteriu || String(this.newDosar.numarCriteriu).trim() === '') {
      alert('Completează "Număr Criteriu".');
      return;
    }
  
    this.newDosar.inventar = { id: invId } as any;
  
    this.dosarService.existsNumarCriteriu(invId, String(this.newDosar.numarCriteriu)).subscribe({
      next: (exists) => {
        if (exists) {
          alert(`Numărul curent "${this.newDosar.numarCriteriu}" există deja în inventar.`);
          return;
        }
        this.dosarService.addDosar(this.newDosar).subscribe({
          next: () => {
            this.audit.log(localStorage.getItem('username'), 'Adăugare Dosar');
            this.loadDosare();
            this.resetForm();
          },
          error: (err) => {
            if (err?.status === 409) {
              alert('Număr curent există deja (verificat de server).');
            } else {
              console.error('Eroare la adăugare dosar:', err);
              alert('A apărut o eroare la salvare.');
            }
          }
        });
      },
      error: (err) => {
        console.error('Eroare la verificarea existenței:', err);
        alert('Nu s-a putut verifica unicitatea numărului de criteriu.');
      }
    });
  }
  
  
  resetForm() {
    this.newDosar = {
      indicativNomenclator: '',
      continut: '',
      dataStart: '',
      dataEnd: '',
      observatii: '',
      inventar: undefined!,
      tipPastrare: undefined!,
      cutie: null,
      numarCriteriu: 0
    };
  }
  
  openAuditLog() {
    window.open('/api/audit/ultimele-12-luni', '_blank');
  }
  

  editDosar(dosar: Dosar): void {
    const newContinut = prompt('Actualizează conținutul:', dosar.continut);
    if (newContinut && newContinut !== dosar.continut) {
      dosar.continut = newContinut;
      this.dosarService.update(dosar).subscribe(() => this.loadAll());
    }
  }

  deleteDosar(id: number): void {
    this.dosarService.delete(id).subscribe(() => this.dosare = this.dosare.filter(d => d.id !== id));
  }

  dosar: Dosar = {
    id: undefined, // opțional, îl pune backend-ul
    indicativNomenclator: '',
    continut: '',
    dataStart: '',
    dataEnd: '',
    observatii: '',
    inventar: { 
      id: undefined as any, 
      an: null as any, 
      pastrare: '', 
      compartiment: {} as Compartiment, 
      fonduri: {} as Fond 
    },
    tipPastrare: {} as TipPastrare,
    cutie: null,
    numarFile: 0,
    fonduri: {} as Fond,
    compartiment: {} as Compartiment
  };
  
}

