import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import {
  Breed,
  BreedImage
} from '../../../domain/models/breed.model';
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

  constructor(
    private breedApiRepository: BreedApiRepository,
    private breedState: BreedState
  ) {}

  trackByBreedName(index: number, breed: Breed): string {
    return breed.name;
  }

  loadBreedImages(breedName: string, subBreed?: string): void {
    this.breedApiRepository
      .getBreedImages(breedName, subBreed)
      .pipe(
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
