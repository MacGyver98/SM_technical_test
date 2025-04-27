import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { Breed, BreedImage, BreedSearchCriteria } from '../../../domain/models/breed.model';
import { BreedService } from '../../../../core/services/breed.service';
import { BreedState } from '../../../application/state/breed.state';

@Component({
  selector: 'app-breeds-page',
  templateUrl: './breeds-page.component.html',
  styleUrls: ['./breeds-page.component.scss'],
})
export class BreedsPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  searchResults$!: Observable<Breed[]>;
  isLoading$ = this.breedState.loading$;
  error: string | null = null;
  breeds$ = this.breedState.breeds$;

  constructor(private breedService: BreedService, private breedState: BreedState) {}

  ngOnInit(): void {
    this.loadAllBreeds();
  }

  loadAllBreeds(): void {
    this.error = null;
    this.searchResults$ = this.breedService.loadAllBreeds().pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        this.error = 'Failed to load breeds. Please try again later.';
        console.error('Error loading breeds:', error);
        throw error;
      })
    );
  }

  onSearch(criteria: BreedSearchCriteria): void {
    this.error = null;
    this.searchResults$ = this.breedService.searchBreeds(criteria).pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        this.error = 'Search failed. Please try again.';
        console.error('Search error:', error);
        throw error;
      })
    );
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
    this.breedService.loadBreedImages(breedName).subscribe();
  }
}
