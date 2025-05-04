import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Breed, BreedSearchCriteria } from '../../domain/models/breed.model';
import { BreedRepository } from '../../domain/repositories/breed.repository';

@Injectable({ providedIn: 'root' })
export class SearchBreedsUseCase {
  constructor(private breedRepository: BreedRepository) {}

  execute(criteria: BreedSearchCriteria): Observable<Breed[]> {
    return this.breedRepository.searchBreeds(criteria);
  }
}
