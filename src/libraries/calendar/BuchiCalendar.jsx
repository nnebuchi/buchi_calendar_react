import { useEffect, useState } from "react";
import {generateCalender, removeDuplicates} from './utils';
import BuchiCalendarUtils from "./BuchiCalendarUtils";


const today = Date.now()/1000;
export const showNextMonth = (currentMonth) => {
    currentMonth = currentMonth+1;
    return showCalendar(currentMonth, calendarConfig);
}

export const showPreviousMonth = (currentMonth) => {
    currentMonth = currentMonth-1;
    return generateCalender(currentMonth);
    // return showCalendar(currentMonth, calendarConfig);
}


const highLightDateRange = (range) => {
    const selectedDates = [];
    document.querySelectorAll('.day-date').forEach(element => {
        const start = element.getAttribute('start');
        const end = element.getAttribute('end');

        if(parseInt(start) >= range[0] && parseInt(end) <= range[1]){ //set color fo seleted range
            
            selectedDates.push({
                start:start,
                end:end
            })
            // element.style.color = 'white';
            // element.style.backgroundColor = '#5785bd';
        }else if(start <= today && end >= today){ //set color for today if it is not a selected cell
            // element.style.backgroundColor = "#002E66";
            // element.style.color = "white";
        } else{ // set colors to normal for non selected cells
            // element.style.color = 'black';
            // element.style.backgroundColor = 'white';
        }
    });
    return selectedDates;
}


export const buchiClickHandler = (event, customHandler=null, disableDefault=false,)=>{
   
    switch (event.detail) {
        case 1: {
          if(!disableDefault){
            console.log('click');
            const range = [event.target.getAttribute('start'), event.target.getAttribute('end')]
            highLightDateRange(range)
            // highlightClickedcell
            if(customHandler!==null){
                customHandler(event)
            }
            // calendarConfig.eventHandlers?.clickHandler(event);
          }
          break;
        }
        case 2: {
          if(typeof(calendarConfig.eventHandlers?.doubleClickHandler) !== 'undefined'){
            calendarConfig.eventHandlers?.doubleClickHandler(event);
          }
          break;
        }
        
        default: {
          break;
        }
    }
    
}


