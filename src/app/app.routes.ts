import { Routes } from '@angular/router';
import { CompartimentComponent } from './compartiment/compartiment.component';
import { FondComponent } from './fond/fond.component';


export const routes: Routes = [
  { path: '', redirectTo: '/fonduri', pathMatch: 'full' },
  { path: 'fonduri', component: FondComponent },
  { path: 'compartimente', component: CompartimentComponent }
];
