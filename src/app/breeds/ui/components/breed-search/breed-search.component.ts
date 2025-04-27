import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { BreedSearchCriteria } from '../../../domain/models/breed.model';

@Component({
  selector: 'app-breed-search',
  templateUrl: './breed-search.component.html',
  styleUrls: ['./breed-search.component.scss'],
})
export class BreedSearchComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  includeSubBreedsControl = new FormControl(true);

  @Output() searchChange = new EventEmitter<BreedSearchCriteria>();

  constructor() {
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.emitSearchCriteria());

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
