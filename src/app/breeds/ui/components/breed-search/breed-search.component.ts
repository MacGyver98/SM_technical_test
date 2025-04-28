import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { BreedSearchCriteria } from '../../../domain/models/breed.model';
import { BreedService } from '../../../../core/services/breed.service';
import { Breed } from '../../../domain/models/breed.model';

@Component({
  selector: 'app-breed-search',
  templateUrl: './breed-search.component.html',
  styleUrls: ['./breed-search.component.scss'],
})
export class BreedSearchComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  includeSubBreedsControl = new FormControl(true);
  filteredBreeds: Breed[] = [];

  @Output() searchChange = new EventEmitter<BreedSearchCriteria>();

  constructor(private breedService: BreedService) {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.breedService.searchBreeds({
          searchTerm: searchTerm?.trim() || '',
          includeSubBreeds: this.includeSubBreedsControl.value || false,
        }).subscribe((breeds) => {
          this.filteredBreeds = breeds;
          this.filteredBreeds.forEach(breed => {
            this.breedService
              .getRandomBreedImage(breed.name)
              .subscribe((imageUrl) => {
                breed.imageUrl = imageUrl;
              });
          });
          this.emitSearchCriteria();
        });
      });

    this.includeSubBreedsControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.emitSearchCriteria());
  }

  private emitSearchCriteria(): void {
    this.searchChange.emit({
      searchTerm: this.searchControl.value?.trim() || '',
      includeSubBreeds: this.includeSubBreedsControl.value || false,
    });
  }

  clearSearch(): void {
    this.searchControl.reset('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
