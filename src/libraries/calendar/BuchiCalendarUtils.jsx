// import { updateSelectedFrom } from "./utils";
const BuchiCalendarUtils = ({updateSelectedFrom, updateSelectedTo, from, to, selectedSlots, arrangeSchedule}) => {
    return(
        <div className="buchi-schedule-div">
            <div className="buchi-schedule-set-div">
                <div className="buchi-time-div">
                    <label>From</label>
                    <div>
                        <select className="buchi-form-control" name="" id="buchi-from-select" onChange={updateSelectedFrom}>
                            <option value="">Pick Time</option>
                            {from?.map((slot, index)=>(
                                <option unix={'${slot.unix}'} value={`${slot.value}`}  key={index}>{slot.am_pm}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div><strong><i className="fa fa-long-arrow-right"></i></strong></div>
                <div className="buchi-time-div">
                    <label>To</label>
                    <div>
                        <select className="buchi-form-control" name="" id="buchi-to-select" onChange={updateSelectedTo}>
                            <option value="">Pick Time</option>
                            {to?.map((slot, index)=>(
                                <option unix={'${slot.unix}'} value={`${slot.value}`}  key={index}>{slot.am_pm}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="buchi-time-add-div" onClick={arrangeSchedule}>
                    <div className="buchi-add-icon-div"><i className="fa fa-plus"></i></div>
                    <span className="buchi-time-add-text">Add Schedule</span>
                </div>
            </div>
            <div className="buchi-alloted-time-div">
                <h3 className="buchi-schedules-title">Your Schedules</h3>
                {selectedSlots.length > 0 ?
                    selectedSlots.map((day, dayIndex)=>(
                        <div className="buchi-schedule" key={dayIndex}>
                            <h4 className="buchi-schedule-day">{day.day}  
                                <small> {new Date(day.unix * 1000).toString().slice(4, 16)} </small>
                            </h4>
                            {day.values.map((slot, slotIndex)=>(
                                <div className="buchi-schedule-time-slots" key={slotIndex}>
                                    <div className="buchi-schedule-time-range">
                                        <div className="buchi-schedule-start-time" full-date={'${new Date(slot.from * 1000).toString()}'}>
                                        {new Date(slot.from*1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                        </div> 
                                        <div>to</div> 
                                        <div className="buchi-schedule-end-time" full-date={'${new Date(slot.to * 1000).toString()}'}>{new Date(slot.to*1000).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                                    </div>
                                    <div className="buchi-schedule-cancel-btn"> <div className="buchi-schedule-cancel-btn-icon"> <i className="fa fa-close"></i></div> </div>
                                </div>
                            ))}
                        </div>
                    ))
                :
                    <div className="buchi-schedule"><p>No schedule</p></div>}
                
            </div>
        </div>
    );
    
}


export default BuchiCalendarUtils