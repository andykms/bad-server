import { fileTypeFromFile } from 'file-type';
import { readFile } from 'fs/promises';

const SIGNATURES = {
  PNG: [0x89, 0x50, 0x4E, 0x47],
  JPEG: [0xFF, 0xD8, 0xFF],
  GIF: [0x47, 0x49, 0x46],
  SVG: [0x3C, 0x3F, 0x78, 0x6D, 0x6C], // <?xml
  SVG_ALT: [0x3C, 0x73, 0x76, 0x67] // <svg
};

export const isValidImageSignature = async (filePath: string): Promise<boolean> => {
  try {
    const fileType = await fileTypeFromFile(filePath);
    
    if (fileType) {
      const validTypes = [
        'image/png',
        'image/jpeg', 
        'image/gif',
        'image/svg+xml'
      ];
      return validTypes.includes(fileType.mime);
    }

    const buffer = await readFile(filePath);
    const uintArray = new Uint8Array(buffer);

    // Проверка PNG
    if (checkSignature(uintArray, SIGNATURES.PNG)) return true;
    
    // Проверка JPEG
    if (checkSignature(uintArray, SIGNATURES.JPEG)) return true;
    
    // Проверка GIF
    if (checkSignature(uintArray, SIGNATURES.GIF)) return true;
    
    // Проверка SVG (текстовый формат)
    if (checkSignature(uintArray, SIGNATURES.SVG) || checkSignature(uintArray, SIGNATURES.SVG_ALT)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking file signature:', error);
    return false;
  }
};

const checkSignature = (uintArray: Uint8Array, signature: number[]): boolean => {
  if (uintArray.length < signature.length) return false;
  
  for (let i = 0; i < signature.length; i++) {
    if (uintArray[i] !== signature[i]) return false;
  }
  return true;
};

export const isValidSVG = async (filePath: string): Promise<boolean> => {
  try {
    const content = await readFile(filePath, 'utf-8');
    const trimmed = content.trim();
    
    return trimmed.startsWith('<?xml') || 
           trimmed.startsWith('<svg') || 
           /^<svg\s[^>]*>/.test(trimmed) ||
           /^<\?xml[^>]*\?>\s*<svg/.test(trimmed);
  } catch {
    return false;
  }
};