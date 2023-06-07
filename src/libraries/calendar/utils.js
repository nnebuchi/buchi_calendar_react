
const currentDate = new Date();
export const generateCalender = (currentMonth)=>{
   
    let weeks = [];
    let thisCurrentMonth;
    // Get the current date
    // const currentDate = new Date();
    
    // Set the start date to 1 year ago from today
    const startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());

    // Set the end date to 1 year ahead from today
    const endDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
    
    // Loop through each month between the start and end dates
    for (let month = startDate.getMonth()+currentMonth; month <= endDate.getMonth()+currentMonth; month++) {

       
        // Create a new date object for the current month
        const thisMonth = new Date(currentDate.getFullYear(), month, 1);
        let startOfFirstDayOfTheMonthUnix = (Math.floor(thisMonth.setUTCHours(0,0,0,0) ) / 1000) + 86400
        let endOfFirstDayOfTheMonthUnix = (Math.floor(thisMonth.setUTCHours(23,59,59) ) / 1000) + 86400
    
        // Get the number of days in the current month
        const numDaysInMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 0).getDate();
    
        // set the month and year header
        
        thisCurrentMonth = thisMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
       
        // Calculate the day of the week for the first day of the month
        const firstDayOfWeek = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).getDay();
    
        // Calculate the number of blank days to add before the first day of the month
        const numBlankDays = (firstDayOfWeek + 6) % 7;

        // Create an array of empty spaces for the blank days
        const blankDays = new Array(numBlankDays).fill('');

        // Create an array of days for the current month
        const monthDays = [...Array(numDaysInMonth).keys()].map(dd => { 
            const dayObject = {
                day:dd+1,
                dayStart: startOfFirstDayOfTheMonthUnix,
                dayEnd: endOfFirstDayOfTheMonthUnix
            }
            startOfFirstDayOfTheMonthUnix = startOfFirstDayOfTheMonthUnix + 86400
            endOfFirstDayOfTheMonthUnix = endOfFirstDayOfTheMonthUnix + 86400
            return dayObject
        });

        // Combine the arrays of blank days and month days
        const allDays = [...blankDays, ...monthDays];
        
        // Split the days into rows of 7
        const rows = allDays.reduce((rows, day, index) => {
           
            if (index % 7 === 0) {
                const eachWeek = allDays.slice(index, index + 7)

                if(eachWeek.length < 7){
                    const numberOfDaysLeft = (7 - eachWeek.length)
                    for (let i = 0; i < numberOfDaysLeft; i++) {
                        eachWeek.push("")
                    }
                }
                rows.push(eachWeek);
                weeks.push(eachWeek);
            }
            
            return rows;
        }, []);
    }

    return {weeks, thisCurrentMonth};
}








// export const clickHandler = () => {
//     alert('clicked')
// }

const topElements =(month) => {
    return {
        dualSide:`<div class="bjs-calendar-top-pane">
            <div class="bjs-calendar-top-left-div">
                <button class="bjs-calendar-prev" > <span> << Prev </span></button>
            
            </div>
                <div class="bjs-calendar-top-center-div>
                    <span class="text-white full-month-name">${month.thisCurrentMonth}</span>
                </div>
                <div class="bjs-calendar-top-right-div">
                    <button class="bjs-calendar-next" > <span> Next >> </span></button>
                
                </div>
                
            </div>
        `,
        classic:`<div class="bjs-calendar-top-pane">
                
                    <div class="bjs-calendar-top-month-div>
                        <span class="text-white full-month-name">${month.thisCurrentMonth}</span>
                    </div>
                    <div class="bjs-calendar-top-nav-div">
                        <span class="bjs-calendar-prev"> < </span> &nbsp;&nbsp;
                        <span class="bjs-calendar-next"> > </span>
                    </div>
                    
                </div>
            `
    }
   
}
    

