import {
  Component,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';
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
export class BreedSearchComponent implements OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  searchControl = new FormControl('');
  includeSubBreedsControl = new FormControl(true);

  @Input() breeds: Breed[] | null = [];

  @Output() searchChange = new EventEmitter<BreedSearchCriteria>();
  @Output() breedSelected = new EventEmitter<Breed | null>();

  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;

  constructor(private breedService: BreedService) {}

  ngAfterViewInit(): void {
    this.subscribeToInputChanges();
    this.addFocusEventListener();
  }

  private subscribeToInputChanges(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.emitSearchCriteria();
      });
  }

  private addFocusEventListener(): void {
    this.searchInput.nativeElement.addEventListener('focus', () => {
      this.emitSearchCriteria();
      // this.filteredBreeds = this.filteredBreeds.length ? this.filteredBreeds : [];
    });
  }

  private emitSearchCriteria(): void {
    this.searchChange.emit({
      searchTerm: this.searchControl.value?.trim() || '',
      includeSubBreeds: this.includeSubBreedsControl.value || false,
    });
  }

  clearSearch(): void {
    this.searchControl.reset('');
    this.breedSelected.emit(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBreedSelected(breed: Breed): void {
    this.breedSelected.emit(breed);
  }
}
