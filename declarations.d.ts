declare module 'react-native-qrcode-styled' {
  import { ComponentType, ReactElement } from 'react';
  import { SvgProps, ImageProps } from 'react-native-svg';
  import { ColorValue } from 'react-native';

  type GradientType = 'linear' | 'radial';

  type LinearGradientProps = {
    colors?: ColorValue[];
    start?: [number, number];
    end?: [number, number];
    locations?: number[];
  };

  type RadialGradientProps = {
    colors?: ColorValue[];
    center?: [number, number];
    radius?: [number, number];
    locations?: number[];
  };

  type GradientProps = {
    type?: GradientType;
    options?: LinearGradientProps | RadialGradientProps;
  };

  type EyePosition = 'topLeft' | 'topRight' | 'bottomLeft';

  type EyeOptions = {
    scale?: SvgProps['scale'];
    rotation?: string | number;
    borderRadius?: number | number[];
    color?: ColorValue;
    gradient?: GradientProps;
    stroke?: ColorValue;
    strokeWidth?: number;
  };

  type AllEyesOptions = { [K in EyePosition]?: EyeOptions };

  type LogoArea = {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  type LogoOptions = {
    hidePieces?: boolean;
    padding?: number;
    scale?: number;
    onChange?: (logoArea?: LogoArea) => void;
  } & ImageProps;

  type RenderCustomPieceItem = ({
    x,
    y,
    pieceSize,
    qrSize,
    bitMatrix,
  }: {
    x: number;
    y: number;
    pieceSize: number;
    qrSize: number;
    bitMatrix: number[][];
  }) => ReactElement | null;

  interface QRCodeStyledProps extends SvgProps {
    data: string | string[];
    style?: object;
    padding?: number;
    pieceSize?: number;
    pieceScale?: SvgProps['scale'];
    pieceRotation?: SvgProps['rotation'];
    pieceCornerType?: 'rounded' | 'cut';
    pieceBorderRadius?: number | number[];
    pieceStroke?: ColorValue;
    pieceStrokeWidth?: number;
    pieceLiquidRadius?: number;
    isPiecesGlued?: boolean;
    outerEyesOptions?: EyeOptions | AllEyesOptions;
    innerEyesOptions?: EyeOptions | AllEyesOptions;
    color?: ColorValue;
    gradient?: GradientProps;
    logo?: LogoOptions;
    backgroundImage?: ImageProps;
    version?: number;
    maskPattern?: number;
    toSJISFunc?: (data: string) => any;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    renderCustomPieceItem?: RenderCustomPieceItem;
    renderBackground?: (
      pieceSize: number,
      bitMatrix: number[][]
    ) => SvgProps['children'];
    children?: (
      pieceSize: number,
      bitMatrix: number[][]
    ) => SvgProps['children'];
  }

  const QRCodeStyled: ComponentType<QRCodeStyledProps>;

  export default QRCodeStyled;
}
