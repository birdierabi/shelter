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


const nextButton = document.querySelector(".slider__control-button--right");
const prevButton = document.querySelector(".slider__control-button--left");
const slidesContainer = document.querySelector(".slider__list");

fetch('../../assets/pets.json')
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    defineMainPageWidth();
    createDeafaultSlider(data);
  });


function shufflePets(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

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

function defineMainPageWidth() {
  const width = document.documentElement.offsetWidth;
  if (768 <= width && width < 1280) {
    numberOfCards = 2;
  } else if (768 > width) {
    numberOfCards = 1;
  } else {
    numberOfCards = 3;
  }
  return numberOfCards;
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

function saveCurrentCards(arr) {
  arr.forEach(element => memory.push(element));
}

let btnClickCounter = 0;
let shuffleArray = [];
let uniqueElements = [];
let memory = [];

function makeSlider(nextSlideCards, pets) {
  btnClickCounter = btnClickCounter + 1;
  if (btnClickCounter === 1) {
    replaceDefaultCards(nextSlideCards);
  } else if (btnClickCounter % 2 === 0) {
    shuffleArray = shufflePets(pets);
    uniqueElements = shuffleArray.filter(x => memory.indexOf(x) === -1);
    nextSlideCards = [];
    nextSlideCards = uniqueElements.slice(0, numberOfCards);
    replaceDefaultCards(nextSlideCards);
    memory = [];
    saveCurrentCards(nextSlideCards);
  } else {
    shuffleArray = shufflePets(pets);
    uniqueElements = shuffleArray.filter(x => memory.indexOf(x) === -1);
    nextSlideCards = [];
    nextSlideCards = uniqueElements.slice(0, numberOfCards);
    replaceDefaultCards(nextSlideCards);
    memory = [];
    saveCurrentCards(nextSlideCards);
  }
}

function createDeafaultSlider(pets) {
  let nextSlideCards = [];
  shuffleArray = shufflePets(pets);

  createDefaultCards(shuffleArray.slice(0, numberOfCards));
  nextSlideCards = shuffleArray.slice(numberOfCards, numberOfCards * 2);
  saveCurrentCards(nextSlideCards);

  nextButton.addEventListener("click", () => {    
    makeSlider(nextSlideCards, pets);
    moveNextSlide(slidesContainer);
  });
  
  prevButton.addEventListener("click", () => {
    makeSlider(nextSlideCards, pets);
    returnPrevSlide(slidesContainer);
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