import { Component, Input, OnInit } from '@angular/core';

import { Compartiment } from '../../compartiment.model';
import { CutieService } from '../cutie.service';
import { CompartimentService } from '../compartiment.service';
import { Cutie } from '../../cutie.model';

@Component({
  selector: 'app-cutie',
  standalone: false,
  templateUrl: './cutie.component.html',
  styleUrl: './cutie.component.css'
})
export class CutieComponent implements OnInit {
  @Input() isAdmin: boolean = false;
  cutii: Cutie[] = [];  // Declara array-ul pentru a ține cutiile

  constructor(private cutieService: CutieService) {}

  ngOnInit(): void {
    this.loadCutii();  // Încarcă datele atunci când componenta se încarcă
  }

  loadCutii(): void {
    this.cutieService.getAll().subscribe(data => {
      this.cutii = data;  // Salvează datele primite într-un array 'cutii'
    });
  }
}