import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Breed,
  BreedImage,
  BreedSearchCriteria,
} from '../../domain/models/breed.model';
import { BreedRepository } from '../../domain/repositories/breed.repository';

@Injectable({ providedIn: 'root' })
export class BreedApiRepository implements BreedRepository {
  private readonly API_URL = 'https://dog.ceo/api';
  private breedImagesCache = new Map<string, BreedImage[]>();

  constructor(private http: HttpClient) {}

  private transformToBreedModels(
    apiResponse: Record<string, string[]>
  ): Breed[] {
    return Object.entries(apiResponse).map(([name, subBreeds]) => ({
      name,
      subBreeds,
      images: [], // Initialize empty array
    }));
  }

  private filterBreeds(
    breeds: Breed[],
    criteria: BreedSearchCriteria
  ): Breed[] {
    const term = criteria.searchTerm.toLowerCase();
    return breeds.filter((breed) => {
      const nameMatch = breed.name.toLowerCase().includes(term);
      const subBreedMatch =
        criteria.includeSubBreeds &&
        breed.subBreeds.some((sub) => sub.toLowerCase().includes(term));

      return nameMatch || subBreedMatch;
    });
  }

  getAllBreeds(): Observable<Breed[]> {
    return this.http
      .get<{ message: Record<string, string[]> }>(
        `${this.API_URL}/breeds/list/all`
      )
      .pipe(map((response) => this.transformToBreedModels(response.message)));
  }

  getBreedImages(
    breedName: string,
    subBreed?: string
  ): Observable<BreedImage[]> {
    const path = subBreed ? `${breedName}/${subBreed}` : breedName;

    const cacheKey = subBreed ? `${breedName}-${subBreed}` : breedName;

    if (this.breedImagesCache.has(cacheKey)) {
      return of(this.breedImagesCache.get(cacheKey)!);
    }

    return this.http
      .get<{ message: string[] }>(`${this.API_URL}/breed/${path}/images`)
      .pipe(
        map((response) => {
          const images = response.message.map((url) => ({
            url,
            breedName,
            subBreedName: subBreed,
          }));
          this.breedImagesCache.set(cacheKey, images);
          return images;
        }),
        catchError((error) => {
          console.error('Failed to fetch breed images:', error);
          return of([]); // Return empty array on error
        })
      );
  }

  searchBreeds(criteria: BreedSearchCriteria): Observable<Breed[]> {
    return this.getAllBreeds().pipe(
      map((breeds) => this.filterBreeds(breeds, criteria))
    );
  }
}
