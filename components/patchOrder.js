import { displayToasterMessage  } from "../main";
export const patchOrder = async (orderID, newTicketNumber, newTicketCategory) => {
    try {
        const requestBody = {
            orderID: orderID,
            numberOfTickets: newTicketNumber,
            ticketCategory: newTicketCategory
        };
        console.log("REquest",JSON.stringify(requestBody));
        const response = await fetch('http://localhost:8080/order/patchOrder', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            console.log('Order updated successfully');
            displayToasterMessage("Order updated successfully");
        } else {
            console.error('Error updating order1:', response.statusText);
            displayToasterMessage("Error updating order");
        }
    } catch (error) {
        console.error('Error updating order2:', error);
        displayToasterMessage("Error updating order");
    }
}
