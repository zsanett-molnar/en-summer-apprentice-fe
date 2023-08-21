export const deleteOrder = async (orderID) => {
    try {
        const response = await fetch(`http://localhost:8080/order/deleteOrderByID/${orderID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Order deleted successfully');
            // You can update UI or handle success message if needed
        } else {
            console.error('Error deleting order:', response.statusText);
            // Handle error case, display an error message or perform other actions
        }
    } catch (error) {
        console.error('Error deleting order:', error);
    }
}
