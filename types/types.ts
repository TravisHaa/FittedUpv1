export interface ListingDetails {
    title: string;
    description: string;
    material: string;
    category: string;
    brand: string;
    condition: string;
    aesthetic: string;
    price: number;
  }
  
// WebView automation shared types
export type PlatformId = 'depop' | 'ebay' | 'facebook';

export interface ImageData {
  data: string; // base64 without data URI prefix
  mimeType: string; // e.g., 'image/jpeg'
}

export interface ListingData {
  title: string;
  description: string;
  category: string;
  brand: string;
  condition: string;
  aesthetic?: string;
  material?: string;
  price: number;
  images?: ImageData[];
}

export type ProgressStage =
  | 'initializing'
  | 'navigating'
  | 'filling_form'
  | 'uploading_images'
  | 'submitting'
  | 'completed'
  | 'error';

export interface ProgressUpdate {
  platform: PlatformId;
  stage: ProgressStage;
  message?: string;
  percent?: number; // 0..100
}

export interface ListingResult {
  platform: PlatformId;
  success: boolean;
  listingUrl?: string;
  errorMessage?: string;
}

export type WebViewErrorType =
  | 'network_error'
  | 'form_validation_error'
  | 'element_not_found'
  | 'platform_change'
  | 'captcha_detected'
  | 'login_required'
  | 'rate_limit'
  | 'unknown';

export interface WebViewError {
  type: WebViewErrorType;
  message: string;
  details?: unknown;
}

export interface PlatformSelectors {
  title?: string;
  description?: string;
  price?: string;
  category?: string;
  brand?: string;
  condition?: string;
  submit?: string;
  imageInput?: string;
}