const BuchiCalendar = ({calendarConfig}) => {
    const [currentMonth, setCurrentMonth] = useState(0)
    const [calendar, setCalendar] = useState(generateCalender(currentMonth));
    const [schedule, setSchedule] = useState();
    
    // const  calendarConfig={}
    const [currentRange, setCurrentRange] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [highlightedDays, setHighlightedDays] = useState([]);
    const [from, setFrom] = useState([]);
    const [to, setTo] = useState([]);
    const [selectedFrom, setSelectedFrom] = useState();
    const [selectedTo, setSelectedTo] = useState();
    
    const updateSelectedTo = (event)=>{
        setSelectedTo(event.target.value)
    }

    const updateSelectedFrom = (event)=>{
        setSelectedFrom(event.target.value)
    }

    const buchiMouseDownHandler = (event, customHandler=null, disableDefault=null)=>{
        const startingPoint = event.target.getAttribute('start');
        setCurrentRange([parseInt(startingPoint)])
        // setCurrentRange(startRange(event.target));
        if(customHandler !== null){
           return customHandler();
        }
    }

    const endRange = (dayElement, currentRange)=>{
        const endingPoint = dayElement.getAttribute('end');

        const currentRangeClone = [...currentRange];
        
        currentRangeClone.push(parseInt(endingPoint));
        const diff = currentRangeClone[1] - currentRangeClone[0];
        setCurrentRange(currentRangeClone);
        return [currentRangeClone, diff];
    }

    // const findUnixFromHighlightedDays = (day) => {
    //     // console.log(day)
    //     return function(unix){
    //         console.log(day)
    //         console.log(unix)
    //         return day.unix == unix
    //     } 
       
    // }
    const buchiMouseUpHandler = (event, customHandler=null, disableDefault=null)=>{
        const getRangeEnding = endRange(event.target, currentRange);
    
        // Generate Array of highlighted days

        
        let newHighlightedDays = [];

        let startingTime = getRangeEnding[0][0];
        while (startingTime <= getRangeEnding[0][1]) {
            
            newHighlightedDays.push({
                day:new Date(startingTime * 1000).toString().slice(0, 3),
                unix: startingTime,
                values: []
            });

            setHighlightedDays(newHighlightedDays);
            startingTime = startingTime + 86400 //add 24 hours
        }
        // End of generating Array of highlighted days
    
        const rangeDiffInsec = getRangeEnding[1]; //this the difference in seconds between the first day & the last day in the range
        let highlightedDates;
        
        if(rangeDiffInsec > 86400 ){
            highlightedDates = highLightDateRange(getRangeEnding[0]);
        }
        
        const response = {
            bjsData:{
                rangeBoundary:{
                    lower:getRangeEnding[0][0],
                    upper:getRangeEnding[0][1]
                },
                selectedDays:highlightedDates
            },
            customData: customHandler!==null ? customHandler() : null
        }
    
        event.target.setAttribute('bjs-data', JSON.stringify(response));
    
        const elementData = JSON.parse(event.target.getAttribute('bjs-data'));
        const range = [elementData.bjsData.rangeBoundary.lower, elementData.bjsData.rangeBoundary.upper]

        setCurrentRange(getRangeEnding[0]);
        
        setFrom(getSlots(30, currentRange[0], '#buchi-from-select', -2, 2));
        setTo(getSlots(30, currentRange[0], '#buchi-to-select', -1, 0));
        // showCalendarUtils(30, range[0], '#buchi-from-select', -2, 2);
        // showCalendarUtils(30, range[0], '#buchi-to-select', -1, 0);
            
    }

    const incrementCurrentMonth = () => {
        let month = [currentMonth]
        month = parseInt(month[0]) + 1;
        console.log(month)
        setCurrentMonth(month)
        // setHighlightedDays([]);
    }

     const decreaseCurrentMonth = () => {
        let month = [currentMonth]
        month = parseInt(month[0]) - 1;
        // console.log(month)
        setCurrentMonth(month)
        // setHighlightedDays([]);
    }

    const getSlots = (interval, timeStamp, targetElement, count, slotCountDiff) => {
        const slotCount = (24/interval) * 60
        // let slots = `<option value="">Pick Time</option>`;
        let slots = [];
        while (count < slotCount-slotCountDiff) {//1440 is number of minutes in 24 hours
            const slotUnix = parseInt(timeStamp) + 60*interval*count;
            const slotMicrosec = slotUnix * 1000;
            const date = new Date(slotMicrosec);
            const slotAm = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            slots.push({
                unix: slotUnix,
                value: 60*interval*count,
                am_pm: slotAm
            })

            count = count + 1;
        }
        return slots;
    }

    const arrangeSchedule = () => {
        let pickedSlots = [...selectedSlots]
        highlightedDays.forEach(function(day){
            let ms = new Date(parseInt(day.unix) * 1000)
            let startOfDayInUnix = ms.setUTCHours(0,0,0,0)/1000;

            const dayExists = pickedSlots.filter((ss)=>{
                return ss.unix == startOfDayInUnix
            });
            
            if(dayExists.length > 0 ){
                const selectedIndex = pickedSlots.indexOf(dayExists[0])
                console.log('yes');
                 
                pickedSlots[selectedIndex].values.push({
                    from: parseInt(day.unix) + parseInt(selectedFrom),
                    to: parseInt(day.unix) + parseInt(selectedTo),
                });
            }else{
                
                day.values.push({
                    from: parseInt(day.unix) + parseInt(selectedFrom),
                    to: parseInt(day.unix) + parseInt(selectedTo),
                }); 
                
                pickedSlots.push(day);
            }
            
             
        // console.log(ms.setUTCHours(0,0,0,0)/1000);
        });
        
        console.log(highlightedDays);



        
        // console.log(selectedSlots)
        // log(highlightedDays)
        // setSelectedSlots(removeDuplicates(pickedSlots.concat(removeDuplicates(highlightedDays))));
        setSelectedSlots(pickedSlots);
    }

    useEffect(()=>{
        setCalendar(generateCalender(currentMonth));
        
    }, [currentMonth]);

    useEffect(()=>{
        // console.log(highlightedDays)
    }, [highlightedDays]);

    useEffect(()=>{
        // console.log(selectedSlots)
    }, [selectedSlots]);


    
    return (
        <>
             <div className="buchi-weeks">
                <div className="bjs-calendar-top-pane">
                    
                    <div className="bjs-calendar-top-month-div">
                        <span className="full-month-name">{calendar?.thisCurrentMonth}</span>
                    </div>
                    <div className="bjs-calendar-top-nav-div">
                        <span className="bjs-calendar-prev" onClick={decreaseCurrentMonth}>{'<'} </span> &nbsp;&nbsp;
                        <span className="bjs-calendar-next" onClick={incrementCurrentMonth}> {'>'}</span>
                    </div>
                
                </div>
                <div className="week">
                    <div className="col day"> <span>Mon</span></div>
                    <div className="col day"> <span>Tue</span></div>
                    <div className="col day"> <span>Wed</span></div>
                    <div className="col day"> <span>Thu</span></div>
                    <div className="col day"> <span>Fri</span></div>
                    <div className="col day"> <span>Sat</span></div>
                    <div className="col day"> <span>Sun</span></div>
                </div>
                {calendar?.weeks?.map((week, weekIndex)=>(
                    <div className="week" key={weekIndex}>
                        {week.map((day, dayIndex)=>(
                            <div className="day date" key={dayIndex} onClick={buchiClickHandler} onMouseDown={buchiMouseDownHandler} onMouseUp={buchiMouseUpHandler}> 
                                {day.day ? 
                                <div 
                                    className="day-date" 
                                    start={day.dayStart} end={day.dayEnd} 
                                    id={(day.dayStart <= today && day.dayEnd >= today) ? "today" : ""} 
                                    style={
                                        parseInt(day.dayStart) >= currentRange[0] && parseInt(day.dayEnd) <= currentRange[1] ? {color:"white", backgroundColor:"#5785bd"} : {}
                                    }
                                >
                                    {day.day} 
                                </div> 
                                : 
                                ''} 
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            
            <BuchiCalendarUtils updateSelectedFrom={updateSelectedFrom} updateSelectedTo={updateSelectedTo} from={from} to={to} selectedSlots={selectedSlots} arrangeSchedule={arrangeSchedule} />
        </>
    )
}


export default  BuchiCalendar