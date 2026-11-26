/** Removes a trailing slash, except from `/`. */
export function normalize(urlOrPath: string) {
  if (urlOrPath.length > 1 && urlOrPath.endsWith("/")) return urlOrPath.slice(0, -1);
  return urlOrPath;
}

/** Whether `href` is the current page. With `nested`, pages below `href` count too. */
export function isActive(href: string, pathname: string, nested = false): boolean {
  href = normalize(href);
  pathname = normalize(pathname);

  return href === pathname || (nested && pathname.startsWith(`${href}/`));
}
