document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("students-progress").style.width = "85%";
  document.getElementById("assignments-progress").style.width = "68%";
  document.getElementById("events-progress").style.width = "75%";
  document.getElementById("messages-progress").style.width = "20%";

  const upcomingClasses = [
    {
      day: "HOY",
      time: "10:00",
      name: "Matemáticas Avanzadas",
      location: "Aula 305",
      duration: "2 horas",
      attendees: ["MA", "LR", "+3"],
      type: "primary",
    },
    {
      day: "HOY",
      time: "14:30",
      name: "Tutoría Grupal",
      location: "Sala de Juntas",
      duration: "1 hora",
      attendees: ["JL", "AC", "+5"],
      type: "accent",
    },
    {
      day: "MAÑ",
      time: "09:15",
      name: "Álgebra Lineal",
      location: "Aula 201",
      duration: "1.5 horas",
      attendees: ["RG", "+8"],
      type: "gray",
    },
  ];

  const classesContainer = document.getElementById("upcoming-classes");
  upcomingClasses.forEach((classItem) => {
    const classElement = document.createElement("div");
    classElement.className = "class-item";

    const dateClass =
      classItem.type === "primary"
        ? "class-date"
        : classItem.type === "accent"
        ? "class-date class-date-accent"
        : "class-date class-date-gray";

    classElement.innerHTML = `
                    <div class="${dateClass}">
                        <div class="class-date-day">${classItem.day}</div>
                        <div class="class-date-time">${classItem.time}</div>
                    </div>
                    <div class="class-info">
                        <h3 class="class-name">${classItem.name}</h3>
                        <p class="class-details">${classItem.location} · ${
      classItem.duration
    }</p>
                    </div>
                    <div class="class-attendees">
                        <div class="attendee-avatars">
                            ${classItem.attendees
                              .map(
                                (attendee) =>
                                  `<div class="avatar avatar-sm">${attendee}</div>`
                              )
                              .join("")}
                        </div>
                        <button class="btn-icon" aria-label="Opciones">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>
                    </div>
                `;

    classesContainer.appendChild(classElement);
  });

  const chartData = [60, 75, 45, 80, 65, 90, 70, 85, 55];
  const chartContainer = document.getElementById("performance-chart");

  chartData.forEach((height, index) => {
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.style.left = `${index * 10 + 5}%`;
    bar.style.height = "0";
    chartContainer.appendChild(bar);

    setTimeout(() => {
      bar.style.height = `${height}%`;
    }, 100 * index);
  });

  const submissions = [
    {
      student: { initials: "MA", name: "María Álvarez" },
      assignment: "Ejercicios Cap. 5",
      date: "Hoy, 09:45",
      status: { type: "success", label: "Entregado" },
    },
    {
      student: { initials: "LR", name: "Luis Rodríguez" },
      assignment: "Proyecto Final",
      date: "Ayer, 18:30",
      status: { type: "warning", label: "Pendiente" },
    },
    {
      student: { initials: "AC", name: "Ana Castillo" },
      assignment: "Examen Parcial",
      date: "Ayer, 14:15",
      status: { type: "success", label: "Entregado" },
    },
    {
      student: { initials: "JL", name: "Javier López" },
      assignment: "Ejercicios Cap. 5",
      date: "15/05, 10:20",
      status: { type: "danger", label: "Atrasado" },
    },
  ];

  const submissionsTable = document.getElementById("submissions-table");
  submissions.forEach((submission) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>
                        <div class="student-info">
                            <div class="avatar">${submission.student.initials}</div>
                            <span>${submission.student.name}</span>
                        </div>
                    </td>
                    <td>${submission.assignment}</td>
                    <td class="text-gray">${submission.date}</td>
                    <td>
                        <span class="badge badge-${submission.status.type}">${submission.status.label}</span>
                    </td>
                    <td>
                        <button class="btn-action">Revisar</button>
                    </td>
                `;
    submissionsTable.appendChild(row);
  });

  const calendarGrid = document.getElementById("calendar-grid");
  const calendarDays = [
    { day: 29, otherMonth: true },
    { day: 30, otherMonth: true },
    { day: 1 },
    { day: 2 },
    { day: 3 },
    { day: 4 },
    { day: 5 },
    { day: 6 },
    { day: 7 },
    { day: 8 },
    { day: 9 },
    { day: 10 },
    { day: 11 },
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15 },
    { day: 16, hasEvent: true },
    { day: 17, isToday: true },
    { day: 18, hasEvent: true },
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23, hasEvent: true },
    { day: 24 },
    { day: 25 },
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 31 },
    { day: 1, otherMonth: true },
    { day: 2, otherMonth: true },
  ];

  calendarDays.forEach((day) => {
    const dayElement = document.createElement("div");
    let className = "calendar-day";
    if (day.otherMonth) className += " other-month";
    if (day.isToday) className += " today";
    if (day.hasEvent) className += " has-event";

    dayElement.className = className;
    dayElement.textContent = day.day;
    calendarGrid.appendChild(dayElement);
  });

  const tasks = [
    {
      title: "Revisar exámenes parciales",
      due: "Vence hoy",
      priority: { type: "danger", label: "Urgente" },
    },
    {
      title: "Preparar material para clase",
      due: "Vence mañana",
      priority: { type: "warning", label: "Media" },
    },
    {
      title: "Actualizar calificaciones",
      due: "Vence en 3 días",
      priority: { type: "primary", label: "Normal" },
    },
    {
      title: "Reunión departamento",
      due: "23 de mayo",
      priority: { type: "primary", label: "Normal" },
    },
  ];

  const taskList = document.getElementById("task-list");
  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = "task-item";
    taskElement.innerHTML = `
                    <input type="checkbox" class="task-checkbox" aria-label="Completar tarea: ${task.title}">
                    <div class="task-info">
                        <h3 class="task-title">${task.title}</h3>
                        <p class="task-due">${task.due}</p>
                    </div>
                    <span class="badge badge-${task.priority.type}">${task.priority.label}</span>
                `;
    taskList.appendChild(taskElement);
  });

  const messages = [
    {
      sender: { initials: "MA", name: "María Álvarez" },
      time: "10:45",
      text: "Profesor, tengo una duda sobre el ejercicio 3...",
    },
    {
      sender: { initials: "LR", name: "Luis Rodríguez" },
      time: "Ayer",
      text: "¿Podría revisar mi proyecto final cuando tenga...",
    },
    {
      sender: { initials: "AC", name: "Ana Castillo" },
      time: "Ayer",
      text: "Gracias por la clase de hoy, fue muy interesante...",
    },
    {
      sender: { initials: "JL", name: "Javier López" },
      time: "15/05",
      text: "Disculpe la tardanza en la entrega, tuve problemas...",
    },
  ];

  const messageList = document.getElementById("message-list");
  messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.className = "message-item";
    messageElement.innerHTML = `
                    <div class="avatar message-avatar">${message.sender.initials}</div>
                    <div class="message-content">
                        <div class="message-header">
                            <h3 class="message-sender">${message.sender.name}</h3>
                            <span class="message-time">${message.time}</span>
                        </div>
                        <p class="message-text">${message.text}</p>
                    </div>
                `;
    messageList.appendChild(messageElement);
  });

  const filterButtons = document.querySelectorAll(".btn-filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'949b2feb36f6db16',t:'MTc0ODkxMTczMC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
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
