export interface Breed {
  name: string;
  subBreeds: string[];
  images?: BreedImage[];
  imageUrl?: string;
}

export interface BreedImage {
  url: string;
  breedName: string;
  subBreedName?: string | null;
  isLoaded?: boolean;
}

export interface BreedSearchCriteria {
  searchTerm: string;
  includeSubBreeds: boolean;
}

export interface LoadBreedImagesEvent {
  breedName: string;
  subBreed?: string;
}