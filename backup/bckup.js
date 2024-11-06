const header = document.querySelector(".calendar h3");
const dates = document.querySelector(".dates");
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

let isMonthlyView = true; // Variável para controlar a visualização
let currentDate = new Date();
let month = currentDate.getMonth();
let year = currentDate.getFullYear();

function getWeekRange(date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay()); // Define para o início da semana (domingo)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Define para o fim da semana (sábado)
  return { startOfWeek, endOfWeek };
}

function adjustDatesHeight() {
  const dateItems = document.querySelectorAll(".dates li");
  dateItems.forEach((li) => {
    li.style.height = isMonthlyView ? "" : "20px"; // Ajuste o valor "50px" para a altura desejada na visão semanal
  });
}

function renderCalendar() {
  dates.innerHTML = ""; // Limpa a exibição anterior

  if (isMonthlyView) {
    renderMonthlyView();
  } else {
    renderWeeklyView();
  }
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
    datesHtml += `<li${isToday ? ' class="today"' : ""}>
    ${day.getDate()}</li>`;
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
