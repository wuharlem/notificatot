const alarm        = import("./alarms.js");

let button1    = document.getElementById("button1");
let time_list  = document.getElementById('time_list');
let html_hour  = document.getElementById('hour');
let html_min   = document.getElementById('minute');
let html_title = document.getElementById('title');
let html_msg   = document.getElementById('msg');

function timeUIchange(str) {
    if (str < 10){
        return "0" + str;
    } else return str;
};

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
};

function show_alarms(dict_input) {

    let items_value = Object.keys(dict_input).map(function(key) {
        return [key, dict_input[key]];
    });

    // Create items array
    let items = Object.keys(dict_input).map(function(key) {
        return [key];
    });
    
    // Sort the array based on the second element
    items.sort();
    items_value.sort();
    console.log(items_value);

    // HTML
    text =  "<table>";
    items_value.forEach(myFunction);
    text += "</table>";


    time_list.innerHTML = text;

    function myFunction(k) {
        text += "<tr>"
        + "<th>" + k[0].substring(0,2) + ":" + k[0].substring(2,4) + "</th>"
        + "<th>" + k[1]["content"]["title"] + "</th>"
        + "<th>" + k[1]["content"]["message"] + "</th>"
        + "<th>" + "<button id=\""+ k[0] +"\">X</button><img src=\"pen.png\" class=\"icon\" id=\"" + k[0] + "\">" + "</th>"
        + "</tr>";
    }
};
 
function make_selection(id, num_start, num_end) {
    let element      = document.getElementById(id);
    let doc_fragment = document.createDocumentFragment();
    for (var i = num_start; i <= num_end; i++) {
        var option = document.createElement('option'); // create the option element
        option.value = i; // set the value property
        option.appendChild(document.createTextNode(i)); // set the textContent in a safe way.
        doc_fragment.appendChild(option); // append the option to the document fragment
    }
    element.appendChild(doc_fragment); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
};


//get and show alarms
chrome.storage.sync.get('dict', data => {
    show_alarms(data.dict);
});

//delete/modify event
time_list.addEventListener('click', function(event){
    if(event.target.tagName == "BUTTON") {
        chrome.storage.sync.get('dict', data => {
            delete data.dict[event.target['id']]
            //save alarm
            alarm.then(p => {
                p.clearAlarm(event.target['id']);
            });
            //save storage
            chrome.storage.sync.set({
                dict: data.dict
            });
            //refresh
            show_alarms(data.dict);
        });
    }

    if(event.target.tagName == "IMG") {
        chrome.storage.sync.get('dict', data => {
            let get_data = data.dict[event.target['id']]
            html_hour.value  = Number(get_data['time']['hour']);
            html_min.value   = Number(get_data['time']['minute']);
            html_title.value = get_data['content']['title'];
            html_msg.value   = get_data['content']['message'];
        });
    }
});

//add event
button1.addEventListener('click', function(){
    let hour   = document.getElementById("hour");
    let minute = document.getElementById("minute");
    let ID     = timeUIchange(hour.value)+timeUIchange(minute.value);
    let title  = document.getElementById("title");
    let msg    = document.getElementById("msg");
    let middle = document.getElementById("middle");

    if (hour.value == "hour" || minute.value == "minute") {
        middle.innerHTML = "Don't forget to set the time!"
        return;
    }

    if (title.value == "" || msg.value == "") {
        middle.innerHTML = "Don't forget to set the content!"
        return;
    }

    let data_send = {
        time: {
            hour:    timeUIchange(hour.value),
            minute:  timeUIchange(minute.value),
        },
        content: {
            title:   title.value,
            message: msg.value,
            iconUrl: 'icon.png'
        }
    }

    //save alarm
    alarm.then(promose => {
        promose.setAlarm(hour.value, minute.value, ModifyDate(hour.value, minute.value));
    }).catch(err => console.log(err));
    //save storage
    chrome.storage.sync.get('dict', data => {
        data.dict[ID] = data_send; //update

        chrome.storage.sync.set({
            dict: data.dict
        },);
        //refresh
        show_alarms(data.dict);
    });
});

make_selection('hour'  , 0, 23);
make_selection('minute', 0, 59);




