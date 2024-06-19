import axios from "axios";



const request_data = {
    from: "title",
    to: "0782824073",
    message: "sms",
    notifyUrl: "https://europe-west2-projectx-ussd-game.cloudfunctions.net/sms_notification",
};


console.log(typeof (JSON.stringify(request_data)));


// const options = {
//     headers: {
//         "content-type": "application/json",
//         "application-token": "$2a$12$jrEnz7yq19yMSjdcW1ivxeJieox4eMg/OBqowKrJo78y2HIy85eX2",
//     },
//     body: JSON.stringify(request_data),

// };
// options, JSON.stringify(request_data)
// axios.post(
//     "http://192.168.101.218:5555/api/bulksms/sms/outbound/biblegaming/requests",
//     {
//         body: JSON.stringify(request_data)
//     },
//     {
//         headers: {
//             "content-type": "application/json",
//             "application-token": "$2a$12$jrEnz7yq19yMSjdcW1ivxeJieox4eMg/OBqowKrJo78y2HIy85eX2",
//         }
//     }

// ).then(data => {
//     console.log(data)
// })


axios({
    method: 'post',
    url: 'http://192.168.101.218:5555/api/bulksms/sms/outbound/biblegaming/requests',
    data: request_data,
    headers: {
        "content-type": "application/json",
        "application-token": "$2a$12$jrEnz7yq19yMSjdcW1ivxeJieox4eMg/OBqowKrJo78y2HIy85eX2",
    }

}).then(data => {
    console.log(data)
}).catch(err => {
    console.log(err)
})