const projectsGrid = document.getElementById("projectsGrid");
const searchInput = document.getElementById("searchInput");

const filterButtons =
  document.querySelectorAll(".filter-btn");

let allProjects = [];

let currentFilter = "All";

async function loadProjects() {
  try {
    const response = await fetch("/projects.json");

    const data = await response.json();

    allProjects = data.projects;

    renderProjects(allProjects);

  } catch (error) {
    console.error(error);

    projectsGrid.innerHTML = `
      <div class="card">
        Failed to load projects.
      </div>
    `;
  }
}

function renderProjects(projects) {
  projectsGrid.innerHTML = "";

  if (projects.length === 0) {
    projectsGrid.innerHTML = `
      <div class="card">
        No projects found.
      </div>
    `;

    return;
  }

  projects.forEach((project) => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <div class="category">
        ${project.categories.join(" • ")}
      </div>

      <h3>${project.title}</h3>

      <button class="copy-btn">
        Copy JSON
      </button>

      <p class="description">
        ${project.description}
      </p>

      <div class="section-title">
        Technologies
      </div>

      <div class="tags">
        ${project.technologies
          .map(
            (tech) =>
              `<span class="tag">${tech}</span>`
          )
          .join("")}
      </div>

      <div class="section-title">
        Keywords
      </div>

      <div class="tags">
        ${project.keywords
          .map(
            (keyword) =>
              `<span class="tag">${keyword}</span>`
          )
          .join("")}
      </div>

      ${
        project.links
          ? `
        <div class="links">
          ${Object.entries(project.links)
            .map(
              ([key, value]) => `
                <a href="${value}" target="_blank">
                  ${key}
                </a>
              `
            )
            .join("")}
        </div>
      `
          : ""
      }
    `;

    const copyButton =
      card.querySelector(".copy-btn");

    copyButton.addEventListener(
      "click",
      async () => {

        await navigator.clipboard.writeText(
          JSON.stringify(project, null, 2)
        );

        copyButton.innerText = "Copied!";

        setTimeout(() => {
          copyButton.innerText = "Copy JSON";
        }, 2000);
      }
    );

    projectsGrid.appendChild(card);
  });
}

function applyFilters() {

  const searchValue =
    searchInput.value.toLowerCase();

  let filtered = allProjects.filter((project) => {

    const matchesSearch =
      project.title.toLowerCase().includes(searchValue) ||
      project.description.toLowerCase().includes(searchValue) ||
      project.technologies.join(" ").toLowerCase().includes(searchValue) ||
      project.keywords.join(" ").toLowerCase().includes(searchValue);

    const matchesCategory =
      currentFilter === "All" ||
      project.categories.includes(currentFilter);

    return matchesSearch && matchesCategory;
  });

  renderProjects(filtered);
}

searchInput.addEventListener(
  "input",
  applyFilters
);

filterButtons.forEach((button) => {

  button.addEventListener("click", () => {

    filterButtons.forEach((btn) =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    currentFilter =
      button.dataset.filter;

    applyFilters();
  });
});

loadProjects();
