import Image, { ImageProps } from 'next/image';

export default function MDXImage({ alt, ...props }: ImageProps) {
  if (!alt) {
    console.warn('MDXImage: Alt text is required for accessibility');
  }
  
  return (
    <Image
      alt={alt || ''} // Fallback to empty string for truly decorative images
      {...props}
      sizes={props.sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 800px"}
    />
  );
} 