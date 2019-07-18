const alarm        = import("./alarms.js");
const notification = import("./notifications.js");

let button1   = document.getElementById("button1");
let timer     = document.getElementById('timer');

//helper_function
function time_helper(str) {
    if (parseInt(str, 10) < 10){
        return "0"+str
    } else return str
}

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
    text =  "<ul>";
    items_value.forEach(myFunction);
    text += "</ul>";


    timer.innerHTML = text;

    function myFunction(k) {
        if (k[0] == "0520") text
        else
            text += "<li>" + k[0].substring(0,2) + ":" + k[0].substring(2,4)+
            "&nbsp"+
            k[1]["content"]["title"]+"&nbsp&nbsp&nbsp"+k[1]["content"]["message"]+
            "<button id=\""+ k[0] +"\">X</button></li>";
    } 
}

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
}


//get and show alarms
chrome.storage.sync.get('dict', data => {
    show_alarms(data.dict);
});

//delete event
timer.addEventListener('click', function(event){
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
});

//add event
button1.addEventListener('click', function(){
    let hour   = document.getElementById("hour");
    let minute = document.getElementById("minute");
    let ID     = time_helper(hour.value)+time_helper(minute.value);
    let title  = document.getElementById("title");
    let msg    = document.getElementById("msg");
    let data_send = {
        time: {
            hour:    time_helper(hour.value),
            minute:  time_helper(minute.value),
        },
        content: {
            title:   title.value,
            message: msg.value,
            iconUrl: 'icon.png'
        }
    }

    //save alarm
    alarm.then(promose => {
        promose.setAlarm(hour.value, minute.value);
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




