const alarm        = import("./alarms.js");
const notification = import("./notifications.js");

//helper_function
function time_helper_rev(str) {
  if (parseInt(str, 10) < 10){
      return str[1]
  } else return str
}

//when background.js activates
chrome.runtime.onInstalled.addListener(function() {
    console.log("app fired");
    chrome.storage.sync.get('dict', data => {
      if(data.dict === undefined){
        console.log("dict is not setted.");
        let example = {};
        example['0520'] = { 
          time:{
            hour:'05', 
            minute: '20'
          },
          content:{
            title:   '來自霖的關心',
            message: '偶愛妳❤️',
            iconUrl: 'IMG_7884.jpg'
          }
        };
        chrome.storage.sync.set({
          dict:example
        });
      }
      else {
        console.log("list is setted.")

        for (var k in data.dict) {
          alarm.then(p => {
            let today = new Date();
            let date  = today.getDate();
            if (today.getHours() > time_helper_rev(k[0]+k[1])) {
                date = date + 1;
            } else if (today.getHours() == time_helper_rev(k[0]+k[1])) {
                if (today.getMinutes() > time_helper_rev(k[2]+k[3])) {
                    date = date + 1;
                };
            };
            p.setAlarm(time_helper_rev(k[0]+k[1]), time_helper_rev(k[2]+k[3]), date)
          });
        };
      };
    });
  });

//set notification when alarm elapsed
chrome.alarms.onAlarm.addListener(alarm => {
  console.log(alarm.name+" has notification now!");

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