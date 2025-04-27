import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreedsPageComponent } from './ui/pages/breeds-page/breeds-page.component';

const routes: Routes = [
  {
    path: '', // path is already 'breeds' from parent
    component: BreedsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreedsRoutingModule {}
