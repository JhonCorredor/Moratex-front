import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TalleresIndexComponent } from './talleres-index/talleres-index.component';

const routes: Routes = [{ path: '', component: TalleresIndexComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TalleresRoutingModule { }
