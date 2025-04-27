export interface Breed {
  name: string;
  subBreeds: string[];
  images?: BreedImage[];
}

export interface BreedImage {
  url: string;
  breedName: string;
  subBreedName?: string | null;
}

export interface BreedSearchCriteria {
  searchTerm: string;
  includeSubBreeds: boolean;
}

export interface LoadBreedImagesEvent {
  breedName: string;
  subBreed?: string;
}