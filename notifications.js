export function giveNotification(id, title, message, iconUrl = "icon.png") {
    chrome.notifications.create(
        id,{   
            type: 'basic', 
            iconUrl: iconUrl, 
            title: title, 
            message: message ,
            requireInteraction: true
        }
    );
};


