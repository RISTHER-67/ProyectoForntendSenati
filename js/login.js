// Toggle password visibility function
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const icon = input.nextElementSibling;
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.classList.replace('bi-eye-slash', 'bi-eye');
  } else {
    input.type = 'password';
    icon.classList.replace('bi-eye', 'bi-eye-slash');
  }
}

// Password strength meter
function updatePasswordStrength(password, strengthMeter, strengthText) {
  // Calculate strength
  let strength = 0;
  const patterns = [
    /.{8,}/, // Min 8 chars
    /[A-Z]/, // Uppercase
    /[a-z]/, // Lowercase
    /[0-9]/, // Number
    /[^A-Za-z0-9]/ // Special char
  ];
  
  patterns.forEach(pattern => {
    if (pattern.test(password)) strength++;
  });
  
  // Update UI
  strengthMeter.value = strength;
  
  // Update text label
  let strengthLabel = 'débil';
  let strengthClass = 'text-danger';
  
  if (strength > 2) {
    strengthLabel = 'media';
    strengthClass = 'text-warning';
  }
  if (strength > 3) {
    strengthLabel = 'fuerte';
    strengthClass = 'text-success';
  }
  
  strengthText.textContent = `Contraseña ${strengthLabel}`;
  strengthText.className = strengthClass;
}

// Form toggle with improved animations
function toggleForms() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm.classList.contains('show')) {
    // Switch to register
    loginForm.classList.remove('show', 'slide-in-left');
    loginForm.classList.add('slide-out-right');
    
    setTimeout(() => {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
      
      setTimeout(() => {
        registerForm.classList.add('show', 'slide-in-left');
        registerForm.classList.remove('slide-out-right');
      }, 50);
    }, 300);
  } else {
    // Switch to login
    registerForm.classList.remove('show', 'slide-in-left');
    registerForm.classList.add('slide-out-right');
    
    setTimeout(() => {
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
      
      setTimeout(() => {
        loginForm.classList.add('show', 'slide-in-left');
        loginForm.classList.remove('slide-out-right');
      }, 50);
    }, 300);
  }
}

// Form validation with visual feedback
document.addEventListener('DOMContentLoaded', () => {
  // Setup password toggles
  const passwordFields = document.querySelectorAll('input[type="password"]');
  
  passwordFields.forEach(field => {
    // Create toggle button for each password field
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'btn password-toggle';
    toggleBtn.innerHTML = '<i class="bi bi-eye-slash"></i>';
    toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
    
    // Insert after the password field
    field.parentNode.insertBefore(toggleBtn, field.nextSibling);
    
    // Add click event
    toggleBtn.addEventListener('click', () => {
      togglePasswordVisibility(field.id);
    });
    
    // Add strength meter for register password
    if (field.id === 'registerPassword') {
      // Create strength meter container
      const strengthContainer = document.createElement('div');
      strengthContainer.className = 'password-strength mt-2 mb-3';
      
      // Create meter element
      const meter = document.createElement('meter');
      meter.className = 'password-strength-meter';
      meter.min = 0;
      meter.max = 5;
      meter.value = 0;
      meter.low = 2;
      meter.high = 4;
      meter.optimum = 5;
      
      // Create strength text
      const strengthText = document.createElement('span');
      strengthText.className = 'password-strength-text text-danger ms-2';
      strengthText.textContent = 'Contraseña débil';
      
      // Add to container
      strengthContainer.appendChild(meter);
      strengthContainer.appendChild(strengthText);
      
      // Insert after password field's parent (input group)
      field.closest('.input-group').insertAdjacentElement('afterend', strengthContainer);
      
      // Add input event
      field.addEventListener('input', () => {
        updatePasswordStrength(field.value, meter, strengthText);
      });
    }
  });
  
  // Setup responsive behaviors
  adjustImageGallery();
  window.addEventListener('resize', adjustImageGallery);
  
  // Add parallax effect to floating shapes
  window.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.floating-shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
      const speed = 1 + index * 0.5;
      const offsetX = (x - 0.5) * speed * 30;
      const offsetY = (y - 0.5) * speed * 30;
      
      shape.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.2}deg)`;
    });
  });
});

// Responsive image gallery
function adjustImageGallery() {
  const imageSection = document.querySelector('.image-section');
  const windowWidth = window.innerWidth;
  
  if (windowWidth < 992) {
    imageSection.style.order = "-1";
  } else {
    imageSection.style.order = "0";
  }
  
  // Adjust image size based on container height
  const imageContainer = document.querySelector('.image-gallery');
  const containerHeight = imageContainer.clientHeight;
  const image = document.querySelector('.product-image');
  
  if (image) {
    if (windowWidth < 768) {
      image.style.maxHeight = '300px';
    } else {
      image.style.maxHeight = (containerHeight - 20) + 'px';
    }
  }
}