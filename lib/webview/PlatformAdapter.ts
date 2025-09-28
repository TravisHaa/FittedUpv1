import type { PlatformId } from './JavaScriptInjectionEngine';

export interface ListingData {
  title?: string;
  description?: string;
  category?: string;
  brand?: string;
  condition?: string;
  aesthetic?: string;
  price?: number;
  material?: string;
  images?: Array<{ data: string; mimeType?: string }>;
}

export interface FormFillField {
  selector: string;
  value: string | number;
}

export interface AdapterPlan {
  url: string;
  fields: FormFillField[];
}

export abstract class PlatformAdapter {
  abstract platform: PlatformId;
  abstract sellUrl: string;

  public abstract buildPlan(data: ListingData): AdapterPlan;
}

export class DepopAdapter extends PlatformAdapter {
  platform: PlatformId = 'depop';
  sellUrl = 'https://www.depop.com/sell';

  public buildPlan(data: ListingData): AdapterPlan {
    const fields: FormFillField[] = [];
    if (data.title) fields.push({ selector: 'input[name="title"], input[placeholder*="title" i]', value: data.title });
    if (data.description) fields.push({ selector: 'textarea[name="description"], textarea[placeholder*="description" i]', value: data.description });
    if (data.price != null) fields.push({ selector: 'input[name="price"], input[placeholder*="price" i]', value: data.price });
    if (data.brand) fields.push({ selector: 'input[name="brand"], input[placeholder*="brand" i]', value: data.brand });
    if (data.category) fields.push({ selector: 'select[name="category"], input[name="category"]', value: data.category });
    if (data.condition) fields.push({ selector: 'select[name="condition"], input[name="condition"]', value: data.condition });
    return { url: this.sellUrl, fields };
  }
}

export class EbayAdapter extends PlatformAdapter {
  platform: PlatformId = 'ebay';
  sellUrl = 'https://www.ebay.com/sl/sell';
  public buildPlan(data: ListingData): AdapterPlan {
    const fields: FormFillField[] = [];
    if (data.title) fields.push({ selector: 'input[name="title"], input#editpane_title', value: data.title });
    if (data.description) fields.push({ selector: 'textarea[name="description"], div[contenteditable="true"]', value: data.description });
    if (data.price != null) fields.push({ selector: 'input[name="binPrice"], input[name*="price" i]', value: data.price });
    if (data.brand) fields.push({ selector: 'input[name*="brand" i]', value: data.brand });
    return { url: this.sellUrl, fields };
  }
}

export class FacebookAdapter extends PlatformAdapter {
  platform: PlatformId = 'facebook';
  sellUrl = 'https://www.facebook.com/marketplace/create/item';
  public buildPlan(data: ListingData): AdapterPlan {
    const fields: FormFillField[] = [];
    if (data.title) fields.push({ selector: 'input[aria-label="Title"], input[name="title"]', value: data.title });
    if (data.price != null) fields.push({ selector: 'input[aria-label="Price"], input[name="price"]', value: data.price });
    if (data.description) fields.push({ selector: 'textarea[aria-label="Description"], textarea[name="description"]', value: data.description });
    return { url: this.sellUrl, fields };
  }
}

