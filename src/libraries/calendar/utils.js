
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


export const removeDuplicates = (arr) => {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}


