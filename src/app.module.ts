import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { FondComponent } from './app/fond/fond.component';
import { CompartimentComponent } from './app/compartiment/compartiment.component';
import { RouterModule, Routes } from '@angular/router';
import { FondService } from './app/fond.service';
import { CompartimentService } from './app/compartiment.service';

import { InventarComponent } from './app/inventar/inventar.component';
import { CutieComponent } from './app/cutie/cutie.component';
import { InventarService } from './app/inventar.service';
import { CutieService } from './app/cutie.service';
import { DosarComponent } from './app/dosar/dosar.component';
import { DosarService } from './app/dosar.service';
import { TipPastrareComponent } from './app/tip-pastrare/tip-pastrare.component';
import { TipPastrareService } from './app/tip-pastrare.service';
import { Compartimente1Component } from './app/compartimente1/compartimente1.component';
import { FilterCompartimentePipe } from './app/compartiment/filter-compartimente.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ExcelExportService } from './app/excel-export.service';
import { AdminComponent } from './app/admin/admin.component';
import { LoginComponent } from './app/login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/fonduri', pathMatch: 'full' },

  // login - accesibil oricând
  { path: 'login', component: LoginComponent },

  // FONDURI - vizibilă fără login
  { path: 'fonduri', component: FondComponent },

  // Rute protejate (rămân cu AuthGuard)
  { path: 'compartimente/:fondId', component: CompartimentComponent, },
  { path: 'compartimente1', component: Compartimente1Component,  },
  { path: 'inventar/:id', component: InventarComponent,  },
  { path: 'inventar', component: InventarComponent,  },
  { path: 'dosare/:inventarId', component: DosarComponent,  },

  { path: '**', redirectTo: '/fonduri' } // fallback
];


@NgModule({
  declarations: [
    AppComponent,
    FondComponent,
    CompartimentComponent,
    CutieComponent,
    InventarComponent,
    DosarComponent,
    CutieComponent,
    TipPastrareComponent,
    Compartimente1Component,
    AdminComponent,
    LoginComponent

  ],
  imports: [
    BrowserModule,
    FilterCompartimentePipe ,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  providers: [FondService, CompartimentService,InventarService, CutieService, DosarService,TipPastrareService, ExcelExportService],
  bootstrap: [AppComponent]
})
export class AppModule { }
