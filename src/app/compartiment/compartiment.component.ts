import { Component, Input, OnInit } from '@angular/core';
import { Compartiment } from '../../compartiment.model';
import { CompartimentService } from '../compartiment.service';
import { FondService } from '../fond.service';
import { Fond } from '../../fond.model';
import { ActivatedRoute } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-compartiment',
  standalone: false,
  templateUrl: './compartiment.component.html',
  styleUrls: ['./compartiment.component.css']
})
export class CompartimentComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  searchText: string = '';
  selectedCompartiment: Compartiment | null = null;
  fondId: number = 0;
  fondNume: string = '';  
  compartimente: Compartiment[] = [];
  fonduri: Fond[] = [];
  newCompartiment: Compartiment = {
    nume: '', fond: {  nume: '' },
  
  };
  paginatedCompartimente: Compartiment[] = [];
  compCurrentPage: number = 1;
  compPageSize: number = 10;
  compTotalPages: number = 1;
  
  constructor(
    private route: ActivatedRoute,
    private compartimentService: CompartimentService,
    private fondService: FondService,
    public auth:AuthServiceService
  ) { }

  ngOnInit(): void {
    this.loadCompartimente();
 
    this.loadFonduri();
    this.fondId = Number(this.route.snapshot.paramMap.get('fondId'));
    
  }
  private get filteredCompartimente(): Compartiment[] {
    // 1) filtrează după fondId (dacă e setat / non-zero)
    let list = this.fondId
      ? this.compartimente.filter(c => c.fond && c.fond.id === this.fondId)
      : this.compartimente;
  
    // 2) filtrează după căutare
    const term = (this.searchText || '').toLowerCase().trim();
    if (!term) return list;
  
    return list.filter(c =>
      (c.nume || '').toLowerCase().includes(term) ||
      (c.fond?.nume || '').toLowerCase().includes(term)
    );
  }
  
  private updatePaginatedCompartimente(): void {
    const list = this.filteredCompartimente;
    this.compTotalPages = Math.max(1, Math.ceil(list.length / this.compPageSize));
    if (this.compCurrentPage > this.compTotalPages) {
      this.compCurrentPage = this.compTotalPages;
    }
    const start = (this.compCurrentPage - 1) * this.compPageSize;
    const end = start + this.compPageSize;
    this.paginatedCompartimente = list.slice(start, end);
  }
  
  nextCompartimentPage(): void {
    if (this.compCurrentPage < this.compTotalPages) {
      this.compCurrentPage++;
      this.updatePaginatedCompartimente();
    }
  }
  
  previousCompartimentPage(): void {
    if (this.compCurrentPage > 1) {
      this.compCurrentPage--;
      this.updatePaginatedCompartimente();
    }
  }
  
  onCompartimentSearchChange(): void {
    this.compCurrentPage = 1;
    this.updatePaginatedCompartimente();
  }
  loadCompartimente(): void {
    this.compartimentService.getAll().subscribe((data) => {
      this.compartimente = data || [];
      // dacă vrei să păstrezi logica afişării numelui fondului pentru primul rând:
      const first = this.filteredCompartimente[0];
      this.selectedCompartiment = first || null;
      this.fondNume = first?.fond?.nume || '';
  
      this.compCurrentPage = 1;       // reset la încărcare
      this.updatePaginatedCompartimente();
    });
  }
  
  
  selectCompartiment(compartiment: Compartiment): void {
    this.selectedCompartiment = compartiment;
    if (compartiment.fond) {
      this.fondNume = compartiment.fond.nume || '';  // Verifică dacă fond este definit înainte de a accesa numele
    }
  }
  
  loadFonduri(): void {
    this.fondService.getAll().subscribe(data => {
      this.fonduri = data;
    });
  }

  addCompartiment(): void {
    if (this.newCompartiment.nume && this.newCompartiment.fond?.id) {
      this.compartimentService.save(this.newCompartiment).subscribe(() => {
        this.loadCompartimente();
        this.newCompartiment = { id: 0, nume: '', fond: { id: 0, nume: '' } }; // Reset form
      });
    }
  }

  deleteCompartiment(compartimentId: number): void {
    this.compartimentService.deleteCompartiment(compartimentId).subscribe(() => {
      this.compartimente = this.compartimente.filter(comp => comp.id !== compartimentId); // Actualizează lista locală
    });
  }
  
  
  editCompartiment(compartiment: Compartiment): void {
    const updatedName = prompt("Editează numele compartimentului:", compartiment.nume);
  
    if (updatedName && updatedName !== compartiment.nume) {
      const updatedCompartiment: Compartiment = {
        id: compartiment.id,
        nume: updatedName,
        fond: {
          id: compartiment.fond?.id, // esențial!
          nume: compartiment.fond?.nume
        }
      };
  
      this.compartimentService.updateCompartiment(updatedCompartiment).subscribe({
        next: () => {
          compartiment.nume = updatedName;
          console.log('Salvare reușită');
        },
        error: (err) => {
          console.error('Eroare la salvare:', err);
        }
      });
    }
  }

  showAddCompartimentPopup: boolean = false;
  selectedFondIdForNew: number | null = null;
  
  openAddCompartimentPopup(): void {
    // reset formular
    this.newCompartiment = { nume: '', fond: { nume: '' } };
    // preselectăm fondul dacă venim din /compartimente/:fondId
    this.selectedFondIdForNew = this.fondId || null;
    this.showAddCompartimentPopup = true;
  }

  closeAddCompartimentPopup(): void {
    this.showAddCompartimentPopup = false;
  }

  confirmAddCompartiment(): void {
    const nume = (this.newCompartiment.nume || '').trim();
    const fondId = this.selectedFondIdForNew;

    if (!nume || !fondId) return;

    const fondRef: Fond = { id: fondId, nume: (this.fonduri.find(f => f.id === fondId)?.nume) || '' };

    // comp nou pentru API
    const payload: Compartiment = {
      nume,
      fond: { id: fondRef.id, nume: fondRef.nume }
    };

    this.compartimentService.save(payload).subscribe({
      next: () => {
        this.loadCompartimente();
        this.closeAddCompartimentPopup();
      },
      error: (err) => console.error('Eroare la adăugare compartiment:', err)
    });
  }
}