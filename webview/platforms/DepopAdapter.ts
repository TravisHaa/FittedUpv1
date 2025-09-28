import type { ListingData } from '../../types/types';
import { PlatformAdapter } from './PlatformAdapter';

export class DepopAdapter extends PlatformAdapter {
  readonly platformName = 'depop';
  readonly baseUrl = 'https://www.depop.com/sell';
  readonly selectors = {
    title: 'input[name="title"], input[placeholder*="title" i]',
    description: 'textarea[name="description"], textarea[placeholder*="description" i] ',
    price: 'input[name="price"], input[placeholder*="price" i]',
    category: 'select[name="category"], input[name="category"]',
    brand: 'input[name="brand"]',
    condition: 'select[name="condition"], input[name="condition"]',
    submit: 'button[type="submit"]',
    imageInput: 'input[type="file"][accept*="image"]'
  };

  fillForm(data: ListingData): string {
    return `window.postMessage(JSON.stringify({ action: 'FILL_FORM', formData: ${JSON.stringify(
      data
    )} }), '*'); true;`;
  }

  uploadImages(images: { data: string; mimeType: string }[]): string {
    return `window.postMessage(JSON.stringify({ action: 'UPLOAD_IMAGES', images: ${JSON.stringify(
      images
    )} }), '*'); true;`;
  }

  submitListing(): string {
    return `window.postMessage(JSON.stringify({ action: 'SUBMIT_FORM' }), '*'); true;`;
  }
}

