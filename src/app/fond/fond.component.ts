import { Component, Input, OnInit } from '@angular/core';
import { FondService } from '../fond.service';
import { Fond } from '../../fond.model';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-fond',
  standalone: false,
  templateUrl: './fond.component.html',
  styleUrl: './fond.component.css'
})
export class FondComponent implements OnInit {
  fonduri: Fond[] = [];
  newFond: Fond = { nume: '' };
  searchText: string = '';
  @Input() isAdmin: boolean = false;
  paginatedFonduri: Fond[] = [];
fondCurrentPage: number = 1;
fondPageSize: number = 10;
fondTotalPages: number = 1;

  constructor(private fondService: FondService, public auth: AuthServiceService) { }

  ngOnInit(): void {
    this.loadFonduri();
  }
  
private get filteredFonduri(): Fond[] {
  const term = (this.searchText || '').toLowerCase().trim();
  if (!term) return this.fonduri;
  return this.fonduri.filter(f => (f.nume || '').toLowerCase().includes(term));
}

loadFonduri(): void {
  this.fondService.getAll().subscribe(data => {
    this.fonduri = data || [];
    this.fondCurrentPage = 1;      // reset la încărcare
    this.updatePaginatedFonduri(); // calculează paginarea curentă
  });
}

onFondSearchChange(): void {
  this.fondCurrentPage = 1;
  this.updatePaginatedFonduri();
}
  editFond(fond: Fond): void {
    const updatedName = prompt("Editează numele fondului:", fond.nume);
  
    if (updatedName && updatedName !== fond.nume) {
      // Creează obiectul actualizat cu noul nume
      const updatedFond: Fond = {
        ...fond,
        nume: updatedName, // Actualizează doar numele
      };

      // Trimite fondul actualizat la backend
      this.fondService.updateFond(updatedFond).subscribe({
        next: () => {
          // Actualizează fondul local (pe client) pentru a reflecta modificările
          const index = this.fonduri.findIndex(f => f.id === fond.id);
          if (index !== -1) {
            this.fonduri[index].nume = updatedName;
          }
          console.log('Fondul a fost actualizat');
        },
        error: (err) => {
          console.error('Eroare la salvarea fondului:', err);
        }
      });
    }
  }
  addFond(): void {
    const name = prompt("Numele fondului nou:");
    if (name) {
      this.fondService.save({ nume: name }).subscribe(() => {
        this.loadFonduri();
      });
    }
  }
  

  deleteFond(id: number): void {
    this.fondService.delete(id).subscribe(() => {
      this.loadFonduri();
    });
  }

  private updatePaginatedFonduri(): void {
    const list = this.filteredFonduri;
    this.fondTotalPages = Math.max(1, Math.ceil(list.length / this.fondPageSize));
    // Dacă se schimbă filtrul sau se șterg articole, asigură-te că pagina curentă e validă
    if (this.fondCurrentPage > this.fondTotalPages) {
      this.fondCurrentPage = this.fondTotalPages;
    }
    const start = (this.fondCurrentPage - 1) * this.fondPageSize;
    const end = start + this.fondPageSize;
    this.paginatedFonduri = list.slice(start, end);
  }
  
  nextFondPage(): void {
    if (this.fondCurrentPage < this.fondTotalPages) {
      this.fondCurrentPage++;
      this.updatePaginatedFonduri();
    }
  }
  
  previousFondPage(): void {
    if (this.fondCurrentPage > 1) {
      this.fondCurrentPage--;
      this.updatePaginatedFonduri();
    }
    
  }


  showAddFondPopup: boolean = false; // <-- pentru popup

  // ...

  openAddFondPopup(): void {
    this.newFond = { nume: '' }; // resetăm formularul
    this.showAddFondPopup = true;
  }

  closeAddFondPopup(): void {
    this.showAddFondPopup = false;
  }
  confirmAddFond(): void {
    const name = (this.newFond?.nume ?? '').trim();
    if (!name) { return; }
  
    this.fondService.save({ ...this.newFond, nume: name }).subscribe(() => {
      this.loadFonduri();
      this.closeAddFondPopup();
    });
  }
  
  
}