import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Breed, BreedImage } from '../../../domain/models/breed.model';

@Component({
  selector: 'app-breed-card',
  templateUrl: './breed-card.component.html',
  styleUrls: ['./breed-card.component.scss'],
})
export class BreedCardComponent {
  @Input() breed!: Breed;
  @Output() loadImages = new EventEmitter<{
    breedName: string;
    subBreed?: string;
  }>();

  showImages = false;
  isLoadingImages = false;

  toggleImages(): void {
    this.showImages = !this.showImages;
    if (
      this.showImages &&
      (!this.breed.images || this.breed.images.length === 0)
    ) {
      this.loadBreedImages();
    }
  }

  loadBreedImages(): void {
    this.loadImages.emit({
      breedName: this.breed.name,
    });
    // Note: Parent component should handle the API call and update the breed.images
  }

  loadSubBreedImages(subBreed: string): void {
    this.loadImages.emit({
      breedName: this.breed.name,
      subBreed,
    });
  }

  onImageLoad(image: BreedImage): void {
    image.isLoaded = true;
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none'; // Hide broken images
  }
}
