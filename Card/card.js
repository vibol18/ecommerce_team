


const productCards = document.querySelectorAll(".product-card");


productCards.forEach((card) => {
  const sizeBtn = card.querySelectorAll(".size-btn");
  const cartBtn = card.querySelector(".add-to-cart");
  const productTitle = card.querySelector(".product-name");

  const productName = productTitle?.textContent?.trim() || "Product";
  let selectedSizeBtn = null;

  sizeBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeBtn.forEach((size) => size.classList.remove("active"));
      btn.classList.add("active");
      selectedSizeBtn = btn;
    });
  });

  cartBtn?.addEventListener("click", () => {
    const SizeBtnselect =
      selectedSizeBtn || card.querySelector(".size-btn.active");

    if (!SizeBtnselect) {
      alert("Please choose a size first!");
      return;
    }

    const sizeValue = SizeBtnselect.textContent.trim();
    alert(
      `The product is added to cart\nProduct: ${productName}\nSize: ${sizeValue}`,
    );

    cartBtn.textContent = "Added!";
    cartBtn.style.background = "#7f4a2b";

    setTimeout(() => {
      cartBtn.textContent = "Add to cart";
      cartBtn.style.background =
        "linear-gradient(120deg, var(--accent), #ca552a)";
    }, 2500);
  });
});
