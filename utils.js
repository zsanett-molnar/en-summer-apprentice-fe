
export const kebabCase = (str) => str.replaceAll(' ', '-');

export const addPurchase = (data) => {
    const purchasedEvents = 
        JSON.parse(localStorage.getItem('purchasedEvents')) || [];
    purchasedEvents.push(data);
    localStorage.setItem('purchasedEvents', JSON.stringify(purchasedEvents));
};