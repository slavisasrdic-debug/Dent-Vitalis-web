import posters from './video-posters.json' with { type: 'json' };
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import mobileOptimization from './mobile-video-optimization.json' with { type: 'json' };

export type VideoName = keyof typeof posters;
export interface BackgroundVideoSource {
  name: VideoName;
  media: string;
}
export const heroVideos = {
  desktop: { name: 'Dentvitalis_video-left', media: '(min-width: 480px)' },
  mobile: { name: 'DV-MObile-video01_3', media: '(max-width: 479px)' },
} satisfies Record<string, BackgroundVideoSource>;

// SSR/build only: original names and bytes stay intact. A changed file gets a
// new cache key automatically, without publishing a second copy of each video.
const videoFiles = Object.fromEntries(
  Object.keys(posters).map((name) => [
    name,
    Object.fromEntries(
      ['mp4', 'webm'].map((format) => {
        const path =
          name === 'DV-MObile-video01_3' && format === 'mp4'
            ? mobileOptimization.path
            : `/assets/video/${name}_${format}.${format}`;
        const bytes = readFileSync(join(process.cwd(), 'public', path));
        const version = createHash('sha256').update(bytes).digest('hex');
        return [format, `${path}?v=${version}`];
      }),
    ),
  ]),
);

export function videoUrl(name: VideoName, format: 'mp4' | 'webm') {
  const url = videoFiles[name]?.[format];
  if (!url) throw new Error(`Unknown background video: ${name} (${format})`);
  return url;
}

export function videoPoster(name: VideoName) {
  const poster = posters[name];
  return {
    ...poster,
    srcset: poster.variants
      .map((variant) => `${variant.src} ${variant.width}w`)
      .join(', '),
  };
}
