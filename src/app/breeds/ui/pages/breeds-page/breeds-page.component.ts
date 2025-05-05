import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, of } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { BreedState } from '../../../application/state/breed.state';
import {
  Breed,
  BreedImage,
  BreedSearchCriteria,
} from '../../../domain/models/breed.model';
import { LoadBreedImagesUseCase } from '../../../application/usecases/load-breed-images.usecase';
import { SearchBreedsUseCase } from '../../../application/usecases/search-breeds.usecase';
import { GetBreedsUseCase } from '../../../application/usecases/get-breeds.usecase';

@Component({
  selector: 'app-breeds-page',
  templateUrl: './breeds-page.component.html',
  styleUrls: ['./breeds-page.component.scss'],
})
export class BreedsPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  breeds$ = this.breedState.breeds$;
  isLoading$ = this.breedState.loading$;
  selectedBreeds$ = this.breedState.selectedBreed$;
  error: string | null = null;
  firstLoading: boolean = false;

  constructor(
    private loadBreedImagesUseCase: LoadBreedImagesUseCase,
    private getBreedsUseCase: GetBreedsUseCase,
    private searchBreedsUseCase: SearchBreedsUseCase,
    private breedState: BreedState,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllBreeds();
    this.detectLoadingState();
    this.selectedBreeds$.subscribe();
  }

  loadAllBreeds(): void {
    this.error = null;
    this.breedState.setLoading(true);
    this.firstLoading = true;

    this.getBreedsUseCase
      .execute()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.breedState.setLoading(false);
          this.firstLoading = false;
        }),
        catchError((error) => {
          this.error = 'Failed to load breeds. Please try again later.';
          console.error('Error loading breeds:', error);
          this.breedState.setLoading(false);
          return of([]); // Return an empty array as a fallback
        })
      )
      .subscribe();
  }

  onSearch(criteria: BreedSearchCriteria): void {
    this.error = null;
    this.breedState.setLoading(true);

    this.searchBreedsUseCase
      .execute(criteria)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.breedState.setLoading(false);
        }),
        catchError((error) => {
          this.error = 'Search failed. Please try again.';
          console.error('Search error:', error);
          this.breedState.setLoading(false);
          return of([]); // Return an empty array as a fallback
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleImagesLoaded({
    breedName,
    images,
  }: {
    breedName: string;
    images: BreedImage[];
  }): void {
    this.loadBreedImagesUseCase
      .execute(breedName)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.breedState.setLoading(false);
        }),
        catchError((error) => {
          this.error = 'Search failed. Please try again.';
          console.error('Search error:', error);
          this.breedState.setLoading(false);
          throw error;
        })
      )
      .subscribe();
  }

  private detectLoadingState(): void {
    this.isLoading$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  onBreedSelected(breed: Breed | null): void {
    this.breedState.setSelectedBreed(breed);
    if (breed) {
      this.loadBreedImagesUseCase.execute(breed.name).subscribe();
    }
  }
}
