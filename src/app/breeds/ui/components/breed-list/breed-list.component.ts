import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { catchError, Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Breed, BreedImage } from '../../../domain/models/breed.model';
import { BreedApiRepository } from '../../../infrastructure/repositories/breed-api.repository';
import { BreedState } from './../../../application/state/breed.state';

@Component({
  selector: 'app-breed-list',
  templateUrl: './breed-list.component.html',
  styleUrls: ['./breed-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreedListComponent {
  @Input() selectedBreeds: Breed[] | null = [];
  @Output() imagesLoaded = new EventEmitter<{
    breedName: string;
    images: BreedImage[];
  }>();

  loading$: Observable<boolean> = this.breedState.loading$;
  private destroy$ = new Subject<void>();

  constructor(
    private breedApiRepository: BreedApiRepository,
    private breedState: BreedState,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByBreedName(index: number, breed: Breed): string {
    return breed.name;
  }

  loadBreedImages(breedName: string, subBreed?: string): void {
    this.breedApiRepository
      .getBreedImages(breedName, subBreed)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Error loading images:', error);
          return of([]);
        })
      )
      .subscribe((images) => {
        this.breedState.addImagesToSelectedBreeds(breedName, images);
        this.imagesLoaded.emit({ breedName, images });
      });
  }
}
