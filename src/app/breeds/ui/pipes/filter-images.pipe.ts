import { Pipe, PipeTransform } from '@angular/core';
import { BreedImage } from '../../domain/models/breed.model';

@Pipe({
  name: 'filterImages',
})
export class FilterImagesPipe implements PipeTransform {
  transform(images: BreedImage[], subBreed: string | null): BreedImage[] {
    if (!subBreed) {
      return images;
    }
    return images.filter((image) => image.subBreedName === subBreed);
  }
}