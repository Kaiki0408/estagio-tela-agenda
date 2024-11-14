const header = document.querySelector(".calendar h3");
const dates = document.querySelector(".dates");
const hours = document.querySelector(".hours");
const listHours = document.querySelector(".list-hours");
const navs = document.querySelectorAll("#prev, #next");
const toggleViewBtn = document.getElementById("toggleView");

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

let isMonthlyView = true;
let currentDate = new Date();
let month = currentDate.getMonth();
let year = currentDate.getFullYear();
let hour = currentDate.getHours();
let minutes = currentDate.getMinutes();

function getWeekRange(date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return { startOfWeek, endOfWeek };
}

function adjustDateItemsHeight() {
  const dateItems = document.querySelectorAll(".dates li");
  dateItems.forEach((li) => {
    li.style.height = isMonthlyView ? "100px" : "50px"; // Ajuste os valores conforme necessário
  });
}

function renderHours() {
  hours.innerHTML = "";
  for (let i = 0; i < 25; i++) {
    const hourText = i.toString().padStart(2, "");
    hours.innerHTML += `<li>${hourText}</li>`;
  }
}

function renderEmptyHourContainers() {
  const listHours = document.querySelector(".list-hours");

  if (!listHours) return;

  for (let i = 0; i < 24; i++) {
    const hourRow = document.createElement("div");
    hourRow.classList.add("hour-row");

    for (let j = 0; j < 7; j++) {
      const dayContainer = document.createElement("div");
      dayContainer.classList.add("day-container");
      hourRow.appendChild(dayContainer);
    }

    listHours.appendChild(hourRow);
  }
}
renderEmptyHourContainers();

function highlightCurrentHour() {
  const now = new Date();
  const currentHour = now.getHours();

  const hourItems = document.querySelectorAll(".hours li");

  hourItems.forEach((li) => li.classList.remove("current-hour"));

  if (hourItems[currentHour]) {
    hourItems[currentHour].classList.add("current-hour");
  }
}

function renderCalendar() {
  dates.innerHTML = "";
  hours.innerHTML = "";
  if (isMonthlyView) {
    hours.style.display = "none";
    listHours.style.display = "none";
    renderMonthlyView();
  } else {
    hours.style.display = "block";
    listHours.style.display = "flex";
    renderHours();
    renderWeeklyView();
    highlightCurrentHour();
  }
  adjustDateItemsHeight();
}

function renderMonthlyView() {
  header.textContent = `${months[month]} ${year}`;

  const startDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const lastDatePrevMonth = new Date(year, month, 0).getDate();

  let datesHtml = "";

  for (let i = startDay; i > 0; i--) {
    datesHtml += `<li class="inactive">${lastDatePrevMonth - i + 1}</li>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    const isToday =
      i === currentDate.getDate() &&
      month === currentDate.getMonth() &&
      year === currentDate.getFullYear();
    datesHtml += `<li${isToday ? ' class="today"' : ""}>${i}</li>`;
  }

  const lastDayOfMonth = new Date(year, month, lastDate).getDay();
  for (let i = lastDayOfMonth; i < 6; i++) {
    datesHtml += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
  }

  dates.innerHTML = datesHtml;
}

function renderWeeklyView() {
  const { startOfWeek, endOfWeek } = getWeekRange(currentDate);
  header.textContent = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;

  let datesHtml = "";

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    const isToday = day.toDateString() === new Date().toDateString();
    datesHtml += `<li${isToday ? ' class="today"' : ""}>${day.getDate()}</li>`;
  }

  dates.innerHTML = datesHtml;
}

navs.forEach((nav) => {
  nav.addEventListener("click", (e) => {
    if (isMonthlyView) {
      if (e.target.id === "prev") {
        month = month === 0 ? 11 : month - 1;
        year = month === 11 ? year - 1 : year;
      } else {
        month = month === 11 ? 0 : month + 1;
        year = month === 0 ? year + 1 : year;
      }
    } else {
      currentDate.setDate(
        currentDate.getDate() + (e.target.id === "prev" ? -7 : 7)
      );
    }
    renderCalendar();
  });
});

toggleViewBtn.addEventListener("click", () => {
  isMonthlyView = !isMonthlyView;
  toggleViewBtn.textContent = isMonthlyView ? "Semanal" : "Mensal";
  renderCalendar();
});

renderCalendar();
