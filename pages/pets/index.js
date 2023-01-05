'use strict';

import { createElement } from '../../modules/createElement.js'
import { moveNextSlide, returnPrevSlide } from '../../modules/changeSlide.js'

const hamburger = document.querySelector(".header__burger");
const nav = document.querySelector(".nav");
const overlay = document.querySelector(".overlay");
const body = document.querySelector("body");

function toggleMenu() {
  hamburger.classList.toggle("open");
  nav.classList.toggle("open");
  toggleOverlay();
}

function toggleOverlay() {
  overlay.classList.toggle("show");
  body.classList.toggle("no-scroll");
}

function checkOverlay() {
  const modal = document.querySelector('.modal');
  if (hamburger.classList.contains("open")) {
    toggleMenu();
  }
  if (modal !== null && modal.classList.contains("open")) {
    closeModal();
  }
}

function closeMenu(event) {
  if (event.target.classList.contains("nav__link")) {
    hamburger.classList.remove("open");
    nav.classList.remove("open");
    overlay.classList.remove("show");
    body.classList.remove("no-scroll");
  }
}
hamburger.addEventListener("click", toggleMenu);
nav.addEventListener("click", closeMenu);
overlay.addEventListener("click", checkOverlay);

const slidesContainer = document.querySelector(".slider__list");
const nextPage = document.querySelector(".pagination__button--next");
const prevPage = document.querySelector(".pagination__button--prev");
const currentPage = document.querySelector(".pagination__button--page");
const firstPage = document.querySelector(".pagination__button--first");
const lastPage = document.querySelector(".pagination__button--last");

fetch('../../assets/pets.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    definePetsPageWidth();
    createDeafaultSlider(data);
  });

  function createPetCard(pet) {
    const petCard = createElement(slidesContainer, 'li', ['slider__item', 'slide'], '', '');
    const petCardWrapper = createElement(petCard, 'div', ['slider__link'], '', '');
    createElement(petCardWrapper, 'img', ['slider__image'], '', {'src': `${pet.img}`});
    const petCardInner = createElement(petCardWrapper, 'div', ['slider__inner'], '', '');
    createElement(petCardInner, 'h3', ['slider__card-name', 'title', 'h3'], `${pet.name}`, '');
    const btnMore = createElement(petCardInner, 'button', ['slider__button-more', 'button', 'button--more'], 'Learn more', {'type': 'button'});
    btnMore.addEventListener('click', () =>
      createModal(pet)
    );
  }

let numberOfCards = null;
let numberOfPages = null;

function definePetsPageWidth() {
  const width = document.documentElement.offsetWidth;
  if (768 <= width && width < 1280) {
    numberOfCards = 6;
    numberOfPages = 8;
  } else if (768 > width) {
    numberOfCards = 3;
    numberOfPages = 16;
  } else {
    numberOfCards = 8;
    numberOfPages = 6;
  }
  return numberOfCards, numberOfPages;
}

function createDefaultCards(pets) {
  pets.forEach(pet => createPetCard(pet));
}

function replaceDefaultCards(pets) {
  const items = document.querySelectorAll('.slide');
  items.forEach(element => element.classList.add('old'));
  createDefaultCards(pets);
  const oldItems = document.querySelectorAll('.old');
  oldItems.forEach(element => element.remove());
}

function shufflePets(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function addDisabledNext() {
  nextPage.setAttribute("disabled", "");
  lastPage.setAttribute("disabled", "");
}

function removeDisabledNext() {
  nextPage.removeAttribute("disabled", "");
  lastPage.removeAttribute("disabled", "");
}

function addDisabledPrev() {
  prevPage.setAttribute("disabled", "");
  firstPage.setAttribute("disabled", "");
}

function removeDisabledPrev() {
  prevPage.removeAttribute("disabled", "");
  firstPage.removeAttribute("disabled", "");
}

function createDeafaultSlider(pets) {
  const allPets = [];
  let page = 0;

  for (let i = 0; i < numberOfPages; i++) {
    const currentPagePetsArray = shufflePets(pets);
    currentPagePetsArray.forEach(element => allPets.push(element));
  }

  createDefaultCards(allPets.slice(0, numberOfCards));
  page++;

  let prevPageNum = 0;

  nextPage.addEventListener("click", () => {
    page++;
    prevPageNum = page - 1;
    currentPage.textContent = page;
    replaceDefaultCards(allPets.slice(numberOfCards * prevPageNum, numberOfCards * page));
    moveNextSlide(slidesContainer);
    if (page >= numberOfPages) {
      addDisabledNext();
    }
    removeDisabledPrev();
  });
  
  prevPage.addEventListener("click", () => {
    page--;
    prevPageNum = page - 1;
    currentPage.textContent = page;
    replaceDefaultCards(allPets.slice(numberOfCards * prevPageNum, numberOfCards * page));
    returnPrevSlide(slidesContainer);
    if (page <= 1) {
      addDisabledPrev();
    }
    removeDisabledNext();
  });

  lastPage.addEventListener("click", () => {
    page = numberOfPages;
    prevPageNum = page - 1;
    currentPage.textContent = page;
    replaceDefaultCards(allPets.slice(numberOfCards * prevPageNum, numberOfCards * page));
    addDisabledNext();
    removeDisabledPrev();
  });

  firstPage.addEventListener("click", () => {
    page = 1;
    prevPageNum = page - 1;
    currentPage.textContent = page;
    replaceDefaultCards(allPets.slice(numberOfCards * prevPageNum, numberOfCards * page));
    addDisabledPrev();
    removeDisabledNext();
  });
}

function closeModal() {
  const modal = document.querySelector('.modal');
  modal.remove();
  toggleOverlay();
}

const container = document.querySelector('.container');

function createModal(pet) {
  const modal = createElement(container, 'section', ['modal'], '', {'data-id': `${pet.id}`});
  const closeModalIcon = createElement(modal, 'button', ['modal__close', 'control-button'], '', '');
  createElement(closeModalIcon, 'img', ['modal__icon'], '', {'src': '../../assets/icons/close.svg'});

  const modalWrapper = createElement(modal, 'div', ['modal__wrapper'], '', '');
  createElement(modalWrapper, 'img', ['modal__img'], '', {'src': `${pet.img}`});
  const modalInner = createElement(modalWrapper, 'div', ['modal__inner'], '', '');
  createElement(modalInner, 'h3', ['modal__title', 'h3', 'title'], `${pet.name}`, '');
  createElement(modalInner, 'p', ['modal__subtitle', 'h4', 'title'], `${pet.type} - ${pet.breed}`, '');
  createElement(modalInner, 'p', ['modal__desc', 'title'], `${pet.description}`, '');
  const list = createElement(modalInner, 'ul', ['modal__list', 'title'], '', '');
  createElement(list, 'li', ['modal__item'], `<span class="modal__field">Age:</span> ${pet.age}`, '');
  createElement(list, 'li', ['modal__item'], `<span class="modal__field">Inoculations:</span> ${pet.inoculations}`, '');
  createElement(list, 'li', ['modal__item'], `<span class="modal__field">Diseases:</span> ${pet.diseases}`, '');
  createElement(list, 'li', ['modal__item'], `<span class="modal__field">Parasites:</span> ${pet.parasites}`, '');
  modal.classList.add('open');

  toggleOverlay();

  closeModalIcon.addEventListener('click', closeModal);
}