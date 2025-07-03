import { removeBackground, loadImageFromUrl } from './backgroundRemoval';
import logoUrl from '@/assets/logo.png';

export const processLogoBackground = async (): Promise<string> => {
  try {
    // Load the current logo
    const img = await loadImageFromUrl(logoUrl);
    
    // Remove background
    const processedBlob = await removeBackground(img);
    
    // Create a new URL for the processed image
    return URL.createObjectURL(processedBlob);
  } catch (error) {
    console.error('Error processing logo:', error);
    // Return original logo if processing fails
    return logoUrl;
  }
};