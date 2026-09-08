import posters from './video-posters.json';

export type VideoName = keyof typeof posters;
export interface BackgroundVideoSource {
  name: VideoName;
  media: string;
}
export const heroVideos = {
  desktop: { name: 'Dentvitalis_video-left', media: '(min-width: 480px)' },
  mobile: { name: 'DV-MObile-video01_3', media: '(max-width: 479px)' },
} satisfies Record<string, BackgroundVideoSource>;

export function videoPoster(name: VideoName) {
  const poster = posters[name];
  return {
    ...poster,
    srcset: poster.variants
      .map((variant) => `${variant.src} ${variant.width}w`)
      .join(', '),
  };
}
