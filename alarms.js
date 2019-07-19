function timeUIchange(str) {
    if (str < 10){
        return "0" + str;
    } else return str;
};


export function setAlarm(hour, minute, date = false, period = 24*60){
    
    try {
        if(Number(hour) != hour && Number(minute) != minute && Number(minute) != date && Number(period) != period) 
            throw "Input should be number."
    } catch(error){
        console.log(error);
    };

    let whenToRing = new Date();
    
    if (date){
        whenToRing.setDate(date)
    };

    whenToRing.setHours(hour, minute, 0);
    console.log(whenToRing + " " +period + "h" );


    chrome.alarms.create( timeUIchange(hour) + timeUIchange(minute), {
        when: whenToRing.valueOf(),
        periodInMinutes: period,
    });
}


export function clearAllAlarm(){
    chrome.alarms.clearAll(function(wasCleared){
        if(wasCleared) console.log("All cleard!");
    });
};

export function clearAlarm(id){
    chrome.alarms.clear(id, function(wasCleared){
        if(wasCleared) console.log(id + " alarm is cleard!");
    });
};

export function getAllAlarm(){

    chrome.alarms.getAll(function(alarms){
        alarms.forEach(element => {
            console.log(element);
        });
    });
};

export function getAlarm(id){

    chrome.alarms.get(id, function(alarm){
        console.log(alarm.name);
    });
}