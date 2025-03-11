
export interface FunnelElement {
  id: string;
  type: 'header' | 'text' | 'cta' | 'image' | 'video' | 'form';
  content: HeaderContent | TextContent | CTAContent | ImageContent | VideoContent | FormContent;
}

export interface HeaderContent {
  title: string;
  subtitle: string;
  alignment: 'left' | 'center' | 'right';
  backgroundColor: string;
  textColor: string;
}

export interface TextContent {
  text: string;
  alignment: 'left' | 'center' | 'right';
  backgroundColor: string;
  textColor: string;
}

export interface CTAContent {
  buttonText: string;
  buttonColor: string;
  buttonTextColor: string;
  backgroundColor: string;
  alignment: 'left' | 'center' | 'right';
}

export interface ImageContent {
  imageUrl: string;
  altText: string;
  alignment: 'left' | 'center' | 'right';
  backgroundColor: string;
}

export interface VideoContent {
  videoUrl: string;
  thumbnailUrl: string;
  alignment: 'left' | 'center' | 'right';
  backgroundColor: string;
}

export interface FormContent {
  fields: FormField[];
  buttonText: string;
  buttonColor: string;
  buttonTextColor: string;
  backgroundColor: string;
  alignment: 'left' | 'center' | 'right';
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'checkbox';
  label: string;
  placeholder: string;
  required: boolean;
}

export interface Funnel {
  id: string;
  name: string;
  slug: string;
  elements: FunnelElement[];
  settings: {
    metaTitle: string;
    metaDescription: string;
    favicon: string;
    customDomain: string;
    customScripts: string;
  };
  stats: {
    views: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
  };
  createdAt: string;
  updatedAt: string;
}
