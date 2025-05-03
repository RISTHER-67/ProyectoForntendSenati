let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

document.querySelector('.next').addEventListener('click', () => {
  goToSlide(currentSlide + 1);
});

document.querySelector('.prev').addEventListener('click', () => {
  goToSlide(currentSlide - 1);
});

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  currentSlide = (index + totalSlides) % totalSlides;
  slides[currentSlide].classList.add('active');
  document.querySelector('.slides').style.transform = `translateX(-${currentSlide * 100}%)`;
}

// Cambio automático cada 5 segundos
setInterval(() => {
  goToSlide(currentSlide + 1);
}, 5000);
