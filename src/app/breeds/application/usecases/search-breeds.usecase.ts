import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BreedSearchCriteria, Breed } from '../../domain/models/breed.model';
import { BreedApiRepository } from '../../infrastructure/repositories/breed-api.repository';

@Injectable({ providedIn: 'root' })
export class SearchBreedsUseCase {
  constructor(private breedApiRepository: BreedApiRepository) {}

  execute(criteria: BreedSearchCriteria): Observable<Breed[]> {
    return this.breedApiRepository.searchBreeds(criteria);
  }
}
