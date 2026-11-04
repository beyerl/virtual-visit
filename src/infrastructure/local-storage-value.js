/** One JSON value in localStorage (a getter, as even reading `localStorage` can throw). */
export class LocalStorageValue {
  /** @param {() => Storage} storage @param {string} key */
  constructor(storage, key) {
    this.storage = storage;
    this.key = key;
  }

  load() {
    try {
      return JSON.parse(this.storage().getItem(this.key) ?? "null");
    } catch {
      return null;
    }
  }

  /** @param {unknown} data null removes it */
  save(data) {
    try {
      if (data == null) this.storage().removeItem(this.key);
      else this.storage().setItem(this.key, JSON.stringify(data));
    } catch (e) {
      console.warn("[virtual-visit] could not save", this.key, e);
    }
  }
}
