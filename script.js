(function () {
  "use strict";
  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const list = document.getElementById("project-list");
  const overlay = document.getElementById("project-overlay");
  const overlayContent = document.getElementById("overlay-content");
  const overlayNumber = document.getElementById("overlay-number");
  const closeButton = overlay.querySelector(".overlay-close");
  let lastFocused = null;

  const twoDigit = (index) => String(index + 1).padStart(2, "0");

  function projectMarkup(project, index) {
    return `<article class="project reveal ${index % 2 ? "project--reverse" : ""}">
      <button class="project-image" type="button" data-project="${project.id}" aria-label="Open ${project.title} project">
        <img src="${project.cover}" alt="Abstract placeholder artwork for ${project.title}" loading="lazy">
      </button>
      <div class="project-info">
        <p class="project-number">${twoDigit(index)}</p>
        <h3><button type="button" data-project="${project.id}">${project.title}</button></h3>
        <div class="project-meta"><p>${project.category}</p><p>${project.year}</p></div>
      </div>
    </article>`;
  }

  if (projects.length) {
    list.innerHTML = projects.map(projectMarkup).join("");
  } else {
    list.innerHTML = '<p class="empty-state">Projects are being prepared.</p>';
  }

  function openProject(project) {
    const index = projects.indexOf(project);
    lastFocused = document.activeElement;
    overlayNumber.textContent = `${twoDigit(index)} / ${twoDigit(projects.length)}`;
    overlayContent.innerHTML = `<header class="overlay-header">
      <p>${project.category}</p><h2 id="overlay-title">${project.title}</h2>
      <div><p>${project.year}</p><p>${project.description}</p></div>
    </header>
    <div class="overlay-media">
      ${project.video ? `<video controls preload="metadata"><source src="${project.video}"></video>` : ""}
      ${project.images.map((src, imageIndex) => `<img src="${src}" alt="${project.title} project image ${imageIndex + 1}" loading="lazy">`).join("")}
    </div>`;
    overlay.hidden = false;
    document.body.classList.add("overlay-open");
    overlay.scrollTop = 0;
    requestAnimationFrame(() => overlay.classList.add("is-open"));
    closeButton.focus();
  }

  function closeProject() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("overlay-open");
    window.setTimeout(() => {
      overlay.hidden = true;
      overlayContent.innerHTML = "";
      if (lastFocused) lastFocused.focus();
    }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 350);
  }

  list.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project]");
    if (!trigger) return;
    const project = projects.find((item) => item.id === trigger.dataset.project);
    if (project) openProject(project);
  });
  closeButton.addEventListener("click", closeProject);
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProject();
    if (event.key === "Tab") {
      event.preventDefault();
      closeButton.focus();
    }
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
})();
