const projectsGrid = document.getElementById("projectsGrid");
const searchInput = document.getElementById("searchInput");

let allProjects = [];

async function loadProjects() {
  try {
    const response = await fetch("/projects.json");

    const data = await response.json();

    allProjects = data.projects;

    renderProjects(allProjects);
  } catch (error) {
    console.error("Failed to load projects:", error);

    projectsGrid.innerHTML = `
      <div class="card">
        Failed to load projects.json
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
      <div class="category">${project.category}</div>

      <h3>${project.title}</h3>

      <p class="description">
        ${project.description}
      </p>

      <div class="section-title">
        Technologies
      </div>

      <div class="tags">
        ${project.technologies
          .map((tech) => `<span class="tag">${tech}</span>`)
          .join("")}
      </div>

      <div class="section-title">
        Keywords
      </div>

      <div class="tags">
        ${project.keywords
          .map((keyword) => `<span class="tag">${keyword}</span>`)
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

    projectsGrid.appendChild(card);
  });
}

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();

  const filtered = allProjects.filter((project) => {
    return (
      project.title.toLowerCase().includes(value) ||
      project.category.toLowerCase().includes(value) ||
      project.description.toLowerCase().includes(value) ||
      project.technologies.join(" ").toLowerCase().includes(value) ||
      project.keywords.join(" ").toLowerCase().includes(value)
    );
  });

  renderProjects(filtered);
});

loadProjects();
