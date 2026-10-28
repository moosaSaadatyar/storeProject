export interface ISettingsAbout {
  longText?: string;
  experienceYears?: number;
  strengths?: string[];
  values?: string[];
}

export interface IWhyUsItem {
  title: string;
  description?: string;
  icon?: string;
}

export interface IHomeStep {
  title: string;
  description?: string;
}

export interface ISettingsHome {
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroImage?: string;
  whyUs?: IWhyUsItem[];
  steps?: IHomeStep[];
}

/**
 * تنظیمات سایت (سند واحد)
 */
export interface ISiteSettings {
  _id?: string;
  siteName?: string;
  logo?: string;
  shortDescription?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  mapLink?: string;
  workHours?: string;
  instagram?: string;
  telegram?: string;
  about?: ISettingsAbout;
  home?: ISettingsHome;
}
