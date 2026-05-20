const images = [
  "./images/grayshoes.png",
  "./images/nike.png",
  "./images/Rogshoes.png",
  "./images/Gbblack.png",
];

let currentIndex = 0;
const mainImage = document.getElementById("mainImage");

const updateThumbnail = () => {
  const colorProduct = document.querySelectorAll(".color-product");
  colorProduct.forEach((Co, index) => {
    Co.classList.toggle("active", index === currentIndex);
  });
};
const changeImage = (ele) => {
  mainImage.src = ele.src;
  const productCl = Array.from(document.querySelectorAll(".color-product img"));
  currentIndex = productCl.findIndex((img) => img.src === ele.src);
  if (currentIndex < 0) currentIndex = 0;
  updateThumbnail();
};

const nextImage = () => {
  currentIndex = (currentIndex + 1) % images.length;
  mainImage.src = images[currentIndex];
  updateThumbnail();
};

const prevImage = () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  mainImage.src = images[currentIndex];
  updateThumbnail();
};

const setupSizeButtons = () => {
  const sizes = document.querySelectorAll(".size");
  sizes.forEach((size) => {
    size.addEventListener("click", () => {
      sizes.forEach((btn) => btn.classList.remove("active"));
      size.classList.add("active");
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  if (mainImage) {
    mainImage.src = document.querySelector(".thumbnail img")?.src || images[0];
  }
  updateThumbnail();
  setupSizeButtons();
});
