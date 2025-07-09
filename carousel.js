// Import data from data.js
import { players } from "./data.js";

// Carousel-specific global variables
let currentCarouselIndex = 0;
let sortedPlayers = [];

/**
 * Populate the players carousel with sorted player cards
 */
export function populatePlayersCarousel() {
  const carousel = document.getElementById("playersCarousel");
  if (!carousel) {
    console.error('Element with id "playersCarousel" not found.');
    return;
  }
  carousel.innerHTML = "";

  sortedPlayers.forEach((player, index) => {
    const card = createPlayerCard(player, index);
    carousel.appendChild(card);
  });
}

/**
 * Update the carousel position by translating the carousel container
 */
export function updateCarousel() {
  const carousel = document.getElementById("playersCarousel");
  const cardWidth = 320; // card width + gap
  carousel.style.transform = `translateX(-${
    currentCarouselIndex * cardWidth
  }px)`;
  updateCarouselNavigation();
}

/**
 * Update the enabled/disabled state of carousel navigation buttons
 */
export function updateCarouselNavigation() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = currentCarouselIndex === 0;
  nextBtn.disabled = currentCarouselIndex >= sortedPlayers.length - 1;
}

/**
 * Set up carousel navigation event listeners
 */
export function setupCarouselEventListeners() {
  // Carousel navigation - Previous button click handler
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentCarouselIndex > 0) {
      currentCarouselIndex--;
      updateCarousel();
    }
  });

  // Carousel navigation - Next button click handler
  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentCarouselIndex < sortedPlayers.length - 1) {
      currentCarouselIndex++;
      updateCarousel();
    }
  });
}

/**
 * Initialize carousel with sorted players
 */
export function initializeCarousel() {
  // Sort players by initiative (descending order)
  sortedPlayers = [...players].sort((a, b) => b.initiative - a.initiative);

  // Populate carousel
  populatePlayersCarousel();

  // Update navigation
  updateCarouselNavigation();
}

/**
 * Update carousel after data changes (re-sort and repopulate)
 */
export function updateCarouselAfterDataChange() {
  // Re-sort players
  sortedPlayers = [...players].sort((a, b) => b.initiative - a.initiative);

  // Repopulate carousel
  populatePlayersCarousel();

  // Update navigation
  updateCarouselNavigation();
}

/**
 * Get current sorted players array
 */
export function getSortedPlayers() {
  return sortedPlayers;
}

/**
 * Get current carousel index
 */
export function getCurrentCarouselIndex() {
  return currentCarouselIndex;
}

/**
 * Set current carousel index
 */
export function setCurrentCarouselIndex(index) {
  if (index >= 0 && index < sortedPlayers.length) {
    currentCarouselIndex = index;
    updateCarousel();
  }
}

// Import card creation function from cards.js
import { createPlayerCard } from "./cards.js";
