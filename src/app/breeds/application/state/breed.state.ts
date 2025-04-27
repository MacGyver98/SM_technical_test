import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Breed, BreedImage } from '../../domain/models/breed.model';

@Injectable({ providedIn: 'root' })
export class BreedState {
  private breedsSubject = new BehaviorSubject<Breed[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  breeds$: Observable<Breed[]> = this.breedsSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  setBreeds(breeds: Breed[]): void {
    this.breedsSubject.next(breeds);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  addImagesToBreed(breedName: string, images: BreedImage[]): void {
    const breeds = this.breedsSubject.getValue();
    const breedIndex = breeds.findIndex((breed) => breed.name === breedName);

    if (breedIndex !== -1) {
      const updatedBreed = {
        ...breeds[breedIndex],
        images: [...(breeds[breedIndex].images || []), ...images],
      };
      const updatedBreeds = [...breeds];
      updatedBreeds[breedIndex] = updatedBreed;
      this.breedsSubject.next(updatedBreeds);
    }
  }
}
