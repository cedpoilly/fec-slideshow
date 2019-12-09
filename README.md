# Front-End Coders Slideshow

An experimental web component based of an article found online (link will be available soon).

## HTML & CSS, No JavaScript

In the article no JavaScript was needed, thus for the slideshow functionality itself no JavaScript is required.
However when consuming the component JavaScript is required to set the images.

See the content of the body for this demo:

```html
<style>
  .fec-slideshow {
    height: 100vh;
    width: 100%;
  }
</style>

<script src="./fec-slideshow.js"></script>
<fec-slideshow class="fec-slideshow"></fec-slideshow>
<script>
  const slideshow = document.querySelector(".fec-slideshow");

  slideshow.preload = true;

  const images = [
    "https://picsum.photos/id/231/1000/550",
    "https://picsum.photos/id/232/1000/550",
    "https://picsum.photos/id/233/1000/550",
    "https://picsum.photos/id/234/1000/550",
    "https://picsum.photos/id/235/1000/550"
  ];

  slideshow.images = images;
</script>
```
