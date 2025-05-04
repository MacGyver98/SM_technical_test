import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'breeds',
    pathMatch: 'full',
  },
  {
    path: 'breeds',
    loadChildren: () =>
      import('./breeds/breeds.module').then((m) => m.BreedsModule),
  },
  {
    path: '**',
    redirectTo: 'breeds',
  },
];
