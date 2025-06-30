export interface ProxyConfig {
  id: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
  protocol: 'http' | 'https' | 'socks4' | 'socks5';
  isActive: boolean;
  lastChecked: Date;
  status: 'working' | 'failed' | 'checking';
  responseTime: number;
  country?: string;
  anonymityLevel: 'transparent' | 'anonymous' | 'elite';
}

export interface DNSConfig {
  id: string;
  name: string;
  primary: string;
  secondary?: string;
  isActive: boolean;
  responseTime: number;
  reliability: number;
  provider: string;
}

export interface CookieConfig {
  domain: string;
  name: string;
  value: string;
  path: string;
  expires?: Date;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
}

export interface FingerprintConfig {
  userAgent: string;
  viewport: { width: number; height: number };
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  screenResolution: { width: number; height: number };
  colorDepth: number;
  pixelRatio: number;
  hardwareConcurrency: number;
  deviceMemory: number;
  webglVendor: string;
  webglRenderer: string;
  audioFingerprint: string;
  canvasFingerprint: string;
}

export interface WebRTCConfig {
  enabled: boolean;
  stunServers: string[];
  turnServers: string[];
  iceTransportPolicy: 'all' | 'relay';
  localIPs: string[];
  publicIP?: string;
}

export interface AuthConfig {
  email?: string;
  login?: string;
  password?: string;
  tokens: { [key: string]: string };
  cookies: CookieConfig[];
  sessionStorage: { [key: string]: string };
  localStorage: { [key: string]: string };
}

export interface ParsingRule {
  id: string;
  name: string;
  selector: string;
  attribute?: string;
  regex?: string;
  isEnabled: boolean;
  dataType: 'text' | 'link' | 'image' | 'email' | 'phone' | 'price' | 'date';
  required: boolean;
  description: string;
}

export interface SiteConfig {
  id: string;
  url: string;
  name: string;
  isActive: boolean;
  parsingRules: ParsingRule[];
  authConfig?: AuthConfig;
  customHeaders: { [key: string]: string };
  delay: number;
  retryCount: number;
  timeout: number;
  followRedirects: boolean;
  validateSSL: boolean;
}

export interface AIAssistant {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'local' | 'free';
  apiKey?: string;
  model: string;
  isActive: boolean;
  permissions: {
    canModifyCode: boolean;
    canAccessDatabase: boolean;
    canManageProxies: boolean;
    canManageSites: boolean;
    canViewLogs: boolean;
  };
  restrictions: {
    maxRequestsPerHour: number;
    allowedDomains: string[];
    forbiddenActions: string[];
  };
}

export interface VoiceConfig {
  enabled: boolean;
  gender: 'female' | 'male';
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
  language: string;
}

export interface ParsedData {
  id: string;
  siteId: string;
  url: string;
  timestamp: Date;
  data: { [key: string]: any };
  status: 'success' | 'partial' | 'failed';
  errors?: string[];
  processingTime: number;
}

export interface DatabaseStats {
  totalRecords: number;
  recordsByType: { [key: string]: number };
  recordsBySite: { [key: string]: number };
  recordsByDate: { [key: string]: number };
  storageUsed: number;
  lastUpdate: Date;
}