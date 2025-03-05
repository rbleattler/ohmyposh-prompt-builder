declare module 'react-color' {
  import * as React from 'react';

  export interface ColorResult {
    hex: string;
    rgb: { r: number; g: number; b: number; a?: number };
    hsl: { h: number; s: number; l: number; a?: number };
  }

  export interface ColorPickerProps {
    color?: string | ColorResult;
    onChange?: (color: ColorResult) => void;
    onChangeComplete?: (color: ColorResult) => void;
    disableAlpha?: boolean;
  }

  export class SketchPicker extends React.Component<ColorPickerProps> {}
  export class ChromePicker extends React.Component<ColorPickerProps> {}
  export class CompactPicker extends React.Component<ColorPickerProps> {}
  export class SwatchesPicker extends React.Component<ColorPickerProps> {}
  export class TwitterPicker extends React.Component<ColorPickerProps> {}
  export class CirclePicker extends React.Component<ColorPickerProps> {}
  export class BlockPicker extends React.Component<ColorPickerProps> {}
  export class GithubPicker extends React.Component<ColorPickerProps> {}
}