export const showCalendar = async (thisMonth=0, userConfig) => {
    calendarConfig = userConfig;
    currentMonth=thisMonth
    const month = generateCalender(currentMonth);
    
    const topPane = topElements(month)[userConfig.layout]
    
    let monthHtml = `
        ${topPane}
        <div class="week">
            <div class="col day"> <span>Mon</span></div>
            <div class="col day"> <span>Tue</span></div>
            <div class="col day"> <span>Wed</span></div>
            <div class="col day"> <span>Thu</span></div>
            <div class="col day"> <span>Fri</span></div>
            <div class="col day"> <span>Sat</span></div>
            <div class="col day"> <span>Sun</span></div>
        </div>
        `;
    month?.weeks.map((week, weekIndex)=>{
        let weekHtml =`<div class="week">`;
        week.map((day, dayIndex)=>{
            let dayHtml = `<div class="day date"> ${day.day ? `<div class="day-date" start=${day.dayStart} end=${day.dayEnd} ${(day.dayStart <= today && day.dayEnd >= today) ? `id="today"` : ""} >${day.day}  </div>` : ''} </div>`;
            weekHtml+=dayHtml;
        })

        weekHtml+=`</div>`;
        monthHtml+=weekHtml;

    });
    // document.querySelector('.buchi-weeks').innerHTML = monthHtml;
    
    const nextBtn = document.querySelector('.bjs-calendar-next');
    if(nextBtn){
       nextBtn.addEventListener('click', showNextMonth); 
    }
    
    const prevBtn = document.querySelector('.bjs-calendar-prev')

    if(prevBtn){
        prevBtn.addEventListener('click', showPreviousMonth);
    }
    

    document.querySelectorAll('.day').forEach(element => {
        
        element.addEventListener('click', clickHandler); 
        
        if(typeof(calendarConfig?.eventHandlers?.mouseOverHandler) !== 'undefined'){
            element.addEventListener('mouseover', calendarConfig?.eventHandlers?.mouseOverHandler); 
        }
        if(typeof(calendarConfig?.eventHandlers?.mouseOutHandler) !== 'undefined'){
            element.addEventListener('mouseout', calendarConfig?.eventHandlers?.mouseOutHandler); 
        }
        // if(typeof(calendarConfig?.eventHandlers?.mouseUpHandler) !== 'undefined'){
        element.addEventListener('mouseup', mouseUpHandler); 
        // }
        // if(typeof(calendarConfig?.eventHandlers?.mouseDownHandler) !== 'undefined'){
        element.addEventListener('mousedown', mouseDownHandler); 
        // }

        const dayWidth = getComputedStyle(element).width
        element.style.height = dayWidth;
        element.style.width = dayWidth;

        // console.log(element.getAttribute('start'))
        
    });
          
    
}

export const showCalendarUtils = (interval, timeStamp, targetElement, count, slotCountDiff) => {
    const slotCount = (24/interval) * 60
    let slots = `<option value="">Pick Time</option>`;
    while (count < slotCount-slotCountDiff) {//1440 is number of minutes in 24 hours
        const slotUnix = parseInt(timeStamp) + 60*interval*count;
        
        const slotMicrosec = slotUnix * 1000;
        const date = new Date(slotMicrosec);
        const slotAm = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        slots += `<option unix="${slotUnix}" value="${60*interval*count}">${slotAm}</option>`;
        count = count + 1;
    }
    document.querySelector(targetElement).innerHTML = slots;
}

export const setSchedule = ()=>{
    // console.log()
    const from = document.querySelector('#buchi-from-select').value;
    const to = document.querySelector('#buchi-to-select').value;
    // console.log(highlightedDays);
    highlightedDays.forEach(function(day){
        
       
        day.values.push({
            from: parseInt(day.unix) + parseInt(from),
            to: parseInt(day.unix) + parseInt(to),
        });
       
       
    });
    selectedSlots = removeDuplicates(selectedSlots.concat(highlightedDays));

    let slotHTML = ``;
    selectedSlots.forEach(function(day){
        console.log(day);
        slotHTML+= `<div class="buchi-schedule"><h4 class="buchi-schedule-day">${day.day} <small>${new Date(day.unix * 1000).toString().slice(4, 16)}</small></h4> `;

         day.values.forEach(function(slot){
            slotHTML+=`<div class="buchi-schedule-time-slots">
            <div class="buchi-schedule-time-range">
                <div class="buchi-schedule-start-time" full-date="${new Date(slot.from * 1000).toString()}">
                ${new Date(slot.from*1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </div> 
                <div>to</div> 
                <div class="buchi-schedule-end-time" full-date="${new Date(slot.to * 1000).toString()}">${new Date(slot.to*1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
            </div>
            <div class="buchi-schedule-cancel-btn"> <div class="buchi-schedule-cancel-btn-icon"> <i class="fa fa-close"></i></div> </div>
        </div>`;
        });
        slotHTML+=`</div>`;
    });
    document.querySelector('.buchi-alloted-time-div').innerHTML = slotHTML;
    // console.log(selectedSlots);
}

const  removeDuplicates = (arr) => {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
}




// export const handleSelect = (timeStamp, targetElement, interval) => {

// }
// showCalendar(currentMonth);