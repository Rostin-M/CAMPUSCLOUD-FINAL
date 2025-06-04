document.addEventListener("DOMContentLoaded", function () {
  const calendarDays = document.getElementById("calendar-days");
  const currentMonthElement = document.getElementById("current-month");
  const prevMonthBtn = document.getElementById("prev-month-btn");
  const nextMonthBtn = document.getElementById("next-month-btn");
  const newEventBtn = document.getElementById("new-event-btn");
  const upcomingEventsList = document.getElementById("upcoming-events-list");
  const eventModal = document.getElementById("event-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const eventForm = document.getElementById("event-form");
  const eventIdInput = document.getElementById("event-id");
  const eventTitleInput = document.getElementById("event-title");
  const eventDateInput = document.getElementById("event-date");
  const eventTimeInput = document.getElementById("event-time");
  const eventLocationInput = document.getElementById("event-location");
  const modalTitle = document.getElementById("modal-title");
  const deleteEventBtn = document.getElementById("delete-event-btn");
  const eventTypeInput = document.getElementById("event-type");

  const today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  async function fetchEventos() {
    const response = await fetch("/api/profesor/eventos");
    const data = await response.json();
    return data.map((ev) => {
      let time = "Sin horario";
      if (ev.start_event && ev.end_event) {
        time = `${ev.start_event} - ${ev.end_event}`;
      } else if (ev.start_event) {
        time = ev.start_event;
      } else if (ev.end_event) {
        time = ev.end_event;
      }
      return {
        id: ev.event_id,
        title: ev.title,
        description: ev.description,
        eventType: ev.event_type,
        date: new Date(ev.due_date),
        time,
        location: ev.location || "",
        courseId: ev.course_id,
        createdBy: ev.created_by,
        createdAt: ev.created_at ? new Date(ev.created_at) : null,
      };
    });
  }

  let events = [];
  fetchEventos().then((evts) => {
    events = evts;
    renderCalendar();
  });

  function getMonthName(month) {
    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return monthNames[month];
  }

  function getShortMonthName(month) {
    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return monthNames[month];
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
  }

  function isToday(date) {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function isPast(date) {
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return date < todayWithoutTime;
  }

  function isFuture(date) {
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return date > todayWithoutTime;
  }

  function getEventsForDate(date) {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  }

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function renderCalendar() {
    currentMonthElement.textContent = `${getMonthName(
      currentMonth
    )} ${currentYear}`;

    calendarDays.innerHTML = "";

    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(currentYear, currentMonth - 1, day);

      const dayElement = document.createElement("div");
      dayElement.className = "calendar__day calendar__day--other-month";

      const dayNumber = document.createElement("div");
      dayNumber.className = "calendar__day-number";
      dayNumber.textContent = day;

      const eventsContainer = document.createElement("div");
      eventsContainer.className = "calendar__events";

      dayElement.appendChild(dayNumber);
      dayElement.appendChild(eventsContainer);
      calendarDays.appendChild(dayElement);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);

      const dayElement = document.createElement("div");
      dayElement.className = "calendar__day";
      dayElement.dataset.date = formatDateForInput(date);

      if (isToday(date)) {
        dayElement.classList.add("calendar__day--today");
      }

      const dayNumber = document.createElement("div");
      dayNumber.className = "calendar__day-number";
      dayNumber.textContent = i;

      const eventsContainer = document.createElement("div");
      eventsContainer.className = "calendar__events";

      const dayEvents = getEventsForDate(date);
      dayEvents.forEach((event) => {
        const eventElement = document.createElement("div");
        eventElement.className = "calendar__event";
        eventElement.dataset.eventId = event.id;

        if (isPast(event.date)) {
          eventElement.classList.add("calendar__event--past");
        } else if (isToday(event.date)) {
          eventElement.classList.add("calendar__event--today");
        } else {
          eventElement.classList.add("calendar__event--future");
        }

        eventElement.textContent = event.title;
        eventElement.addEventListener("click", () => openEditEventModal(event));
        eventsContainer.appendChild(eventElement);
      });

      dayElement.appendChild(dayNumber);
      dayElement.appendChild(eventsContainer);

      dayElement.addEventListener("click", (e) => {
        if (e.target === dayElement || e.target === dayNumber) {
          openNewEventModal(date);
        }
      });

      calendarDays.appendChild(dayElement);
    }

    const totalDaysDisplayed = firstDay + daysInMonth;
    const rowsNeeded = Math.ceil(totalDaysDisplayed / 7);
    const totalCells = rowsNeeded * 7;
    const remainingCells = totalCells - totalDaysDisplayed;

    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);

      const dayElement = document.createElement("div");
      dayElement.className = "calendar__day calendar__day--other-month";

      const dayNumber = document.createElement("div");
      dayNumber.className = "calendar__day-number";
      dayNumber.textContent = i;

      const eventsContainer = document.createElement("div");
      eventsContainer.className = "calendar__events";

      dayElement.appendChild(dayNumber);
      dayElement.appendChild(eventsContainer);
      calendarDays.appendChild(dayElement);
    }

    renderUpcomingEvents();
  }

  function renderUpcomingEvents() {
    upcomingEventsList.innerHTML = "";

    const sortedEvents = [...events].sort((a, b) => a.date - b.date);

    const eventsToShow = sortedEvents.slice(0, 5);

    eventsToShow.forEach((event) => {
      const eventElement = document.createElement("div");
      eventElement.className = "upcoming-events__item";
      eventElement.dataset.eventId = event.id;

      if (isPast(event.date)) {
        eventElement.classList.add("upcoming-events__item--past");
      } else if (isToday(event.date)) {
        eventElement.classList.add("upcoming-events__item--today");
      } else {
        eventElement.classList.add("upcoming-events__item--future");
      }

      const dateElement = document.createElement("div");
      dateElement.className = "upcoming-events__date";

      const dayElement = document.createElement("div");
      dayElement.className = "upcoming-events__day";
      dayElement.textContent = event.date.getDate();

      const monthElement = document.createElement("div");
      monthElement.className = "upcoming-events__month";
      monthElement.textContent = getShortMonthName(event.date.getMonth());

      dateElement.appendChild(dayElement);
      dateElement.appendChild(monthElement);

      const detailsElement = document.createElement("div");
      detailsElement.className = "upcoming-events__details";

      const titleElement = document.createElement("div");
      titleElement.className = "upcoming-events__title";
      titleElement.textContent = event.title;

      const timeElement = document.createElement("div");
      timeElement.className = "upcoming-events__time";
      timeElement.textContent = `${event.time} - ${event.location}`;

      detailsElement.appendChild(titleElement);
      detailsElement.appendChild(timeElement);

      eventElement.appendChild(dateElement);
      eventElement.appendChild(detailsElement);

      eventElement.addEventListener("click", () => openEditEventModal(event));

      upcomingEventsList.appendChild(eventElement);
    });
  }

  function openNewEventModal(date) {
    modalTitle.textContent = "Nuevo Evento";
    eventIdInput.value = "";
    eventTitleInput.value = "";
    eventDateInput.value = formatDateForInput(date);
    eventTimeInput.value = "";
    eventLocationInput.value = "";
    deleteEventBtn.classList.add("hidden");
    eventModal.style.display = "flex";
  }

  function openEditEventModal(event) {
    modalTitle.textContent = "Editar Evento";
    eventIdInput.value = event.id;
    eventTitleInput.value = event.title;
    eventDateInput.value = formatDateForInput(event.date);
    eventTimeInput.value = event.time;
    eventLocationInput.value = event.location;
    deleteEventBtn.classList.remove("hidden");
    eventModal.style.display = "flex";
    eventTypeInput.value = event.eventType || "Otro";
  }

  function closeModal() {
    eventModal.style.display = "none";
  }

  async function saveEvent(e) {
    e.preventDefault();

    const title = eventTitleInput.value;
    const dateStr = eventDateInput.value;
    const time = eventTimeInput.value;
    const location = eventLocationInput.value;
    const event_type = eventTypeInput.value;

    const [start_event, end_event] = time
      .split("-")
      .map((t) => (t ? t.trim() : null));

    const evento = {
      course_id: 1,
      title,
      description: "",
      event_type,
      due_date: dateStr + "T00:00:00",
      start_event: start_event ? `${dateStr}T${start_event}` : null,
      end_event: end_event ? `${dateStr}T${end_event}` : null,
      location,
    };

    console.log("Evento a guardar:", evento);

    try {
      await crearEventoEnBackend(evento);
      closeModal();
      events = await fetchEventos();
      renderCalendar();
    } catch (err) {
      alert("Error al guardar el evento: " + err.message);
      console.error("Error detalle:", err);
    }
  }

  async function crearEventoEnBackend(evento) {
    const csrfToken =
      document.querySelector('input[name="_csrf"]')?.value ||
      document.querySelector('meta[name="_csrf"]')?.content;

    const headers = { "Content-Type": "application/json" };
    if (csrfToken) {
      headers["X-CSRF-TOKEN"] = csrfToken;
    }

    const response = await fetch("/api/profesor/eventos", {
      method: "POST",
      headers,
      body: JSON.stringify(evento),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Respuesta backend:", response.status, errorText);
      throw new Error(
        "Error al crear el evento: " + response.status + " " + errorText
      );
    }
  }

  function deleteEvent() {
    const eventId = parseInt(eventIdInput.value);
    events = events.filter((event) => event.id !== eventId);
    closeModal();
    renderCalendar();
  }

  prevMonthBtn.addEventListener("click", function () {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar();
  });

  nextMonthBtn.addEventListener("click", function () {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar();
  });

  newEventBtn.addEventListener("click", function () {
    openNewEventModal(new Date(currentYear, currentMonth, 1));
  });

  closeModalBtn.addEventListener("click", closeModal);

  eventForm.addEventListener("submit", saveEvent);

  deleteEventBtn.addEventListener("click", deleteEvent);

  window.addEventListener("click", function (e) {
    if (e.target === eventModal) {
      closeModal();
    }
  });

  renderCalendar();
});

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'9499fa8e36b0af86',t:'MTc0ODg5OTA1OS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
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
