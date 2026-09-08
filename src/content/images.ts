import homeAssets from './home-assets.json';
import innerAssets from './inner-assets.json';
const assets = { ...homeAssets, ...innerAssets };
export type ImageKey = keyof typeof assets;
// A preload and its image must use identical, encoded responsive candidates.
const imageUrl = (path: string) =>
  path.split('/').map(encodeURIComponent).join('/');
export function imageAttributes(image: string) {
  const asset = assets[image as ImageKey];
  if (!asset) throw new Error(`Unknown source image: ${image}`);
  return {
    src: imageUrl(asset.src),
    width: 'width' in asset ? asset.width : undefined,
    height: 'height' in asset ? asset.height : undefined,
    srcset:
      'variants' in asset
        ? asset.variants
            .map((variant) => `${imageUrl(variant.src)} ${variant.width}w`)
            .join(', ')
        : undefined,
  };
}
