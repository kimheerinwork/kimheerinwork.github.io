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
  const hasKoreanTitle = (title) => /[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(title);

  function projectMarkup(project, index) {
    const subtitle = project.subtitle ? `<span class="project-subtitle">${project.subtitle}</span>` : "";
    const coverStyle = project.coverPosition ? ` style="object-position:${project.coverPosition}"` : "";
    return `<article class="project reveal">
      <button class="project-image" type="button" data-project="${project.id}" aria-label="Open ${project.title} project">
        <img src="${project.cover}" alt="${project.coverAlt || `Cover artwork for ${project.title}`}" loading="lazy"${coverStyle}>
        <span class="view-label">View project <span aria-hidden="true">↗</span></span>
      </button>
      <div class="project-info">
        <div class="project-title-row"><p class="project-number">${twoDigit(index)}</p><h3 class="${hasKoreanTitle(project.title) ? "title-ko" : ""}"><button type="button" data-project="${project.id}">${project.title}${subtitle}</button></h3></div>
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
    const titleText = project.titleLines
      ? project.titleLines.map(line => `<span class="title-line">${line}</span>`).join("")
      : `<span class="title-line">${project.title}</span>`;
    const detailTitle = `${titleText}${project.subtitle ? `<span class="detail-subtitle">${project.subtitle}</span>` : ""}`;
    const detailDescription = project.descriptionKo || project.descriptionEn
      ? `<div class="bilingual-description">
          ${project.descriptionKo ? `<section lang="ko"><p class="detail-description-label">한국어 설명</p>${project.descriptionKo.split("\n\n").map(text => `<p>${text}</p>`).join("")}</section>` : ""}
          ${project.descriptionEn ? `<section lang="en"><p class="detail-description-label">English Description</p>${project.descriptionEn.split("\n\n").map(text => `<p>${text}</p>`).join("")}</section>` : ""}
        </div>`
      : `<div class="detail-description"><p class="detail-description-label">About this work</p><p>${project.description}</p></div>`;
    overlayContent.innerHTML = `<section class="detail-hero">
      <header class="overlay-header detail-title-block">
        <p class="detail-label">Selected work · ${twoDigit(index)}</p>
        <h2 id="overlay-title" class="${hasKoreanTitle(project.title) ? "title-ko" : ""}">${detailTitle}</h2>
      </header>
      <div class="detail-cover"><img src="${project.cover}" alt="${project.coverAlt || `${project.title} cover image`}"></div>
      <section class="detail-info">
        <dl class="detail-facts">
          <div><dt>제작일</dt><dd>${project.date || project.year}</dd></div>
          ${project.award ? `<div><dt>수상</dt><dd>${project.award}</dd></div>` : ""}
          ${project.participation ? `<div><dt>참가</dt><dd>${project.participation}</dd></div>` : ""}
          <div><dt>Tool</dt><dd>${project.tools ? project.tools.join("<br>") : project.category}</dd></div>
          ${project.bgm ? `<div><dt>BGM</dt><dd>${project.bgm}</dd></div>` : ""}
        </dl>
        ${detailDescription}
      </section>
    </section>
    <div class="overlay-media${project.detailFullBleed ? " overlay-media--full" : ""}" style="--detail-width:${project.detailWidth || "100%"}">
      ${project.video ? `<video controls playsinline preload="metadata" poster="${project.cover}"><source src="${project.video}" type="video/mp4">Your browser does not support HTML video.</video>` : ""}
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
      const focusable = [closeButton];
      const currentIndex = focusable.indexOf(document.activeElement);
      const nextIndex = event.shiftKey
        ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
        : (currentIndex + 1) % focusable.length;
      event.preventDefault();
      focusable[nextIndex].focus();
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
