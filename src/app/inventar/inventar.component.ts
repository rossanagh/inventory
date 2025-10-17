import { Component, Input, OnInit } from '@angular/core';
import { Compartiment } from '../../compartiment.model';

import { CompartimentService } from '../compartiment.service';
import { InventarService } from '../inventar.service';
import { Inventar } from '../../inventar.model';
import { Dosar } from '../../dosar.model';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-inventar',
  standalone: false,
  templateUrl: './inventar.component.html',
  styleUrl: './inventar.component.css'
})
export class InventarComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  filteredInventare: Inventar[] = []; 
  inventare: Inventar[] = [];
  compartimente: Compartiment[] = [];
  searchText: string = '';
  newInventar: Inventar = {
    an: new Date().getFullYear(),
    pastrare:'',
    compartiment: {
      id: 0, nume: '',
      fond: undefined,
      
    }
  };
  paginatedInventare: Inventar[] = [];
  invCurrentPage: number = 1;
  invPageSize: number = 10;
  invTotalPages: number = 1;
  constructor(
    private inventarService: InventarService,
    private compartimentService: CompartimentService,
    private route: ActivatedRoute,
    public auth: AuthServiceService
  ) {}
  openAddInventarPopup(): void {
    this.newInventar = {
      an: new Date().getFullYear(),
      pastrare: '',
      compartiment: { id: 0, nume: '' }
    };
    this.selectedCompartimentIdForNew = this.selectedCompartimentId || null;
    this.showAddInventarPopup = true;
  }

  closeAddInventarPopup(): void {
    this.showAddInventarPopup = false;
  }

  confirmAddInventar(): void {
    const an = Number(this.newInventar.an);
    const pastrare = (this.newInventar.pastrare || '').trim();
    const compId = this.selectedCompartimentIdForNew;

    if (!an || !compId) return;

    const comp = this.compartimente.find(c => c.id === compId);
    const payload: Inventar = {
      an,
      pastrare,
      compartiment: { id: compId, nume: comp?.nume || '' }
    };

    this.inventarService.save(payload).subscribe({
      next: () => {
        this.loadInventare();
        this.closeAddInventarPopup();
      },
      error: (err) => console.error('Eroare la adăugare inventar:', err)
    });
  }

  // popup state
  showAddInventarPopup: boolean = false;
  selectedCompartimentIdForNew: number | null = null;
  private updatePaginatedInventare(): void {
    const list = this.filteredInventare; // lista deja filtrată de applyFilter()
    this.invTotalPages = Math.max(1, Math.ceil(list.length / this.invPageSize));
  
    if (this.invCurrentPage > this.invTotalPages) {
      this.invCurrentPage = this.invTotalPages;
    }
    const start = (this.invCurrentPage - 1) * this.invPageSize;
    const end = start + this.invPageSize;
    this.paginatedInventare = list.slice(start, end);
  }
  
  nextInventarPage(): void {
    if (this.invCurrentPage < this.invTotalPages) {
      this.invCurrentPage++;
      this.updatePaginatedInventare();
    }
  }
  
  previousInventarPage(): void {
    if (this.invCurrentPage > 1) {
      this.invCurrentPage--;
      this.updatePaginatedInventare();
    }
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(pm => {
      const param = pm.get('id');                 // <-- 'id' (nu 'compartimentId')
      this.selectedCompartimentId = param ? Number(param) : 0;
      this.loadInventare();
    });
    this.loadCompartimente();
    this.loadDosareCount(); 
  }
  private applyFilter(): void {
    const cid = Number(this.selectedCompartimentId);
    this.filteredInventare = cid
      ? this.inventare.filter(i => Number(i?.compartiment?.id) === cid)
      : this.inventare;
  
    if (this.searchText?.trim()) {
      const q = this.searchText.toLowerCase();
      this.filteredInventare = this.filteredInventare.filter(i =>
        ('' + i.an).toLowerCase().includes(q) ||
        (i.pastrare || '').toLowerCase().includes(q) ||
        (i.compartiment?.nume || '').toLowerCase().includes(q)
      );
    }
  
    // reset pagină și re-calculează
    this.invCurrentPage = 1;
    this.updatePaginatedInventare();
  }
  

  onSearchChange(): void {
    this.applyFilter();
  }

  loadInventare(): void {
    this.inventarService.getAll().subscribe(data => {
      this.inventare = data ?? [];
      this.applyFilter(); // filtre + paginare
    });
  }
  

  loadCompartimente(): void {
    this.compartimentService.getAll().subscribe(data => this.compartimente = data ?? []);
  }

  selectedCompartimentId: number = 0; // îl poți seta din URL sau altă selecție


  addInventar(): void {
    if (this.newInventar.an && this.newInventar.compartiment?.id) {
      this.inventarService.save(this.newInventar).subscribe(() => {
        this.loadInventare();
        this.newInventar = { an: new Date().getFullYear(), pastrare:'', compartiment: { id: 0, nume: '' } };
      });
    }
  }

  editInventar(inventar: Inventar): void {
    const updatedAn = prompt("Editează anul inventarului:", inventar.an.toString());

    if (updatedAn && +updatedAn !== inventar.an) {
      const updatedInventar: Inventar = {
        id: inventar.id,
        an: +updatedAn,
        pastrare:'',
        compartiment: {
          id: inventar.compartiment.id,
          nume: inventar.compartiment.nume
        }
      };

      this.inventarService.updateInventar(updatedInventar).subscribe(() => {
        this.loadInventare();
      });
    }
  }
  dosareCountMap: { [inventarId: number]: number } = {};
  loadDosareCount(): void {
    this.inventarService.getAllD().subscribe((dosare: Dosar[]) => {
      this.dosareCountMap = {};
  
      dosare.forEach(d => {
        const id = d.inventar?.id;
        if (id) {
          this.dosareCountMap[id] = (this.dosareCountMap[id] || 0) + 1;
        }
      });
    });
  }
  
  deleteInventar(id: number | undefined): void {
    if (id) {
      this.inventarService.deleteInventar(id).subscribe(() => {
        this.inventare = this.inventare.filter(i => i.id !== id);
      });
    }
  }
}