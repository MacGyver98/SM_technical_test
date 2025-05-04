import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Breed } from '../../domain/models/breed.model';
import { BreedRepository } from '../../domain/repositories/breed.repository';

@Injectable({ providedIn: 'root' })
export class GetBreedsUseCase {
  constructor(private breedRepository: BreedRepository) {}

  execute(): Observable<Breed[]> {
    return this.breedRepository.getAllBreeds();
  }
}
