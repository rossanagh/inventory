import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompartimentComponent } from "./app/compartiment/compartiment.component";



const routes: Routes = [
    { path: 'compartimente', component: CompartimentComponent },  // Ruta pentru Compartimente
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule {}