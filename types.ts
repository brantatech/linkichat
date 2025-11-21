export enum AppView {
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  NETWORKING = 'NETWORKING',
  CONTENT = 'CONTENT',
  AUDIT = 'AUDIT',
  SETTINGS = 'SETTINGS'
}

export enum ContentFramework {
  SYSTEM_REVEAL = 'SYSTEM_REVEAL',
  REALITY_CHECK = 'REALITY_CHECK',
  MINDSET_SHIFT = 'MINDSET_SHIFT',
}

export interface NetworkingResult {
  id?: string;
  timestamp?: number;
  targetName?: string;
  context: string;
  icebreaker: string;
  followUp: string;
  trustBuilder: string;
  sources?: string[];
}

export interface UserProfile {
  name: string;
  rawText: string;
  analysis?: string;
  isTrained: boolean;
  avatar?: string; // Base64 string for profile picture
  email?: string;
  networkingHistory?: NetworkingResult[];
}

export interface ContentResult {
  postBody: string;
  visualDescription: string;
}

export interface ChartData {
  name: string;
  value: number;
}