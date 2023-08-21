import { displayToasterMessage  } from "../main";
export const findEvents = async (venue, eventType2) => {
    try {
        
        const response = await fetch(`http://localhost:8080/event/getEventsByTypeAndLocation?eventType=${encodeURIComponent(eventType2)}&venue=${encodeURIComponent(venue)}`);   
        
        
        if (response.ok) {
            const data = await response.json();
            console.log("Datele in be ", data);
            //displayToasterMessage("OK");
            return data;
        } else {
            
            displayToasterMessage("Error finding events1");
        }
    } catch (error) {
        displayToasterMessage("Error finding events2");
        console.log(error);
    }

    
}
