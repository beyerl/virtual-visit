// YouTube IFrame Player API, loaded once. A RideVideo plays one cut of a video
// and reports when it ends or fails.
//
// Browsers only autoplay with sound after the page got a click or a key press
// (gamepad presses don't count). So the video starts with sound; if that is
// refused, it plays muted and `muted` tells the screen to say so.

import { nextPlaybackRate, seekTarget } from "../domain/journey.js";

const API = "https://www.youtube.com/iframe_api";
const AUTOPLAY_CHECK = 1500;
const DUCKED_VOLUME = 30;

/** @type {Promise<any> | null} */
let loading = null;

/** @param {Window & { YT?: any, onYouTubeIframeAPIReady?: () => void }} window */
function loadApi(window) {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  loading ??= new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    const s = window.document.createElement("script");
    s.src = API;
    s.onerror = () => reject(new Error("YouTube player could not be loaded"));
    window.document.head.append(s);
  });
  return loading;
}

export class RideVideo {
  /**
   * @param {Window} window
   * @param {HTMLElement} host element the player replaces
   * @param {import("../domain/journey.js").Video} video
   * @param {{ onPlaying?: () => void, onEnded?: () => void, onError?: (e: unknown) => void, onMuted?: (muted: boolean) => void }} on
   */
  constructor(window, host, video, on) {
    this.on = on;
    this.player = null;
    this.ended = false;
    this.muted = false;
    this.destroyed = false;
    this.video = video;
    /** Playback speed, kept for when the player is ready. */
    this.rate = 1;
    loadApi(window)
      .then((YT) => {
        if (this.destroyed) return;
        this.YT = YT;
        this.player = new YT.Player(host, {
          videoId: video.id,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            start: video.start ?? 0,
            ...(video.end ? { end: video.end } : {}),
          },
          events: {
            onReady: () => this.ready(),
            onStateChange: (/** @type {{ data: number }} */ e) => this.stateChanged(e.data),
            onError: (/** @type {{ data: number }} */ e) => on.onError?.(new Error(`YouTube error ${e.data}`)),
          },
        });
      })
      .catch((e) => on.onError?.(e));
  }

  ready() {
    if (this.ducked) this.player.setVolume(DUCKED_VOLUME);
    if (this.rate !== 1) this.player.setPlaybackRate?.(this.rate);
    this.player.playVideo();
    setTimeout(() => {
      if (this.destroyed || this.ended) return;
      if (this.player.getPlayerState?.() !== this.YT.PlayerState.PLAYING) {
        // Refused with sound: play muted.
        this.player.mute();
        this.player.playVideo();
        this.setMuted(true);
      }
    }, AUTOPLAY_CHECK);
  }

  /** @param {number} state */
  stateChanged(state) {
    if (state === this.YT.PlayerState.PLAYING) this.on.onPlaying?.();
    if (state === this.YT.PlayerState.ENDED && !this.ended) {
      this.ended = true;
      this.on.onEnded?.();
    }
  }

  /** @param {boolean} m */
  setMuted(m) {
    this.muted = m;
    this.on.onMuted?.(m);
  }

  toggleSound() {
    if (!this.player) return;
    if (this.muted) {
      this.player.unMute();
      this.player.playVideo();
      this.setMuted(false);
      // Unmuting without a click or key press first pauses the video: then back to muted.
      setTimeout(() => {
        if (!this.destroyed && !this.ended && this.player.getPlayerState?.() !== this.YT.PlayerState.PLAYING) {
          this.player.mute();
          this.player.playVideo();
          this.setMuted(true);
        }
      }, AUTOPLAY_CHECK);
    } else {
      this.player.mute();
      this.setMuted(true);
    }
  }

  /** Turn the video down (while the guide speaks) or back up. @param {boolean} down */
  duck(down) {
    this.ducked = down;
    this.player?.setVolume?.(down ? DUCKED_VOLUME : 100);
  }

  /**
   * Skip `delta` seconds forward (or back, if negative) within the cut. Past
   * the end, the ride ends. @param {number} delta
   * @returns {number | null} the new time, or null if nothing happened or the ride ended
   */
  seek(delta) {
    if (!this.player?.getCurrentTime || this.ended) return null;
    const t = seekTarget(this.video, this.player.getCurrentTime(), delta, this.player.getDuration?.() || undefined);
    if (t == null) {
      this.ended = true;
      this.player.pauseVideo?.();
      this.on.onEnded?.();
      return null;
    }
    this.player.seekTo(t, true);
    return t;
  }

  /** Set the playback speed (applied once the player is ready). @param {number} rate */
  setRate(rate) {
    this.rate = rate;
    this.player?.setPlaybackRate?.(rate);
  }

  /**
   * One step faster (1) or slower (-1), among the speeds the player offers.
   * @param {1 | -1} dir @returns {number} the new speed
   */
  changeRate(dir) {
    const offered = this.player?.getAvailablePlaybackRates?.();
    this.setRate(nextPlaybackRate(this.rate, dir, offered?.length ? offered : undefined));
    return this.rate;
  }

  destroy() {
    this.destroyed = true;
    try {
      this.player?.destroy();
    } catch {
      /* already gone */
    }
  }
}
