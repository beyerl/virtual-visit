import { Navigator } from "../application/ports.js";

/** The page's location and history. */
export class BrowserNavigator extends Navigator {
  /** @param {Location} location @param {History} history */
  constructor(location, history) {
    super();
    this.location = location;
    this.history = history;
  }

  go(/** @type {string} */ url) {
    this.location.assign(url);
  }

  ownUrl(/** @type {string} */ hash) {
    return this.location.href.split("#")[0] + (hash ? `#${hash}` : "");
  }

  get hash() {
    return this.location.hash.replace(/^#/, "");
  }

  setHash(/** @type {string} */ hash) {
    this.history.replaceState(null, "", this.ownUrl(hash));
  }
}
