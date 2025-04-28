import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Breed, BreedImage } from '../../domain/models/breed.model';

@Injectable({ providedIn: 'root' })
export class BreedState {
  private breedsSubject = new BehaviorSubject<Breed[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private selectedBreedsSubject = new BehaviorSubject<Breed[] | null>(null);

  breeds$: Observable<Breed[]> = this.breedsSubject.asObservable();
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  selectedBreed$: Observable<Breed[] | null> =
    this.selectedBreedsSubject.asObservable();

  setBreeds(breeds: Breed[]): void {
    this.breedsSubject.next(breeds);
  }

  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  setSelectedBreed(breed: Breed | null): void {
    this.selectedBreedsSubject.next(breed ? [breed] : null);
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

  addImagesToSelectedBreeds(breedName: string, images: never[] | BreedImage[]) {
    const breeds = this.selectedBreedsSubject.getValue() || [];
    const breedIndex = breeds.findIndex((breed) => breed.name === breedName);

    if (breedIndex !== -1) {
      const updatedBreed = {
        ...breeds[breedIndex],
        images: [...(breeds[breedIndex].images || []), ...images],
      };
      const updatedBreeds = [...breeds];
      updatedBreeds[breedIndex] = updatedBreed;
      this.selectedBreedsSubject.next(updatedBreeds);
    }
  }
}
