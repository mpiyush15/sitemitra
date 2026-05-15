export function scrollToPageTop(behavior: ScrollBehavior = "auto") {
  window.scrollTo({ top: 0, left: 0, behavior });
}

export function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth") {
  const id = hash.replace(/^#/, "").split("?")[0];
  if (!id) return false;

  const target = document.getElementById(id);
  if (!target) return false;

  target.scrollIntoView({ behavior, block: "start" });
  return true;
}

export function scrollForHref(href: string, behavior: ScrollBehavior = "smooth") {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) {
    scrollToPageTop("auto");
    return;
  }

  const hash = href.slice(hashIndex);
  window.setTimeout(() => {
    if (!scrollToHash(hash, behavior)) {
      scrollToPageTop("auto");
    }
  }, 50);
}

export function hrefHasHash(href: string) {
  return href.includes("#");
}
