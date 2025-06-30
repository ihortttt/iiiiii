// Типы для различных видов собираемых данных
export interface EmailData {
  id: string;
  email: string;
  domain: string;
  isValid: boolean;
  source: string;
  timestamp: Date;
  verified: boolean;
}

export interface CookieData {
  id: string;
  name: string;
  value: string;
  domain: string;
  path: string;
  expires?: Date;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  source: string;
  timestamp: Date;
}

export interface WebRTCData {
  id: string;
  localIP: string;
  publicIP?: string;
  stunServers: string[];
  iceServers: string[];
  connectionState: string;
  source: string;
  timestamp: Date;
}

export interface FingerprintData {
  id: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  canvasFingerprint: string;
  audioFingerprint: string;
  webglFingerprint: string;
  source: string;
  timestamp: Date;
}

export interface AuthData {
  id: string;
  type: 'login' | 'password' | 'token';
  value: string;
  username?: string;
  domain: string;
  isHashed: boolean;
  strength?: 'weak' | 'medium' | 'strong';
  source: string;
  timestamp: Date;
}

export interface PhoneData {
  id: string;
  phone: string;
  country: string;
  region?: string;
  carrier?: string;
  type: 'mobile' | 'landline' | 'voip';
  isValid: boolean;
  source: string;
  timestamp: Date;
}

export interface AddressData {
  id: string;
  fullAddress: string;
  street?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  coordinates?: { lat: number; lng: number };
  source: string;
  timestamp: Date;
}

export interface CardData {
  id: string;
  cardNumber: string; // Замаскированный номер
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  expiryDate?: string;
  holderName?: string;
  isValid: boolean;
  source: string;
  timestamp: Date;
}

export interface LicenseData {
  id: string;
  licenseNumber: string;
  type: 'driver' | 'business' | 'professional' | 'other';
  issuer?: string;
  expiryDate?: Date;
  holderName?: string;
  region?: string;
  source: string;
  timestamp: Date;
}

export interface DataStats {
  emails: number;
  cookies: number;
  webrtc: number;
  fingerprints: number;
  auth: number;
  phones: number;
  addresses: number;
  cards: number;
  licenses: number;
  total: number;
}