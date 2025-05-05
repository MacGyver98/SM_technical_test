import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { GetBreedsUseCase } from './application/usecases/get-breeds.usecase';
import { SearchBreedsUseCase } from './application/usecases/search-breeds.usecase';
import { BreedApiRepository } from './infrastructure/repositories/breed-api.repository';
import { BreedCardComponent } from './ui/components/breed-card/breed-card.component';
import { BreedListComponent } from './ui/components/breed-list/breed-list.component';
import { BreedSearchComponent } from './ui/components/breed-search/breed-search.component';
import { BreedsPageComponent } from './ui/pages/breeds-page/breeds-page.component';
import { BreedsRoutingModule } from './breeds-routing.module';
import { FilterImagesPipe } from './ui/pipes/filter-images.pipe';


@NgModule({
  declarations: [
    BreedListComponent,
    BreedCardComponent,
    BreedSearchComponent,
    BreedsPageComponent,
    FilterImagesPipe,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    BreedsRoutingModule,
  ],
  exports: [BreedsPageComponent, FilterImagesPipe],
  providers: [
    // Repository implementation
    { provide: 'BreedApiRepository', useClass: BreedApiRepository },

    // Use cases
    GetBreedsUseCase,
    SearchBreedsUseCase,
  ],
})
export class BreedsModule {}
