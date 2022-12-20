const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

const date = new Date();
let monthInCalendar = date.getMonth();
let yearInCalendar = date.getFullYear();
let firstDayInMonth;
let lastDayInMonth;
const table = $("#table__calendar");

const calendar = {
    getFirstDayInMonth: function() {
        firstDayInMonth = new Date(yearInCalendar, monthInCalendar, 1);
    },
    
    getLastDayInMonth: function() {
        lastDayInMonth = new Date(yearInCalendar, monthInCalendar+1, 0);
    },

    handleEvent: function() {
        const _this = this;
        $(".btn-prev").addEventListener("click", function() {
            monthInCalendar -= 1;
            if (monthInCalendar === -1) {
                yearInCalendar -= 1;
                monthInCalendar = 11;
            }
            _this.getFirstDayInMonth();
            _this.getLastDayInMonth();
            _this.render();
        })
        $(".btn-next").addEventListener("click", function() {
            monthInCalendar += 1;
            if (monthInCalendar === 12) {
                yearInCalendar += 1;
                monthInCalendar = 0;
            }
            _this.getFirstDayInMonth();
            _this.getLastDayInMonth();
            _this.render();
        })
    },

    render: function() {
        $(".present__date").innerText = `${dayOfWeek[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
        $(".content__header-date").innerText = `${months[monthInCalendar]}, ${yearInCalendar}`;

        let days = "";
        const numOfDays = lastDayInMonth.getDate();
        const index_firstDayInMonth = firstDayInMonth.getDay();
        const index_lastDayInMonth = lastDayInMonth.getDay();
        console.log(index_lastDayInMonth);
        const lastDayPrevMonth = new Date(yearInCalendar, monthInCalendar, 0).getDate();

        for(let i = index_firstDayInMonth; i > 0; i--) {    //Loop những ngày của tháng trước đó
            days += `
                <div class="table__content-item flex-center select-none prev-day">
                    <p class="table__content-text flex-center">${lastDayPrevMonth - i + 1}</p>
                </div>
            `
        }

        for (let i = 1; i<=numOfDays; i++) {  //Loop ra những ngày trong tháng
            days += `
                <div class="table__content-item flex-center select-none">
                    <p class="table__content-text flex-center">${i}</p>
                </div>
            `;
        }

        const restOfDays = 42 - (index_firstDayInMonth + numOfDays); //Số ngày còn lại để đủ 6 hàng 7 cột (hiển thị 42 ngày)
        for (let i=1; i<= restOfDays; i++) {    //Loop những ngày của tháng sau
            days += `
                <div class="table__content-item flex-center select-none next-day">
                    <p class="table__content-text flex-center">${i}</p>
                </div>
            `
        }

        table.innerHTML = days;
    },

    start: function() {
        this.getFirstDayInMonth();
        this.getLastDayInMonth();
        this.handleEvent();
        this.render();
    }
}

calendar.start();