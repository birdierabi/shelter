function moveNextSlide(slidesContainer) {
  const slideWidth = slidesContainer.clientWidth;
  slidesContainer.scrollLeft += slideWidth;
}

function returnPrevSlide(slidesContainer) {
  const slideWidth = slidesContainer.clientWidth;
  slidesContainer.scrollLeft -= slideWidth;
}

export { moveNextSlide, returnPrevSlide };