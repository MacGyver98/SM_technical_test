import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';
import {
  Breed,
  BreedImage,
  BreedSearchCriteria,
} from '../../../domain/models/breed.model';
import { BreedService } from '../../../../core/services/breed.service';
import { BreedState } from '../../../application/state/breed.state';

@Component({
  selector: 'app-breeds-page',
  templateUrl: './breeds-page.component.html',
  styleUrls: ['./breeds-page.component.scss'],
})
export class BreedsPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  breeds$ = this.breedState.breeds$;
  isLoading$ = this.breedState.loading$;
  error: string | null = null;

  constructor(
    private breedService: BreedService,
    private breedState: BreedState,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllBreeds();
    this.detectLoadingState();
  }

  loadAllBreeds(): void {
    this.error = null;
    this.breedState.setLoading(true);

    this.breedService
      .loadAllBreeds()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.breedState.setLoading(false);
        }),
        catchError((error) => {
          this.error = 'Failed to load breeds. Please try again later.';
          console.error('Error loading breeds:', error);
          this.breedState.setLoading(false);
          throw error;
        })
      )
      .subscribe();
  }

  onSearch(criteria: BreedSearchCriteria): void {
    this.error = null;
    this.breedState.setLoading(true);

    this.breedService
      .searchBreeds(criteria)
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
    this.breedService
      .loadBreedImages(breedName)
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
}
