declare module 'react-native-qrcode-styled' {
  import { ComponentType } from 'react';
  import { SvgProps } from 'react-native-svg';

  // Options pour les yeux (inner et outer)
  interface EyeOptions {
    outerColor?: string;
    innerColor?: string;
    borderWidth?: number;
    borderColor?: string;
  }

  // Options pour le dégradé
  interface GradientProps {
    type: 'linear' | 'radial';
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  }

  // Définition du logo
  interface LogoOptions {
    uri: string; // URI pour l'image du logo
    width?: number; // Largeur du logo
    height?: number; // Hauteur du logo
    backgroundColor?: string; // Couleur de fond du logo
  }

  // Propriétés principales du QR Code
  interface QRCodeStyledProps extends SvgProps {
    data: string | string[]; // Message à encoder dans le QR Code
    style?: object; // Style personnalisé pour le QR Code
    padding?: number; // Padding autour du QR code
    pieceSize?: number; // Taille de chaque élément du QR Code
    pieceScale?: number; // Échelle de chaque élément du QR Code
    pieceRotation?: number; // Rotation des éléments du QR Code (en degrés)
    pieceCornerType?: 'rounded' | 'cut'; // Type des coins des éléments du QR code
    pieceBorderRadius?: number | number[]; // Rayon de bord des éléments du QR Code
    pieceStroke?: string; // Couleur de la bordure des éléments
    pieceStrokeWidth?: number; // Largeur de la bordure des éléments
    pieceLiquidRadius?: number; // Rayon de l'effet de liquide entre les pièces
    isPiecesGlued?: boolean; // Si les pièces du QR code sont "collées" entre elles
    outerEyesOptions?: EyeOptions; // Options pour les yeux extérieurs
    innerEyesOptions?: EyeOptions; // Options pour les yeux intérieurs
    color?: string; // Couleur des éléments du QR Code
    gradient?: GradientProps; // Gradient appliqué au QR Code
    logo?: LogoOptions; // Configuration du logo
    backgroundImage?: { uri: string }; // Image de fond pour le QR Code
    version?: number; // Version du QR Code
    maskPattern?: number; // Modèle de masque pour le QR Code
    toSJISFunc?: (data: string) => any; // Fonction de conversion en SJIS
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'; // Niveau de correction d'erreur
    renderCustomPieceItem?: (pieceSize: number, bitMatrix: number[][]) => JSX.Element; // Rendu personnalisé pour chaque élément
    renderBackground?: (pieceSize: number, bitMatrix: number[][]) => JSX.Element; // Rendu de l'arrière-plan
    children?: (pieceSize: number, bitMatrix: number[][]) => JSX.Element; // Composants supplémentaires à ajouter
  }

  const QRCodeStyled: ComponentType<QRCodeStyledProps>;

  export default QRCodeStyled;
}
