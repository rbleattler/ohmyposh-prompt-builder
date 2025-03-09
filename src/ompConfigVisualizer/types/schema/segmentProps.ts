export interface ISegmentType {
  type: string;
  style?: string;
  powerline_symbol?: boolean;
  foreground?: string;
  background?: string;
  leading_diamond?: string;
  trailing_diamond?: string;
  template?: string;
  properties?: Record<string, any>;
  config?: Record<string, any>;
}