import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { Breed, BreedImage } from '../../../domain/models/breed.model';

@Component({
  selector: 'app-breed-card',
  templateUrl: './breed-card.component.html',
  styleUrls: ['./breed-card.component.scss'],
})
export class BreedCardComponent implements OnInit, AfterViewInit {
  @Input() breed!: Breed;
  @Output() loadImages = new EventEmitter<{
    breedName: string;
    subBreed?: string;
  }>();
  selectedSubBreed: string | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    if (!this.breed.subBreeds.length) {
      this.loadBreedImages();
    }
  }
  ngAfterViewInit(): void {
    this.lazyLoadImages();
  }

  private lazyLoadImages(): void {
    const images = this.el.nativeElement.querySelectorAll('img.breed-image');
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.getAttribute('data-src');
            if (src) {
              this.renderer.setAttribute(img, 'src', src);
              obs.unobserve(img);
            }
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    images.forEach((img: Element) => observer.observe(img));
  }

  loadBreedImages(): void {
    this.loadImages.emit({
      breedName: this.breed.name,
    });
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

  toggleSubBreedSelection(subBreed: string): void {
    this.selectedSubBreed =
      this.selectedSubBreed === subBreed ? null : subBreed;

    this.loadSubBreedImages(subBreed);
  }
}
