import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Breed, BreedImage, BreedSearchCriteria } from '../../breeds/domain/models/breed.model';
import { BreedApiRepository } from '../../breeds/infrastructure/repositories/breed-api.repository';
import { BreedState } from '../../breeds/application/state/breed.state';

@Injectable({ providedIn: 'root' })
export class BreedService {
  constructor(
    private breedApiRepository: BreedApiRepository,
    private breedState: BreedState
  ) {}

  loadAllBreeds(): Observable<Breed[]> {
    this.breedState.setLoading(true);
    return this.breedApiRepository.getAllBreeds().pipe(
      tap((breeds) => {
        this.breedState.setBreeds(breeds);
        this.breedState.setLoading(false);
      })
    );
  }

  searchBreeds(criteria: BreedSearchCriteria): Observable<Breed[]> {
    this.breedState.setLoading(true);
    return this.breedApiRepository.searchBreeds(criteria).pipe(
      tap((breeds) => {
        this.breedState.setBreeds(breeds);
        this.breedState.setLoading(false);
      })
    );
  }

  loadBreedImages(breedName: string, subBreed?: string): Observable<BreedImage[]> {
    return this.breedApiRepository.getBreedImages(breedName, subBreed).pipe(
      tap((images) => {
        this.breedState.addImagesToBreed(breedName, images);
      })
    );
  }
}