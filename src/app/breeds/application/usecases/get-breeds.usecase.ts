import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Breed } from '../../domain/models/breed.model';
import { BreedApiRepository } from '../../infrastructure/repositories/breed-api.repository';

@Injectable({ providedIn: 'root' })
export class GetBreedsUseCase {
  constructor(private breedApiRepository: BreedApiRepository) {}

  execute(): Observable<Breed[]> {
    return this.breedApiRepository.getAllBreeds();
  }
}
