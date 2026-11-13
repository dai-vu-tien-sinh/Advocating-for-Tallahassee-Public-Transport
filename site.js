(() => {
  const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = sectionLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(section => section instanceof HTMLElement);

  const setCurrentSection = id => {
    for (const link of sectionLinks) {
      if (link.getAttribute("href") === `#${id}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };

  const updateCurrentSection = () => {
    const nav = document.querySelector(".site-nav");
    const marker = window.scrollY + (nav ? nav.offsetHeight : 0) + 120;
    let activeSection = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top + window.scrollY <= marker) {
        activeSection = section;
      } else {
        break;
      }
    }
    if (activeSection) {
      setCurrentSection(activeSection.id);
    }
  };

  const initialSection = window.location.hash.slice(1);
  if (sections.some(section => section.id === initialSection)) {
    setCurrentSection(initialSection);
  } else {
    updateCurrentSection();
  }
  window.addEventListener("scroll", updateCurrentSection, { passive: true });
  window.addEventListener("hashchange", () => {
    const hashSection = window.location.hash.slice(1);
    if (sections.some(section => section.id === hashSection)) {
      setCurrentSection(hashSection);
    }
  });

  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    const updateBackToTop = () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 420);
    };

    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
  }

  if (!("IntersectionObserver" in window)) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const revealItems = document.querySelectorAll(".scroll-section .wrap > *");
  document.documentElement.classList.add("has-scroll-effects");
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    }
  }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

  for (const item of revealItems) {
    item.classList.add("scroll-reveal");
    observer.observe(item);
  }
})();
