document.addEventListener("DOMContentLoaded", async function () {
  function getDateOnly(dateValue) {
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split("T")[0];
    }
    if (typeof dateValue === "string" && dateValue.includes("T")) {
      return dateValue.split("T")[0];
    }
    return dateValue;
  }
  let attendanceData = [];
  try {
    const response = await fetch("/api/profesor/asistencias");
    if (!response.ok) throw new Error("No se pudieron cargar las asistencias");
    attendanceData = await response.json();
  } catch (e) {
    alert("Error cargando asistencias: " + e.message);
    return;
  }

  let studentsByCourse = {};

  try {
    const response = await fetch("/api/profesor/estudiantes-por-curso");
    if (!response.ok) throw new Error("No se pudieron cargar los estudiantes");
    const estudiantes = await response.json();
    estudiantes.forEach((est) => {
      if (!studentsByCourse[est.course_id])
        studentsByCourse[est.course_id] = [];
      studentsByCourse[est.course_id].push({
        id: est.user_id,
        first_name: est.first_name,
        last_name: est.last_name,
      });
    });
  } catch (e) {
    alert("Error cargando estudiantes: " + e.message);
    return;
  }

  const courseSelect = document.getElementById("course-select");
  const dateFilter = document.getElementById("date-filter");
  const searchInput = document.getElementById("search-input");
  const attendanceTable = document.getElementById("attendance-table");
  const attendanceTableContainer = document.getElementById(
    "attendance-table-container"
  );
  const noSelectionMessage = document.getElementById("no-selection-message");
  const noResultsMessage = document.getElementById("no-results-message");
  const tableTitle = document.getElementById("table-title");
  const totalClasses = document.getElementById("total-classes");
  const averageAttendance = document.getElementById("average-attendance");
  const exportBtn = document.getElementById("export-btn");
  const uploadBtn = document.getElementById("upload-btn");
  const newAttendanceBtn = document.getElementById("new-attendance-btn");

  const attendanceModal = document.getElementById("attendance-modal");
  const modalCourseSelect = document.getElementById("modal-course-select");
  const attendanceDate = document.getElementById("attendance-date");
  const studentsListContainer = document.getElementById(
    "students-list-container"
  );
  const studentsList = document.getElementById("students-list");
  const closeModal = document.getElementById("close-modal");
  const cancelAttendance = document.getElementById("cancel-attendance");
  const saveAttendance = document.getElementById("save-attendance");
  const markAllPresent = document.getElementById("mark-all-present");
  const markAllAbsent = document.getElementById("mark-all-absent");

  const uploadModal = document.getElementById("upload-modal");
  const closeUploadModal = document.getElementById("close-upload-modal");
  const closeUpload = document.getElementById("close-upload");

  const courses = [
    ...new Map(
      attendanceData.map((item) => [
        item.course_id,
        {
          id: item.course_id,
          title: item.course_title,
        },
      ])
    ).values(),
  ];

  function loadCourseOptions(selectElement) {
    selectElement.innerHTML = '<option value="">Seleccionar curso</option>';

    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course.id;
      option.textContent = course.title;
      selectElement.appendChild(option);
    });
  }

  loadCourseOptions(courseSelect);
  loadCourseOptions(modalCourseSelect);

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getStatusClass(status) {
    switch (status) {
      case "present":
        return "status-present";
      case "absent":
        return "status-absent";
      case "late":
        return "status-late";
      default:
        return "";
    }
  }

  function getStatusText(status) {
    switch (status) {
      case "present":
        return "Presente";
      case "absent":
        return "Ausente";
      case "late":
        return "Tarde";
      default:
        return status;
    }
  }

  function filterAndDisplayAttendance() {
    const selectedCourseId = courseSelect.value;
    const selectedDate = dateFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    if (!selectedCourseId) {
      attendanceTableContainer.style.display = "none";
      noSelectionMessage.style.display = "flex";
      noResultsMessage.style.display = "none";
      return;
    }

    let filteredData = attendanceData.filter(
      (item) => item.course_id == selectedCourseId
    );

    if (selectedDate) {
      filteredData = filteredData.filter(
        (item) => getDateOnly(item.date) === selectedDate
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
      attendanceTableContainer.style.display = "none";
      noSelectionMessage.style.display = "none";
      noResultsMessage.style.display = "flex";
      return;
    }

    attendanceTableContainer.style.display = "block";
    noSelectionMessage.style.display = "none";
    noResultsMessage.style.display = "none";

    const selectedCourse = courses.find(
      (course) => course.id == selectedCourseId
    );
    tableTitle.textContent = `Asistencias - ${selectedCourse.title}${
      selectedDate ? ` - ${formatDate(selectedDate)}` : ""
    }`;

    const uniqueDates = [...new Set(filteredData.map((item) => item.date))];
    const totalAttendances = filteredData.length;
    const presentCount = filteredData.filter(
      (item) => item.status === "present"
    ).length;
    const attendancePercentage = (
      (presentCount / totalAttendances) *
      100
    ).toFixed(1);

    totalClasses.textContent = uniqueDates.length;
    averageAttendance.textContent = `${attendancePercentage}%`;

    const tbody = attendanceTable.querySelector("tbody");
    tbody.innerHTML = "";

    filteredData.forEach((item) => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = item.attendance_id;
      row.appendChild(idCell);

      const studentCell = document.createElement("td");
      studentCell.textContent = `${item.student_first_name} ${item.student_last_name}`;
      row.appendChild(studentCell);

      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(item.date);
      row.appendChild(dateCell);

      const statusCell = document.createElement("td");
      const statusBadge = document.createElement("span");
      statusBadge.textContent = getStatusText(item.status);
      statusBadge.className = `status-badge ${getStatusClass(item.status)}`;
      statusCell.appendChild(statusBadge);
      row.appendChild(statusCell);

      const actionsCell = document.createElement("td");
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "action-buttons";

      const editBtn = document.createElement("button");
      editBtn.className = "action-btn";
      editBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    `;
      editBtn.title = "Editar";
      editBtn.addEventListener("click", function () {
        alert(`Editar asistencia ID: ${item.attendance_id}`);
      });

      actionsDiv.appendChild(editBtn);
      actionsCell.appendChild(actionsDiv);
      row.appendChild(actionsCell);

      tbody.appendChild(row);
    });
  }

  function loadStudentsInModal(courseId) {
    if (!courseId) {
      studentsListContainer.style.display = "none";
      return;
    }

    const students = studentsByCourse[courseId];
    if (!students || students.length === 0) {
      studentsListContainer.style.display = "none";
      return;
    }

    studentsListContainer.style.display = "block";

    studentsList.innerHTML = "";

    students.forEach((student) => {
      const studentItem = document.createElement("div");
      studentItem.className = "student-item";

      const studentName = document.createElement("div");
      studentName.className = "student-name";
      studentName.textContent = `${student.first_name} ${student.last_name}`;

      const attendanceOptions = document.createElement("div");
      attendanceOptions.className = "attendance-options";

      const presentOption = document.createElement("label");
      presentOption.className = "attendance-option";
      presentOption.innerHTML = `
                        <input type="radio" name="attendance-${student.id}" value="present" checked>
                        <span>Presente</span>
                    `;

      const absentOption = document.createElement("label");
      absentOption.className = "attendance-option";
      absentOption.innerHTML = `
                        <input type="radio" name="attendance-${student.id}" value="absent">
                        <span>Ausente</span>
                    `;

      attendanceOptions.appendChild(presentOption);
      attendanceOptions.appendChild(absentOption);

      studentItem.appendChild(studentName);
      studentItem.appendChild(attendanceOptions);

      studentsList.appendChild(studentItem);
    });
  }

  courseSelect.addEventListener("change", filterAndDisplayAttendance);
  dateFilter.addEventListener("change", filterAndDisplayAttendance);
  searchInput.addEventListener("input", filterAndDisplayAttendance);

  document.querySelectorAll(".sortable").forEach((header) => {
    header.addEventListener("click", function () {
      const sortField = this.dataset.sort;
      const tbody = attendanceTable.querySelector("tbody");
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
        } else if (sortField === "date") {
          aValue = new Date(a.cells[2].textContent);
          bValue = new Date(b.cells[2].textContent);
        } else if (sortField === "status") {
          aValue = a.cells[3].textContent;
          bValue = b.cells[3].textContent;
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
      alert("Por favor, selecciona un curso para exportar las asistencias.");
      return;
    }

    const selectedDate = dateFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    let dataToExport = attendanceData.filter(
      (item) => item.course_id == selectedCourseId
    );

    function getDateOnly(dateValue) {
      if (dateValue instanceof Date) {
        return dateValue.toISOString().split("T")[0];
      }
      if (typeof dateValue === "string" && dateValue.includes("T")) {
        return dateValue.split("T")[0];
      }
      return dateValue;
    }

    if (selectedDate) {
      dataToExport = dataToExport.filter(
        (item) => getDateOnly(item.date) === selectedDate
      );
    }

    if (searchTerm) {
      dataToExport = dataToExport.filter((item) =>
        `${item.student_first_name} ${item.student_last_name}`
          .toLowerCase()
          .includes(searchTerm)
      );
    }

    const headers = ["ID", "Curso", "Estudiante", "Fecha", "Estado"];
    let csvContent = headers.join(",") + "\n";

    dataToExport.forEach((item) => {
      const row = [
        item.attendance_id,
        `"${item.course_title}"`,
        `"${item.student_first_name} ${item.student_last_name}"`,
        `"${formatDate(item.date)}"`,
        `"${getStatusText(item.status)}"`,
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
      `asistencias_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  newAttendanceBtn.addEventListener("click", function () {
    const today = new Date().toISOString().split("T")[0];
    attendanceDate.value = today;

    modalCourseSelect.value = "";
    studentsListContainer.style.display = "none";

    attendanceModal.classList.add("active");
  });

  closeModal.addEventListener("click", function () {
    attendanceModal.classList.remove("active");
  });

  cancelAttendance.addEventListener("click", function () {
    attendanceModal.classList.remove("active");
  });

  modalCourseSelect.addEventListener("change", function () {
    loadStudentsInModal(this.value);
  });

  markAllPresent.addEventListener("click", function () {
    const radioButtons = studentsList.querySelectorAll(
      'input[value="present"]'
    );
    radioButtons.forEach((radio) => {
      radio.checked = true;
    });
  });

  markAllAbsent.addEventListener("click", function () {
    const radioButtons = studentsList.querySelectorAll('input[value="absent"]');
    radioButtons.forEach((radio) => {
      radio.checked = true;
    });
  });

  saveAttendance.addEventListener("click", async function () {
    const selectedCourseId = modalCourseSelect.value;
    const selectedDate = attendanceDate.value;

    if (!selectedCourseId) {
      alert("Por favor, selecciona un curso.");
      return;
    }

    if (!selectedDate) {
      alert("Por favor, selecciona una fecha.");
      return;
    }
    const students = studentsByCourse[selectedCourseId];
    const asistencias = [];
    students.forEach((student) => {
      const status = studentsList.querySelector(
        `input[name="attendance-${student.id}"]:checked`
      ).value;
      asistencias.push({
        course_id: selectedCourseId,
        user_id: student.id,
        date: selectedDate,
        status: status,
      });
    });

    const csrfToken =
      document.body.dataset.csrfToken ||
      document.querySelector('input[name="_csrf"]')?.value;

    try {
      const response = await fetch("/api/profesor/asistencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        body: JSON.stringify(asistencias),
      });
      if (!response.ok) throw new Error("Error al guardar la asistencia");
      alert("Asistencia guardada correctamente.");
      attendanceModal.classList.remove("active");

      if (courseSelect.value === selectedCourseId) {
        filterAndDisplayAttendance();
      }
    } catch (e) {
      alert("Error al guardar la asistencia: " + e.message);
    }
  });

  uploadBtn.addEventListener("click", function () {
    uploadModal.classList.add("active");

    setTimeout(function () {
      closeUpload.disabled = false;
    }, 2000);
  });

  closeUploadModal.addEventListener("click", function () {
    uploadModal.classList.remove("active");
  });

  closeUpload.addEventListener("click", function () {
    uploadModal.classList.remove("active");
  });
});
(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'94a06e00450bf77e',t:'MTc0ODk2NjcwMi4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
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
