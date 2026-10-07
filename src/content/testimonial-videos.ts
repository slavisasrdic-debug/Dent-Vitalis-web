import replacements from '../../data/testimonial-video-replacements-20261007.json';
import type { ContentBlock, InnerPage } from './inner-pages';

const newIds = new Set(replacements.replacements.map((video) => video.newId));

// Shared by cards and schema. All five languages reuse the corrected IT video
// blocks; immutable source transcriptions and other testimonial text stay intact.
export function replaceTestimonialVideos(page: InnerPage): InnerPage {
  if (page.route !== '/testimonianze') return page;
  let matches = 0;
  const update = (blocks: ContentBlock[]): ContentBlock[] =>
    blocks.map((block) => {
      if (block.type === 'group')
        return { ...block, children: update(block.children) };
      if (block.type !== 'youtube') return block;
      const replacement = replacements.replacements.find(
        (video) => video.oldId === block.videoId,
      );
      if (!replacement) return block;
      if (block.title !== (replacement.oldTitle ?? replacement.title))
        throw new Error(`Testimonial source title changed: ${block.videoId}`);
      matches++;
      return { ...block, videoId: replacement.newId, title: replacement.title };
    });
  const blocks = update(page.blocks);
  if (matches !== 10)
    throw new Error(
      `Expected ten testimonial video replacements, got ${matches}`,
    );
  return { ...page, blocks };
}

export function testimonialEmbedUrl(videoId: string, lang: string): string {
  if (!/^[\w-]{11}$/.test(videoId))
    throw new Error(`Invalid testimonial video ID: ${videoId}`);
  const base = `https://www.youtube-nocookie.com/embed/${videoId}`;
  if (!newIds.has(videoId)) return base + '?autoplay=1';
  if (!replacements.languages.includes(lang))
    throw new Error(`Unsupported video caption language: ${lang}`);
  return (
    base +
    '?' +
    new URLSearchParams({
      autoplay: '1',
      cc_load_policy: '1',
      cc_lang_pref: lang,
      hl: lang,
      playsinline: '1',
      rel: '0',
    })
  );
}

export const isReplacedTestimonialVideo = (videoId: string): boolean =>
  newIds.has(videoId);
