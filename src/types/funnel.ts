
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
  user_id: string;
  name: string;
  slug: string;
  description?: string;
  elements: FunnelElement[];
  settings: {
    metaTitle: string;
    metaDescription: string;
    favicon: string;
    customDomain: string;
    customScripts: string;
    showPoweredBy?: boolean;
    customCss?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  stats?: {
    views: number;
    conversions: number;
    conversionRate?: number;
    revenue: number;
  };
  is_published?: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FunnelVersion {
  id: string;
  funnel_id: string;
  version_number: number;
  elements: FunnelElement[];
  settings: any;
  created_at: string;
}

export interface FunnelDeployment {
  id: string;
  funnel_id: string;
  version_id: string;
  status: 'not_deployed' | 'deploying' | 'deployed' | 'failed';
  deployment_url?: string;
  error_message?: string;
  deployed_at: string;
  created_at: string;
}

export interface FunnelAnalytics {
  id: string;
  funnel_id: string;
  date: string;
  views: number;
  unique_visitors: number;
  conversions: number;
  revenue: number;
  created_at: string;
}
