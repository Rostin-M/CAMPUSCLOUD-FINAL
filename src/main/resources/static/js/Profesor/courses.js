function getUserIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("userId");
}

function getUserId() {
  const params = new URLSearchParams(window.location.search);
  let id = params.get("userId");
  if (!id) {
    id = document.body.dataset.userid;
  }
  return id;
}

async function fetchCoursesFromAPI() {
  const profesorId = getUserId();
  console.log(
    "ID desde URL:",
    new URLSearchParams(window.location.search).get("userId")
  );
  console.log("ID desde dataset:", document.body.dataset.userid);
  if (!profesorId) throw new Error("No se encontró el ID del profesor");
  const response = await fetch(`/api/cursos/profesor/${profesorId}`);
  if (!response.ok) throw new Error("No se pudieron cargar los cursos");
  return await response.json();
}

const profesorId = getUserIdFromQuery();

document.addEventListener("DOMContentLoaded", async function () {
  let coursesData = [];
  try {
    coursesData = await fetchCoursesFromAPI();
  } catch (e) {
    alert("Error al cargar cursos: " + e.message);
    coursesData = [];
  }

  renderCourses(coursesData);

  function generateCourseImage(color) {
    const patterns = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
                        <rect width="100%" height="100%" fill="${color}" opacity="0.2"/>
                        <path d="M0,20 L100,20 M0,40 L100,40 M0,60 L100,60 M0,80 L100,80 M20,0 L20,100 M40,0 L40,100 M60,0 L60,100 M80,0 L80,100" 
                            stroke="${color}" stroke-width="1" opacity="0.5"/>
                        <circle cx="50" cy="50" r="20" fill="${color}" opacity="0.3"/>
                    </svg>`,

      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
                        <rect width="100%" height="100%" fill="${color}" opacity="0.2"/>
                        <path d="M0,30 Q25,10 50,30 T100,30 M0,50 Q25,30 50,50 T100,50 M0,70 Q25,50 50,70 T100,70" 
                            stroke="${color}" stroke-width="2" fill="none" opacity="0.6"/>
                    </svg>`,

      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100">
                        <rect width="100%" height="100%" fill="${color}" opacity="0.2"/>
                        <circle cx="20" cy="20" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="40" cy="20" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="60" cy="20" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="80" cy="20" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="20" cy="40" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="40" cy="40" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="60" cy="40" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="80" cy="40" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="20" cy="60" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="40" cy="60" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="60" cy="60" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="80" cy="60" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="20" cy="80" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="40" cy="80" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="60" cy="80" r="3" fill="${color}" opacity="0.7"/>
                        <circle cx="80" cy="80" r="3" fill="${color}" opacity="0.7"/>
                    </svg>`,
    ];

    const randomIndex = Math.floor(Math.random() * patterns.length);
    return patterns[randomIndex];
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("");
  }

  function renderCourses(courses) {
    const coursesContainer = document.getElementById("courses-container");
    const emptyState = document.getElementById("empty-state");

    coursesContainer.innerHTML = "";

    if (courses.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    courses.forEach((course) => {
      const courseElement = document.createElement("article");
      courseElement.className = "course-card";
      courseElement.setAttribute(
        "aria-labelledby",
        `course-title-${course.course_id}`
      );

      const courseImage = generateCourseImage(course.color || "#4361ee");

      const initials = getInitials(course.title);

      courseElement.innerHTML = `
        <div class="course-image">
          ${courseImage}
          <span class="course-badge">${course.code}</span>
        </div>
        <div class="course-content">
          <h2 class="course-title" id="course-title-${course.course_id}">${
        course.title
      }</h2>
          <p class="course-description">${course.description}</p>
          <div class="course-meta">
            <div class="course-author">
              <div class="author-avatar" style="background-color: ${
                course.color || "#4361ee"
              }">${initials}</div>
              <span class="author-name">ID: ${course.createdBy}</span>
            </div>
            <div class="course-actions">
              <button class="btn" aria-label="Ver detalles del curso">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button class="btn" aria-label="Editar curso">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;

      coursesContainer.appendChild(courseElement);
    });
  }

  renderCourses(coursesData);

  const searchInput = document.querySelector(".search-input");
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredCourses = coursesData.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.code.toLowerCase().includes(searchTerm)
    );
    renderCourses(filteredCourses);
  });

  const categoryFilter = document.querySelector(".filter-dropdown");
  categoryFilter.addEventListener("change", function () {
    renderCourses(coursesData);
  });

  const pageButtons = document.querySelectorAll(".page-btn:not(.disabled)");
  pageButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (
        !this.classList.contains("active") &&
        !this.classList.contains("disabled")
      ) {
        document.querySelector(".page-btn.active").classList.remove("active");
        this.classList.add("active");
      }
    });
  });
});
