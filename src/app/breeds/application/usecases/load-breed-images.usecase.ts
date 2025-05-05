import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BreedImage } from '../../domain/models/breed.model';
import { BreedApiRepository } from '../../infrastructure/repositories/breed-api.repository';


@Injectable({ providedIn: 'root' })
export class LoadBreedImagesUseCase {
  constructor(private breedApiRepository: BreedApiRepository) {}

  execute(breedName: string, subBreed?: string): Observable<BreedImage[]> {
    return this.breedApiRepository.getBreedImages(breedName, subBreed);
  }
}
