import { createHash } from 'node:crypto';

const digest = value => createHash('sha256').update(value).digest('hex');
const versioned = (path, content) => `${path}?sha256=${digest(content)}`;
function replaceOnce(text, from, to) {
  if (text.split(from).length !== 2) throw new Error(`Expected one asset reference: ${from}`);
  return text.replace(from, to);
}

// Stable paths remain available to existing consumers. Content-addressed query
// strings avoid stale dependency reuse in normal URL-keyed browser/CDN caches.
// They are cache identifiers, not immutable URLs or runtime integrity checks.
export function prepareBrowserAssets({ html, app, search, style, icon, dataset }) {
  app = replaceOnce(app, "'./search.mjs'", `'${versioned('./search.mjs', search)}'`);
  app = replaceOnce(app, "'./data/dataset.json'", `'${versioned('./data/dataset.json', dataset)}'`);
  html = replaceOnce(html, 'src="./app.mjs"', `src="${versioned('./app.mjs', app)}"`);
  html = replaceOnce(html, 'href="./style.css"', `href="${versioned('./style.css', style)}"`);
  html = replaceOnce(html, 'href="./mark.svg"', `href="${versioned('./mark.svg', icon)}"`);
  return { html, app };
}
