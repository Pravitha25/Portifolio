// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  initCustomCursor();
  initThreeJS();
  initGSAP();
  initMobileNav();
  initContactForm();
});

// Contact Form Handler via mailto
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault(); // Stop default form submission
      
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;
      
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n---\nSender Email: ${email}`);
      
      // Open default mail client
      window.location.href = `mailto:pravithaprasad474@gmail.com?subject=${subject}&body=${body}`;
    });
  }
}

// Custom Cursor (Only on non-touch devices)
function initCustomCursor() {
  const cursorDot = document.getElementById("cursor-dot");
  const cursorOutline = document.getElementById("cursor-outline");

  // Check if device supports hover
  if(window.matchMedia("(pointer: coarse)").matches) {
    cursorDot.style.display = "none";
    cursorOutline.style.display = "none";
    return;
  }

  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Smooth follow for outline
    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
  });

  // Add hover effect to interactable elements
  const interactables = document.querySelectorAll("a, button, input, textarea, .glass");
  interactables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorOutline.classList.add("hovering");
    });
    el.addEventListener("mouseleave", () => {
      cursorOutline.classList.remove("hovering");
    });
  });
}

// Mobile Navigation
function initMobileNav() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// Three.js Background Animation
function initThreeJS() {
  const canvas = document.getElementById("bg-canvas");
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles Array (Stars)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  const posArray = new Float32Array(particlesCount * 3);
  const colorArray = new Float32Array(particlesCount * 3);

  const colors = [
    new THREE.Color('#00f0ff'), // Cyan
    new THREE.Color('#bf00ff'), // Purple
    new THREE.Color('#0066ff')  // Blue
  ];

  for (let i = 0; i < particlesCount * 3; i+=3) {
    // Spread particles
    posArray[i] = (Math.random() - 0.5) * 15;
    posArray[i+1] = (Math.random() - 0.5) * 15;
    posArray[i+2] = (Math.random() - 0.5) * 10;
    
    // Assign random neon color to particle
    const color = colors[Math.floor(Math.random() * colors.length)];
    colorArray[i] = color.r;
    colorArray[i+1] = color.g;
    colorArray[i+2] = color.b;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Floating 3D Geometric Objects
  const objects = [];
  
  // 1. Icosahedron (Blueish)
  const geo1 = new THREE.IcosahedronGeometry(1.2, 0);
  const mat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.3 });
  const mesh1 = new THREE.Mesh(geo1, mat1);
  mesh1.position.set(3, 1, -2);
  scene.add(mesh1);
  objects.push(mesh1);

  // 2. TorusKnot (Purpleish)
  const geo2 = new THREE.TorusKnotGeometry(0.8, 0.2, 100, 16);
  const mat2 = new THREE.MeshBasicMaterial({ color: 0xbf00ff, wireframe: true, transparent: true, opacity: 0.3 });
  const mesh2 = new THREE.Mesh(geo2, mat2);
  mesh2.position.set(-3, -2, -3);
  scene.add(mesh2);
  objects.push(mesh2);

  // 3. Octahedron (Cyanish)
  const geo3 = new THREE.OctahedronGeometry(1, 0);
  const mat3 = new THREE.MeshBasicMaterial({ color: 0x0066ff, wireframe: true, transparent: true, opacity: 0.2 });
  const mesh3 = new THREE.Mesh(geo3, mat3);
  mesh3.position.set(2, -3, -4);
  scene.add(mesh3);
  objects.push(mesh3);

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  // Scroll Interaction
  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smoothly ease targets
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Rotate particles
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;

    // Interactive Camera movement based on mouse
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Rotate geometric objects & add slight bobbing
    objects.forEach((obj, i) => {
      obj.rotation.x += 0.002 * (i + 1);
      obj.rotation.y += 0.003 * (i + 1);
      
      // Floating effect combined with scroll position
      // Modulate object Y position based on scroll offset to simulate parallax depth
      obj.position.y += Math.sin(elapsedTime * 0.5 + i) * 0.002;
    });

    // Parallax on Scroll for particles
    particlesMesh.position.y = -scrollY * 0.001;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}

// GSAP Animations with ScrollTrigger
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger);

  // Initial Hero Animations
  const tl = gsap.timeline();
  tl.fromTo(".navbar", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
    .fromTo(".greeting", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5")
    .fromTo(".name", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
    .fromTo(".title", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.6")
    .fromTo(".description", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.4")
    .fromTo(".btn", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.2, duration: 0.5, ease: "back.out(1.7)" }, "-=0.2");

  // Reusable scroll reveal for section titles
  gsap.utils.toArray(".section-title").forEach(title => {
    gsap.fromTo(title, {
      y: 50,
      opacity: 0
    }, {
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  // About Section: Cards & Timeline
  gsap.fromTo(".about-card", 
    { x: -50, opacity: 0 },
    { scrollTrigger: { trigger: ".about-grid", start: "top 80%" }, x: 0, opacity: 1, duration: 1 }
  );
  
  gsap.fromTo(".timeline-item", 
    { x: 50, opacity: 0 },
    { scrollTrigger: { trigger: ".about-grid", start: "top 80%" }, x: 0, opacity: 1, stagger: 0.3, duration: 0.8 }
  );

  // Skills Section: Categories
  gsap.fromTo(".skill-category", 
    { y: 50, opacity: 0, scale: 0.95 },
    { scrollTrigger: { trigger: ".skills-grid", start: "top 80%" }, y: 0, opacity: 1, scale: 1, stagger: 0.2, duration: 0.8, ease: "back.out(1.5)" }
  );

  // Skills Section: Progress Bars
  gsap.utils.toArray(".skill-bar-fill").forEach(bar => {
    const width = bar.getAttribute("data-width");
    gsap.to(bar, {
      scrollTrigger: {
        trigger: ".skill-bars",
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      width: width,
      duration: 1.5,
      ease: "power3.out"
    });
  });

  // Projects Section: Cards
  gsap.fromTo(".project-card",
    { y: 50, opacity: 0 },
    { scrollTrigger: { trigger: ".project-cards", start: "top 80%" }, y: 0, opacity: 1, stagger: 0.2, duration: 0.8 }
  );

  // Contact Section: Info & Form
  gsap.fromTo(".contact-info",
    { x: -50, opacity: 0 },
    { scrollTrigger: { trigger: ".contact-wrapper", start: "top 80%" }, x: 0, opacity: 1, duration: 0.8 }
  );
  gsap.fromTo(".contact-form",
    { x: 50, opacity: 0 },
    { scrollTrigger: { trigger: ".contact-wrapper", start: "top 80%" }, x: 0, opacity: 1, duration: 0.8 }
  );
}



document.addEventListener("DOMContentLoaded", () => {

    const projects = [
        {
            title: "Nano Pixel Technologies",
            img: "logo.jpeg",
            desc: "Figma Design",
            link: "https://www.figma.com/design/aJIBdNsYFLAtWvHArkRMgt/biosecure?node-id=202-1624&t=4RgqYNhPQ4k3lfbv-1"
        },
        {
            title: "Sealand",
            img: "sealand.png",
            desc: "ReactJS, CSS, HTML, Javascript",
            link: "https://sealand1.codecubz.com/"
        },
        {
            title: "Codecubz",
            img: "codecubz.png",
            desc: "ReactJS, HTML, CSS, Javascript",
            link: "https://codecubz.com/"
        },
        {
            title: "Majan",
            img: "majan.png",
            desc: "Figma Design",
            link: "https://www.behance.net/gallery/195330069/Majan-Figma-Designs"
        },
        {
            title: "MyWindow ",
            img: "mywindow.png",
            desc: "Bootstrap, CSS, HTML, Javascript",
            link: "https://demo.greeniit.com/mywindow/"
        },
        {
            title: "Ignite",
            img: "ignite.png",
            desc: "Bootstrap, HTML, CSS, Javascript",
            link: "https://ignite.darsana.in/"
        },
        {
            title: "Darsana magazine",
            img: "eye.png",
            desc: "Figma Design",
            link: "https://darsana.in/magazines"
        },
        {
            title: "Digital Factors",
            img: "digitalfactors.png",
            desc: "Figma Design",
            link: "https://www.figma.com/design/aJIBdNsYFLAtWvHArkRMgt/biosecure?node-id=201-2&t=4RgqYNhPQ4k3lfbv-1"
        },
        {
            title: "Travel ERP",
            img: "Travelerp.png",
            desc: "Figma Design",
            link: "https://www.figma.com/design/aJIBdNsYFLAtWvHArkRMgt/biosecure?node-id=0-1&t=4RgqYNhPQ4k3lfbv-1"
        },
        {
            title: "AZM Platform",
            img: "azm.jpg",
            desc: "Bootstrap, CSS, HTML, Javascript",
            link: "https://azmplatform.com/"
        }
    ];

     const slider = document.getElementById("projectSlider");

    let angle = 0;
    const step = 360 / projects.length;
    let autoRotate;

    projects.forEach((project, i) => {
        const slide = document.createElement("div");
        slide.className = "slide";

        slide.innerHTML = `
            <div class="project-card" onclick="window.open('${project.link}', '_blank')">
                <img src="${project.img}">
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.desc}</p>
                </div>
            </div>
        `;

        /* 🔥 GAP CONTROL HERE */
        slide.style.transform = `rotateY(${step * i}deg) translateZ(500px)`;

        slider.appendChild(slide);
    });

    function rotateSlider(direction = -1) {
        angle += step * direction;
        slider.style.transform = `rotateY(${angle}deg)`;
    }

    document.getElementById("nextBtn").onclick = () => rotateSlider(-1);
    document.getElementById("prevBtn").onclick = () => rotateSlider(1);

    function startAutoRotate() {
        autoRotate = setInterval(() => rotateSlider(-1), 2500);
    }

    function stopAutoRotate() {
        clearInterval(autoRotate);
    }

    startAutoRotate();

    slider.addEventListener("mouseenter", stopAutoRotate);
    slider.addEventListener("mouseleave", startAutoRotate);



    // LOADER ANIMATION
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    const progress = document.getElementById("loaderProgress");

    let width = 0;

    const interval = setInterval(() => {
        width += Math.random() * 20; // random smooth loading

        if (width >= 100) {
            width = 100;
            clearInterval(interval);

            // GSAP exit animation
            gsap.to(loader, {
                opacity: 0,
                duration: 0.8,
                delay: 0.3,
                onComplete: () => {
                    loader.style.display = "none";
                }
            });
        }

        progress.style.width = width + "%";
    }, 200);
});

});