import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
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
    const transformedBreeds = Object.entries(apiResponse).map(
      ([name, subBreeds]) => ({
        name,
        subBreeds,
        images: [], // Initialize empty array
      })
    );
    return transformedBreeds;
  }

  private filterBreedsWithImages(
    breeds: Breed[],
    criteria: BreedSearchCriteria
  ): Observable<Breed[]> {
    const term = criteria.searchTerm.toLowerCase();
    const filteredBreeds = breeds.filter((breed) => {
      const nameMatch = breed.name.toLowerCase().includes(term);
      const subBreedMatch =
        criteria.includeSubBreeds &&
        breed.subBreeds.some((sub) => sub.toLowerCase().includes(term));

      return nameMatch || subBreedMatch;
    });

    const breedsWithImages$ = filteredBreeds.map((breed) =>
      this.getRandomBreedImage(breed.name).pipe(
        map((imageUrl) => ({ ...breed, imageUrl }))
      )
    );

    return breedsWithImages$.length ? forkJoin(breedsWithImages$) : of([]);
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
          const images = response.message.map((url) => {
            const urlParts = url.split('/');
            const breedInfo = urlParts[4].split('-');
            const extractedBreedName = breedInfo[0];
            const extractedSubBreedName = breedInfo[1] || undefined;

            return {
              url,
              breedName: extractedBreedName,
              subBreedName: extractedSubBreedName,
              isLoaded: false,
            };
          });
          this.breedImagesCache.set(cacheKey, images);
          return images;
        }),
        catchError((error) => {
          console.error('Failed to fetch breed images:', error);
          return of([]); // Return empty array on error
        })
      );
  }

  getRandomBreedImage(breedName: string): Observable<string> {
    const cacheKey = `${breedName}`;

    if (this.breedImagesCache.has(cacheKey)) {
      return of(this.breedImagesCache.get(cacheKey)![0].url);
    }

    return this.http
      .get<{ message: string }>(
        `${this.API_URL}/breed/${breedName}/images/random`
      )
      .pipe(
        map((response) => {
          const imageUrl = response.message;
          this.breedImagesCache.set(cacheKey, [{ url: imageUrl, breedName }]);
          return imageUrl;
        }),
        catchError((error) => {
          console.error('Failed to fetch random breed image:', error);
          return of(''); // Return empty string on error
        })
      );
  }

  searchBreeds(criteria: BreedSearchCriteria): Observable<Breed[]> {
    return this.getAllBreeds().pipe(
      switchMap((breeds) => this.filterBreedsWithImages(breeds, criteria))
    );
  }
}
