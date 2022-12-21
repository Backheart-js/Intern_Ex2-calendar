const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

let display_state = 1;

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
currentTime = {
    date: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear()
}
let monthInCalendar = date.getMonth();
let yearInCalendar = date.getFullYear();
let firstDayInMonth;
let lastDayInMonth;
let rangeOfYears = [yearInCalendar - (yearInCalendar%10), yearInCalendar - (yearInCalendar%10) + 9];

const present_date = $(".present__date");
const table = $("#table__calendar");    //bảng hiển thị trong Calendar
const time_display = $(".content__header-date");    //Kiểu thời gian đang hiển thị ở đầu bảng Calendar
const table_day_header = $(".table__header-wrapper"); //Các thứ trong tuần khi hiển thị các ngày trong tháng

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
            if (display_state === 1) {
                monthInCalendar -= 1;
                if (monthInCalendar === -1) {
                    yearInCalendar -= 1;
                    monthInCalendar = 11;
                }
            }
            else if (display_state === 2) {
                yearInCalendar -= 1;
            }
            else if (display_state === 3) {
                rangeOfYears = [rangeOfYears[0]-10,rangeOfYears[1]-10];   
            }
            _this.getFirstDayInMonth();
            _this.getLastDayInMonth();
            _this.renderCalendar();
        })

        $(".btn-next").addEventListener("click", function() {
            if (display_state === 1) {
                monthInCalendar += 1;
                if (monthInCalendar === 12) {
                    yearInCalendar += 1;
                    monthInCalendar = 0;
                }
            }
            else if (display_state === 2) {
                yearInCalendar += 1;
            }
            else if (display_state === 3) {
                rangeOfYears = [rangeOfYears[0]+10,rangeOfYears[1]+10];   
            }
            
            _this.getFirstDayInMonth();
            _this.getLastDayInMonth();
            _this.renderCalendar();
        })

        present_date.addEventListener('click', function() {
            monthInCalendar = currentTime.month;
            yearInCalendar = currentTime.year;
            display_state = 1;
            
            _this.renderCalendar()
        })

        time_display.addEventListener("click", function() {
            if (display_state < 3) {
                display_state++;
                _this.renderCalendar();
            }
            else {
                return;
            }
        })

        table.addEventListener("click", function(e) {
            const calendarNode = e.target.closest(".table__content-item");
            if(calendarNode) {
                if(display_state === 3) {
                    yearInCalendar = Number(calendarNode.dataset.year);
                    display_state--;
                }
                else if (display_state === 2) {
                    monthInCalendar = Number(calendarNode.dataset.month);
                    yearInCalendar = Number(calendarNode.dataset.year);
                    display_state--;
                }
                _this.getFirstDayInMonth();
                _this.getLastDayInMonth();
                _this.renderCalendar();
            }

        })
    },

    renderTime: function() {
        present_date.innerText = `${dayOfWeek[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    },

    renderCalendar: function() {
        if (display_state === 1) {  //Hiển thị ngày trong tháng
            table_day_header.style.display = "grid";
            table.classList.remove("grid-cols-4");
            table.classList.add("grid-cols-7");

            time_display.innerText = `${months[monthInCalendar]}, ${yearInCalendar}`;
            let daysHTML = "";
            const numOfDays = lastDayInMonth.getDate();
            const index_firstDayInMonth = firstDayInMonth.getDay();
            const lastDayPrevMonth = new Date(yearInCalendar, monthInCalendar, 0).getDate();
    
            for(let i = index_firstDayInMonth; i > 0; i--) {    //Loop những ngày của tháng trước đó
                const checkCurrentTime = currentTime.date == lastDayPrevMonth - i + 1 && currentTime.month == monthInCalendar-1 && currentTime.year == yearInCalendar;

                daysHTML += `
                    <div 
                        data-year=${yearInCalendar} 
                        data-month=${monthInCalendar-1} 
                        data-day=${lastDayPrevMonth - i + 1} 
                        class="table__content-item flex-center select-none prev-day ${checkCurrentTime ? 'active' : ''}"
                    >
                        <p class="table__content-text flex-center">${lastDayPrevMonth - i + 1}</p>
                    </div>
                `
            }
    
            for (let i = 1; i<=numOfDays; i++) {  //Loop ra những ngày trong tháng
                const checkCurrentTime = currentTime.date == i && currentTime.month == monthInCalendar && currentTime.year == yearInCalendar;

                daysHTML += `
                    <div 
                        data-year=${yearInCalendar} 
                        data-month=${monthInCalendar} 
                        data-day=${i} 
                        class="table__content-item flex-center select-none ${checkCurrentTime ? 'active' : ''}"
                    >
                        <p class="table__content-text flex-center">${i}</p>
                    </div>
                `;
            }
    
            const restOfDays = 42 - (index_firstDayInMonth + numOfDays); //Số ngày còn lại để đủ 6 hàng 7 cột (hiển thị 42 ngày)
            for (let i=1; i<= restOfDays; i++) {    //Loop những ngày của tháng sau
                daysHTML += `
                    <div 
                        data-year=${yearInCalendar} 
                        data-month=${monthInCalendar+1} 
                        data-day=${i} 
                        class="table__content-item flex-center select-none next-day"
                    >
                        <p class="table__content-text flex-center">${i}</p>
                    </div>
                `
            }
    
            table.innerHTML = daysHTML;
        }  

        else if (display_state === 2) { //Hiển thị các tháng trong năm
            table_day_header.style.display = "none";
            table.classList.remove("grid-cols-7");
            table.classList.add("grid-cols-4");

            time_display.innerText = `${yearInCalendar}`;
            let monthsHTML = "";

            for(let i = 0; i <= 11; i++) {
                const checkCurrentTime = currentTime.month == i && currentTime.year == yearInCalendar;
                
                monthsHTML += `
                    <div 
                        data-year=${yearInCalendar} 
                        data-month=${i} 
                        class="table__content-item flex-center select-none ${checkCurrentTime ? 'active' : ''}"
                        >
                        <p class="table__content-text flex-center">${months[i].slice(0,3)}</p>
                    </div>
                `   
            }

            for(let i = 0; i <= 3; i++) {
                monthsHTML += `
                    <div 
                        data-year=${yearInCalendar+1} 
                        data-month=${i} 
                        class="table__content-item flex-center select-none next-day"
                        >
                        <p class="table__content-text flex-center">${months[i].slice(0,3)}</p>
                    </div>
                `   
            }

            table.innerHTML = monthsHTML;
        }     

        else if (display_state === 3) { //Hiển thì các năm
            time_display.innerText = `${rangeOfYears[0]} - ${rangeOfYears[1]}`
            let yearsHTML = "";

            if(Math.floor((rangeOfYears[0]%100)/10) % 2 === 0) {
                for (let i = 2; i > 0; i--) {
                    const checkCurrentTime = currentTime.year == rangeOfYears[0] - i;

                    yearsHTML += `
                        <div 
                            data-year=${rangeOfYears[0] - i} 
                            class="table__content-item flex-center select-none prev-day ${checkCurrentTime ? 'active' : ''}"
                        >
                            <p class="table__content-text flex-center">${rangeOfYears[0] - i}</p>
                        </div>
                    `
                }
                for (let i = rangeOfYears[0]; i <= rangeOfYears[1]; i++) {
                    const checkCurrentTime = currentTime.year == i;

                    yearsHTML += `
                        <div 
                            data-year=${i} 
                            class="table__content-item flex-center select-none ${checkCurrentTime ? 'active' : ''}"
                        >
                            <p class="table__content-text flex-center">${i}</p>
                        </div>
                    `
                }
                for (let i = 1; i <= 4; i++) {
                    yearsHTML += `
                        <div 
                            data-year=${rangeOfYears[1] + i} 
                            class="table__content-item flex-center select-none next-day"
                        >
                            <p class="table__content-text flex-center">${rangeOfYears[1] + i}</p>
                        </div>
                    `
                }
            }
            else {
                for (let i = rangeOfYears[0]; i <= rangeOfYears[1]; i++) {
                    const checkCurrentTime = currentTime.year == i;

                    yearsHTML += `
                        <div 
                            data-year=${i} 
                            class="table__content-item flex-center select-none ${checkCurrentTime ? 'active' : ''}"
                        >
                            <p class="table__content-text flex-center">${i}</p>
                        </div>
                    `
                }
                for (let i = 1; i <= 6; i++) {
                    yearsHTML += `
                        <div 
                            data-year=${rangeOfYears[1] + i} 
                            class="table__content-item flex-center select-none next-day"
                        >
                            <p class="table__content-text flex-center">${rangeOfYears[1] + i}</p>
                        </div>
                    `
                }
            }

            table.innerHTML = yearsHTML;
        }
    },

    start: function() {
        this.getFirstDayInMonth();
        this.getLastDayInMonth();
        this.handleEvent();
        this.renderTime();
        this.renderCalendar();
    }
}

calendar.start();