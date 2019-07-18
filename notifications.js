export function giveNotification(id, title, message, iconUrl = "icon.png") {
    console.log(alarm.name+" has notification now!");
    chrome.notifications.create(
        id,{   
        type: 'basic', 
        iconUrl: iconUrl, 
        title: title, 
        message: message ,
        requireInteraction: true
    });
};


