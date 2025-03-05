/**
 * Common props for all segment components
 */
export interface SegmentProps {
  foreground: string;
  background: string;
  style?: string;
}

/**
 * Git segment configuration
 */
export interface GitSegmentConfig {
  branch?: string;
  ahead?: number;
  behind?: number;
  dirty?: boolean;
  added?: number;
  modified?: number;
  deleted?: number;
  showStatus?: boolean;
  showAheadBehind?: boolean;
  showStashCount?: boolean;
  stashCount?: number;
}

/**
 * Battery segment configuration
 */
export interface BatterySegmentConfig {
  percentage?: number;
  charging?: boolean;
  showPercentage?: boolean;
  lowThreshold?: number;
  colorByPercentage?: boolean;
}

/**
 * Weather segment configuration
 */
export interface WeatherSegmentConfig {
  condition?: string;
  temperature?: number;
  unit?: 'C' | 'F';
  showCity?: boolean;
  city?: string;
  showCondition?: boolean;
}

/**
 * Spotify segment configuration
 */
export interface SpotifySegmentConfig {
  songName?: string;
  artist?: string;
  playing?: boolean;
  maxLength?: number;
  showIcon?: boolean;
  showPlayingStatus?: boolean;
  showArtist?: boolean;
  spotifySpecific?: boolean;
}

/**
 * Time segment configuration
 */
export interface TimeSegmentConfig {
  timeFormat?: string;
  dateFormat?: string;
  showDate?: boolean;
  showTime?: boolean;
  showIcons?: boolean;
  timezone?: string;
}

/**
 * Path segment configuration
 */
export interface PathSegmentConfig {
  style?: 'folder' | 'full' | 'short';
  folderIcon?: string;
  homeIcon?: string;
  folderSeparator?: string;
  maxDepth?: number;
  enableHyperlink?: boolean;
}

/**
 * OS segment configuration
 */
export interface OSSegmentConfig {
  windows?: string;
  macos?: string;
  linux?: string;
  ubuntu?: string;
  wsl?: string;
  showAlways?: boolean;
}

/**
 * Text segment configuration
 */
export interface TextSegmentConfig {
  text: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Command segment configuration
 */
export interface CommandSegmentConfig {
  command: string;
  shell?: string;
  args?: string[];
  timeout?: number;
}

/**
 * Complete segment type with configuration
 */
export interface SegmentType {
  type: string;
  foreground: string;
  background: string;
  style?: string;
  config: GitSegmentConfig | BatterySegmentConfig | WeatherSegmentConfig | SpotifySegmentConfig |
         TimeSegmentConfig | PathSegmentConfig | OSSegmentConfig | TextSegmentConfig |
         CommandSegmentConfig | any;
}
