document.addEventListener("DOMContentLoaded", async function () {
  let gradesData = [];
  try {
    const response = await fetch("/api/profesor/calificaciones");
    if (!response.ok)
      throw new Error("No se pudieron cargar las calificaciones");
    gradesData = await response.json();
  } catch (e) {
    alert("Error cargando calificaciones: " + e.message);
    return;
  }

  const courseSelect = document.getElementById("course-select");
  const eventSelect = document.getElementById("event-select");
  const searchInput = document.getElementById("search-input");
  const gradesTable = document.getElementById("grades-table");
  const gradesTableContainer = document.getElementById(
    "grades-table-container"
  );
  const noSelectionMessage = document.getElementById("no-selection-message");
  const noResultsMessage = document.getElementById("no-results-message");
  const tableTitle = document.getElementById("table-title");
  const averageGrade = document.getElementById("average-grade");
  const highestGrade = document.getElementById("highest-grade");
  const lowestGrade = document.getElementById("lowest-grade");
  const exportBtn = document.getElementById("export-btn");

  const courses = [
    ...new Map(
      gradesData.map((item) => [
        item.course_id,
        {
          id: item.course_id,
          title: item.course_title,
        },
      ])
    ).values(),
  ];

  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = course.title;
    courseSelect.appendChild(option);
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getGradeClass(grade) {
    if (grade >= 4.0) return "grade-high";
    if (grade >= 3.0) return "grade-medium";
    return "grade-low";
  }

  function updateEvents(courseId) {
    eventSelect.innerHTML = '<option value="">Todos los eventos</option>';

    if (!courseId) {
      eventSelect.disabled = true;
      return;
    }

    const events = [
      ...new Set(
        gradesData
          .filter((item) => item.course_id == courseId)
          .map((item) => item.event_title)
      ),
    ];

    events.forEach((event) => {
      const option = document.createElement("option");
      option.value = event;
      option.textContent = event;
      eventSelect.appendChild(option);
    });

    eventSelect.disabled = false;
  }

  function filterAndDisplayGrades() {
    const selectedCourseId = courseSelect.value;
    const selectedEvent = eventSelect.value;
    const searchTerm = searchInput.value.toLowerCase();

    if (!selectedCourseId) {
      gradesTableContainer.style.display = "none";
      noSelectionMessage.style.display = "flex";
      noResultsMessage.style.display = "none";
      return;
    }

    let filteredData = gradesData.filter(
      (item) => item.course_id == selectedCourseId
    );

    if (selectedEvent) {
      filteredData = filteredData.filter(
        (item) => item.event_title === selectedEvent
      );
    }

    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        `${item.student_first_name} ${item.student_last_name}`
          .toLowerCase()
          .includes(searchTerm)
      );
    }

    if (filteredData.length === 0) {
      gradesTableContainer.style.display = "none";
      noSelectionMessage.style.display = "none";
      noResultsMessage.style.display = "flex";
      return;
    }

    gradesTableContainer.style.display = "block";
    noSelectionMessage.style.display = "none";
    noResultsMessage.style.display = "none";

    const selectedCourse = courses.find(
      (course) => course.id == selectedCourseId
    );
    tableTitle.textContent = `Calificaciones - ${selectedCourse.title}${
      selectedEvent ? ` - ${selectedEvent}` : ""
    }`;

    const grades = filteredData.map((item) => item.grade);
    const avg = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    const max = Math.max(...grades);
    const min = Math.min(...grades);

    averageGrade.textContent = avg.toFixed(1);
    highestGrade.textContent = max.toFixed(1);
    lowestGrade.textContent = min.toFixed(1);

    const tbody = gradesTable.querySelector("tbody");
    tbody.innerHTML = "";

    filteredData.forEach((item) => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = item.id;
      row.appendChild(idCell);

      const studentCell = document.createElement("td");
      studentCell.textContent = `${item.student_first_name} ${item.student_last_name}`;
      row.appendChild(studentCell);

      const eventCell = document.createElement("td");
      eventCell.textContent = item.event_title;
      row.appendChild(eventCell);

      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(item.submitted_at);
      row.appendChild(dateCell);

      const gradeCell = document.createElement("td");
      const gradeSpan = document.createElement("span");
      gradeSpan.textContent = item.grade.toFixed(1);
      gradeSpan.className = `grade-cell ${getGradeClass(item.grade)}`;
      gradeCell.appendChild(gradeSpan);
      row.appendChild(gradeCell);

      tbody.appendChild(row);
    });
  }

  courseSelect.addEventListener("change", function () {
    updateEvents(this.value);
    filterAndDisplayGrades();
  });

  eventSelect.addEventListener("change", filterAndDisplayGrades);

  searchInput.addEventListener("input", filterAndDisplayGrades);

  document.querySelectorAll(".sortable").forEach((header) => {
    header.addEventListener("click", function () {
      const sortField = this.dataset.sort;
      const tbody = gradesTable.querySelector("tbody");
      const rows = Array.from(tbody.querySelectorAll("tr"));

      let sortDirection = "asc";
      if (this.classList.contains("sort-asc")) {
        sortDirection = "desc";
        this.classList.remove("sort-asc");
        this.classList.add("sort-desc");
      } else {
        document.querySelectorAll(".sortable").forEach((h) => {
          h.classList.remove("sort-asc", "sort-desc");
        });
        this.classList.add("sort-asc");
      }

      rows.sort((a, b) => {
        let aValue, bValue;

        if (sortField === "id") {
          aValue = parseInt(a.cells[0].textContent);
          bValue = parseInt(b.cells[0].textContent);
        } else if (sortField === "student_name") {
          aValue = a.cells[1].textContent;
          bValue = b.cells[1].textContent;
        } else if (sortField === "event_title") {
          aValue = a.cells[2].textContent;
          bValue = b.cells[2].textContent;
        } else if (sortField === "submitted_at") {
          aValue = new Date(a.cells[3].textContent);
          bValue = new Date(b.cells[3].textContent);
        } else if (sortField === "grade") {
          aValue = parseFloat(a.cells[4].textContent);
          bValue = parseFloat(b.cells[4].textContent);
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });

      rows.forEach((row) => tbody.appendChild(row));
    });
  });

  exportBtn.addEventListener("click", function () {
    const selectedCourseId = courseSelect.value;
    if (!selectedCourseId) {
      alert("Por favor, selecciona un curso para exportar las calificaciones.");
      return;
    }

    const selectedEvent = eventSelect.value;
    const searchTerm = searchInput.value.toLowerCase();

    let dataToExport = gradesData.filter(
      (item) => item.course_id == selectedCourseId
    );

    if (selectedEvent) {
      dataToExport = dataToExport.filter(
        (item) => item.event_title === selectedEvent
      );
    }

    if (searchTerm) {
      dataToExport = dataToExport.filter((item) =>
        `${item.student_first_name} ${item.student_last_name}`
          .toLowerCase()
          .includes(searchTerm)
      );
    }

    const headers = [
      "ID",
      "Curso",
      "Estudiante",
      "Evento",
      "Fecha de entrega",
      "Calificación",
    ];
    let csvContent = headers.join(",") + "\n";

    dataToExport.forEach((item) => {
      const row = [
        item.id,
        `"${item.course_title}"`,
        `"${item.student_first_name} ${item.student_last_name}"`,
        `"${item.event_title}"`,
        `"${formatDate(item.submitted_at)}"`,
        item.grade,
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `calificaciones_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'94a01852253af776',t:'MTc0ODk2MzE5Mi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
