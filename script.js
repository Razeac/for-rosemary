/**
 * Project Birthday - Interactive Controller
 * Phase 2: 3D Card Open/Close Transitions & Slider Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('card-slider');
  const sliderWrapper = document.getElementById('slider-wrapper');
  const card3d = document.getElementById('card-3d');
  const labelDots = document.querySelectorAll('.label-dot');
  const ticks = document.querySelectorAll('.tick');
  const btnRestart = document.getElementById('btn-restart');
  
  let fadeTimeoutId = null;

  // Initialize state (0 = Front)
  updateCardState(0);
  startFadeTimer();

  /**
   * Updates 3D card transform classes according to step index (0, 1, 2)
   */
  function updateCardState(stepIndex) {
    const step = parseInt(stepIndex, 10);
    
    // Remove previous state classes
    card3d.classList.remove('state-front', 'state-inside', 'state-back');

    if (step === 0) {
      card3d.classList.add('state-front');
    } else if (step === 1) {
      card3d.classList.add('state-inside');
    } else if (step === 2) {
      card3d.classList.add('state-back');
    }

    // Update labels and tick markers
    labelDots.forEach((label, idx) => {
      label.classList.toggle('active', idx === step);
    });

    ticks.forEach((tick, idx) => {
      tick.classList.toggle('active', idx <= step);
    });

    if (slider.value !== String(step)) {
      slider.value = step;
    }
  }

  /**
   * Auto-fade slider after 3 seconds of inactivity
   */
  function startFadeTimer() {
    clearTimeout(fadeTimeoutId);
    sliderWrapper.classList.remove('faded');
    
    fadeTimeoutId = setTimeout(() => {
      sliderWrapper.classList.add('faded');
    }, 3000);
  }

  function resetFadeTimer() {
    sliderWrapper.classList.remove('faded');
    startFadeTimer();
  }

  // Slider change event (drag or step snap)
  slider.addEventListener('input', (e) => {
    updateCardState(e.target.value);
    resetFadeTimer();
  });

  // Clicking labels directly moves the card
  labelDots.forEach((label) => {
    label.addEventListener('click', () => {
      const step = label.dataset.step;
      updateCardState(step);
      resetFadeTimer();
    });
  });

  // Restart button smoothly returns card to Front
  btnRestart.addEventListener('click', () => {
    updateCardState(0);
    resetFadeTimer();
  });

  // Swipe gesture support on mobile touch devices
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    resetFadeTimer();
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
    resetFadeTimer();
  }, { passive: true });

  function handleSwipeGesture() {
    const diff = touchEndX - touchStartX;
    const currentVal = parseInt(slider.value, 10);
    // Threshold 50px for deliberate swipe
    if (diff < -50 && currentVal < 2) {
      // Swiped left -> advance forward
      updateCardState(currentVal + 1);
    } else if (diff > 50 && currentVal > 0) {
      // Swiped right -> go back
      updateCardState(currentVal - 1);
    }
  }

  // Reset fade timer on user interaction
  ['mousemove', 'click', 'keydown'].forEach(evt => {
    document.addEventListener(evt, resetFadeTimer, { passive: true });
  });
});
