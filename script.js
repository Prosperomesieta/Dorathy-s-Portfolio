document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Lenis Smooth Scrolling Setup
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 2. Cinematic Fade-In Transition
  const fadeWrapper = document.getElementById('fade-wrapper');
  const mainContent = document.getElementById('main-content');
  
  setTimeout(() => {
    if(fadeWrapper) fadeWrapper.classList.add('open');
    if(mainContent) mainContent.classList.add('visible');
    
    setTimeout(() => {
      if(fadeWrapper) fadeWrapper.style.display = 'none';
      
      // Trigger initial slide-ups on load
      const initialSlides = document.querySelectorAll('.home-hero .slide-up, .about-hero-section .slide-up, .contact-hero .slide-up, .intro-section .slide-up');
      initialSlides.forEach(el => el.classList.add('active'));
      
    }, 1000); 
  }, 100);

  // 3. Custom Magnetic Text Cursor
  const cursor = document.getElementById('customCursor');
  const cursorText = document.getElementById('cursorText');
  const hoverTargets = document.querySelectorAll('.cursor-hover-target, a');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  if(cursor) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hovering');
        const customText = target.getAttribute('data-cursor-text');
        if(customText && cursorText) cursorText.innerText = customText;
        else if(cursorText) cursorText.innerText = "";
      });
      target.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hovering');
      });
    });
  }

  // 4. Scroll Reveal (Intersection Observer)
  // FIX: Observe the .text-mask wrapper so it triggers even when child is hidden
  const revealWrappers = document.querySelectorAll('.text-mask, .reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('active');
        // If it's a mask, activate the slide-up child
        const slideUpChild = entry.target.querySelector('.slide-up');
        if (slideUpChild) slideUpChild.classList.add('active');
        // If it has multiple children (like credit details)
        const slideUpChildren = entry.target.querySelectorAll('.slide-up');
        slideUpChildren.forEach(child => child.classList.add('active'));
      }
    });
  }, { threshold: 0.1 });

  revealWrappers.forEach(el => revealObserver.observe(el));

  // 5. AWWWARDS: Horizontal Scroll Track
  const stickyContainer = document.querySelector('.sticky-container');
  const horizontalTrack = document.getElementById('horizontalTrack');
  const horizontalScrollWrapper = document.querySelector('.horizontal-scroll-wrapper');
  const scrollNudge = document.getElementById('scrollNudge');
  
  if(stickyContainer && horizontalTrack && horizontalScrollWrapper) {
    lenis.on('scroll', () => {
      const wrapperRect = horizontalScrollWrapper.getBoundingClientRect();
      const scrollableHeight = wrapperRect.height - window.innerHeight;
      
      let scrollProgress = -wrapperRect.top / scrollableHeight;
      scrollProgress = Math.max(0, Math.min(1, scrollProgress));
      
      const trackScrollWidth = horizontalTrack.scrollWidth - window.innerWidth;
      horizontalTrack.style.transform = `translate3d(-${scrollProgress * trackScrollWidth}px, 0, 0)`;

      if(scrollNudge) {
        scrollNudge.style.opacity = 1 - (scrollProgress * 2); 
      }
    });
  }

  // 6. Hover Reveal List
  const scriptItems = document.querySelectorAll('.script-item');
  const hoverRevealImg = document.getElementById('hoverRevealImg');
  const hoverRevealTarget = document.getElementById('hoverRevealTarget');

  if(scriptItems.length > 0 && hoverRevealImg && hoverRevealTarget) {
    let imgX = window.innerWidth / 2;
    let imgY = window.innerHeight / 2;

    const animateRevealImg = () => {
      imgX += (mouseX - imgX) * 0.1;
      imgY += (mouseY - imgY) * 0.1;
      hoverRevealImg.style.transform = `translate3d(${imgX}px, ${imgY}px, 0) translate(-50%, -50%) scale(${hoverRevealImg.classList.contains('visible') ? 1 : 0.8})`;
      requestAnimationFrame(animateRevealImg);
    };
    animateRevealImg();

    scriptItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        const imgSrc = item.getAttribute('data-hover-img');
        if(imgSrc) {
          hoverRevealTarget.src = imgSrc;
          hoverRevealImg.classList.add('visible');
        }
      });
      item.addEventListener('mouseleave', () => {
        hoverRevealImg.classList.remove('visible');
      });
    });
  }

  // 7. LIGHT 3D MOUSE TILT EFFECT
  const tiltElements = document.querySelectorAll('.tilt-effect');
  
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      const maxRotation = 10;
      const rotateX = y * -maxRotation; 
      const rotateY = x * maxRotation;  
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // 8. MOBILE MENU TOGGLE
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const closeMenuBtn = document.getElementById('closeMenuBtn');

  if (mobileMenuBtn && mobileNavOverlay && closeMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNavOverlay.classList.add('active');
      lenis.stop(); // Prevent scrolling while menu is open
    });

    closeMenuBtn.addEventListener('click', () => {
      mobileNavOverlay.classList.remove('active');
      lenis.start(); // Re-enable scrolling
    });
  }

});
