import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralTallajeIndexComponent } from './general-tallaje-index/general-tallaje-index.component';

const routes: Routes = [
  // { path: '', component: GeneralTallajeIndexComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralTallajeRoutingModule { }
