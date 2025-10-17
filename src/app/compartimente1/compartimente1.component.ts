import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Compartiment } from '../../compartiment.model';
import { Fond } from '../../fond.model';
import { CompartimentService } from '../compartiment.service';
import { FondService } from '../fond.service';

@Component({
  selector: 'app-compartimente1',
  standalone:false,
  templateUrl: './compartimente1.component.html',
  styleUrl: './compartimente1.component.css'
})
export class Compartimente1Component implements OnInit{
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

  constructor(
    private route: ActivatedRoute,
    private compartimentService: CompartimentService,
    private fondService: FondService
  ) { }

  ngOnInit(): void {
 
    this.loadCompartimente1();
   
    
  }

  loadCompartimente1(): void {
    this.compartimentService.getAll().subscribe(data => {
      this.compartimente = data; // Salvează toate compartimentele
    });
  } 

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
  
  
}