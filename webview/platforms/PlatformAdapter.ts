import type { ListingData, PlatformSelectors } from '../../types/types';

export abstract class PlatformAdapter {
  abstract readonly platformName: string;
  abstract readonly baseUrl: string;
  abstract readonly selectors: PlatformSelectors;

  abstract fillForm(data: ListingData): string; // returns JS snippet to execute
  abstract uploadImages(images: { data: string; mimeType: string }[]): string;
  abstract submitListing(): string;
}

