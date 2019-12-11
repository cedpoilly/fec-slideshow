const buildShadowRoot = (html, elem) => {
  const template = document.createElement("template");
  template.innerHTML = html;
  typeof ShadyCSS !== "undefined" && ShadyCSS.prepareTemplate(template, elem.localName);

  const shadowRoot = elem.attachShadow({ mode: `open` });
  shadowRoot.appendChild(template.content.cloneNode(true), true);

  typeof ShadyCSS !== "undefined" && ShadyCSS.styleElement(elem);
  return shadowRoot;
};

/**
 * Slideshow component based on this article
 * `https://mrsunshyne.gitlab.io/blog/a-slideshow-using-css-animations-custom-properties/`
 *
 * @class FecSlideshow
 * @extends {HTMLElement}
 *
 * @property {Array<string>} images a list or urls to the images
 * @property {number} slideDuration duration of a slide in milliseconds
 */
class FecSlideshow extends HTMLElement {
  _images = [];
  _slideDuration = 0; // ms
  _preload = false;

  constructor() {
    super();

    const style = /* css */ `
    <style>
      :host {
        height: 100vh;
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;

     
      }

      .home-hero {
        height: 100vh;
        width: 100%;
        margin: auto;
        position: relative;

        display: flex;
        justify-content: center;
        align-items: center;

        --fadeDuration: calc(var(--duration) / var(--numberOfImages));
        --delayDuration: calc(var(--fadeDuration) / 2);
      }

      .slideshow {
        position: absolute;
        --current-bg: var(--bg1);
        background-image: var(--current-bg);

        background-size: cover;

        height: 100%;
        width: 100%;
      }

      .slideshow1 {
        animation: changeImage var(--duration) linear infinite,
          fade var(--fadeDuration) linear infinite;
      }
      .slideshow2 {
        animation: changeImage var(--duration) var(--delayDuration) linear
            infinite,
          fade var(--fadeDuration) var(--delayDuration) linear infinite;
      }

      @keyframes changeImage {
        0% {
          --current-bg: var(--bg1);
        }
        20% {
          --current-bg: var(--bg2);
        }
        40% {
          --current-bg: var(--bg3);
        }
        60% {
          --current-bg: var(--bg4);
        }
        80% {
          --current-bg: var(--bg5);
        }
        100% {
          --current-bg: var(--bg1);
        }
      }

      @keyframes fade {
        25% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
        75% {
          opacity: 1;
        }
      }
    </style>
`;
    const html = /* html*/ `
      <div class="home-hero">
        <div class="slideshow slideshow1"></div>
        <div class="slideshow slideshow2"></div>
        <div class="description"></div>
      </div>
    `;
    buildShadowRoot(`${style}${html}`, this);
    this.elems = {
      elem: this.shadowRoot.querySelector("selector")
    };
  }

  get slideDuration() {
    return this.getAttribute("slide-duration");
  }

  set slideDuration(val) {
    return this.setAttribute("slide-duration", val);
  }

  get preload() {
    return this.getAttribute("preload");
  }

  set preload(value) {
    this.setAttribute("preload", value);
    return this.getAttribute("preload");
  }

  get images() {
    return this._images;
  }

  set images(val) {
    if (!val) {
      return;
    }

    this._images = [...val];

    const main = this.shadowRoot.querySelector(`.home-hero`);
    this._setImageCustomProperties(main, val);
    this._setControlCustomProperties(main);

    if (JSON.parse(this.preload)) {
      console.log(JSON.parse(this.preload));
      this._preloadImages(this.images);
    }

    return this._images;
  }

  _setControlCustomProperties(main) {
    // #contain-the-gross
    this._setOneProperty(main, "--numberOfImages", this._images.length);

    const duration = this.slideDuration ? parseInt(this.slideDuration) : 4000;
    this._setOneProperty(main, "--duration", `${this._images.length * (duration / 1000)}s`);

    this._setOneProperty(main, "--fadeDuration", `calc(var(--duration) / var(--numberOfImages))`);

    this._setOneProperty(main, "--delayDuration", `calc(var(--fadeDuration) / 2)`);
  }

  _setImageCustomProperties(main, images) {
    const setImageCustomProperty = (link, index) => {
      const name = `--bg${index + 1}`;
      const value = `url("${link}")`;
      this._setOneProperty(main, name, value);
    };

    images.forEach(setImageCustomProperty);
  }

  _setOneProperty(main, name, value) {
    main.style.setProperty(name, value);
  }

  _preloadImages(images) {
    const head = document.querySelector("head");
    images.forEach(imageLink => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = imageLink;
      head.appendChild(link);
    });
  }
}

customElements.define("fec-slideshow", FecSlideshow);
