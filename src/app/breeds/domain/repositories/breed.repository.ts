import { Observable } from 'rxjs';
import { Breed, BreedImage, BreedSearchCriteria } from '../models/breed.model';

export abstract class BreedRepository {
  abstract getAllBreeds(): Observable<Breed[]>;
  abstract getBreedImages(
    breedName: string,
    subBreed?: string
  ): Observable<BreedImage[]>;
  abstract searchBreeds(criteria: BreedSearchCriteria): Observable<Breed[]>;
}
