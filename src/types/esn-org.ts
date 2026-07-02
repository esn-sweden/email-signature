// Social media which are currently not in ESN Accounts
interface OptionalSocials {
  bluesky?: string;
  youtube?: string;
  linkedinOrg?: string;
  tiktok?: string;
  flickr?: string;
  whatsapp?: string;
  skype?: string;
}

export interface ESNOrg extends OptionalSocials {
  label: string;
  code: string;
  website: string;
  address: string;
  facebook: string;
  instagram: string;
  x: string;
  logo: string;
}

export interface ExtraSocialMedia {
  [code: string]: OptionalSocials;
}
