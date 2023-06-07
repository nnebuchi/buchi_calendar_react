import BuchiCalendar from '../libraries/calendar/BuchiCalendar';
import '../libraries/calendar/calendar.css';
import { useEffect, useState } from "react";
const Calendar = () => {
    // const [currentMonth, setCurrentMonth] = useState(0);
    

    const rangeSelectHandler = () => {
        return 
        
    }

    const clickHandler = (event) => {
        console.log(event.target)
        
    }
    
    const doubleClickHandler = (event) => {
        console.log(event)
    }
    const mouseOverHandler = () => {
        // console.log("Hovered")
    }

    const mouseDownHandler = () => {
        console.log('mouse down')
    }

    const config = {
        eventHandlers:{
            clickHandler: clickHandler,
            doubleClickHandler:doubleClickHandler,
            mouseOverHandler:mouseOverHandler,
            rangeSelectHandler:rangeSelectHandler,
            mouseDownHandler:mouseDownHandler
        },
        layout:'classic',
        utils:true
    }

    

    return (
        <>  
            
            <BuchiCalendar />
        </>
    );
}

export default Calendar