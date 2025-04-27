import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BreedState } from './application/state/breed.state';
import { GetBreedsUseCase } from './application/usecases/get-breeds.usecase';
import { SearchBreedsUseCase } from './application/usecases/search-breeds.usecase';
import { BreedApiRepository } from './infrastructure/repositories/breed-api.repository';
import { BreedCardComponent } from './ui/components/breed-card/breed-card.component';
import { BreedListComponent } from './ui/components/breed-list/breed-list.component';
import { BreedSearchComponent } from './ui/components/breed-search/breed-search.component';
import { BreedsPageComponent } from './ui/pages/breeds-page/breeds-page.component';


@NgModule({
  declarations: [
    BreedListComponent,
    BreedCardComponent,
    BreedSearchComponent,
    BreedsPageComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  exports: [BreedsPageComponent],
  providers: [
    // Repository implementation
    { provide: 'BreedRepository', useClass: BreedApiRepository },

    // Use cases
    GetBreedsUseCase,
    SearchBreedsUseCase,

    // State (optional)
    BreedState,
  ],
})
export class BreedsModule {}
