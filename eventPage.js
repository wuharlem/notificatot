const alarm        = import("./alarms.js");
const notification = import("./notifications.js");

function ModifyDate(hour, minute) {
  let today = new Date();
  let date  = today.getDate();
  if (today.getHours() > hour) {
    date = date + 1;
  } else if (today.getHours() == hour) {
      if (today.getMinutes() > minute) {
          date = date + 1;
      };
  };
  return date
}

//when background.js activates
chrome.runtime.onInstalled.addListener(function() {
    console.log("App fired!");
    chrome.storage.sync.get('dict', data => {
      if(data.dict === undefined){
        console.log("Initiate the app.");

        let dummy_data = {};
        dummy_data['1200'] = { 
          time:{
            hour:'12', 
            minute: '00',
            period: '24'
          },
          content:{
            title:   'Sample',
            message: 'Get your own notice!',
            iconUrl: 'icon.jpg'
          }
        };
        chrome.storage.sync.set({
          dict:dummy_data
        });
      }
      else {
        console.log("Alarms and notifications set.");

        for (let k in data.dict) {
          alarm.then(p => {
            p.setAlarm(
              Number((k.substring(0, 2))),
              Number((k.substring(2, 4))), 
              ModifyDate(Number(k.substring(0, 2)), Number((k.substring(2, 4)))),
              Number((data.dict[k]["time"]["period"]))
            );
          });
        };
      };
    });
  });

//set notification when alarm elapsed
chrome.alarms.onAlarm.addListener(alarm => {
  chrome.storage.sync.get('dict', data => {
    let info = data.dict[alarm.name];
    
    notification.then(p => {
      p.giveNotification(
        alarm.name, 
        info["content"]["title"], 
        info["content"]["message"],
      );
    });
  });
});