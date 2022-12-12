console.log('This is PostMaster!');

//Utility Functions
// 1.getDomElementFromString()
function getDomElementFromString(str) {
    let div = document.createElement('div');
    div.innerHTML = str;
    return div.firstElementChild;
}


//Initial count of added params
let countAddedParams = 1;

let requestJsonBox = document.getElementById('requestJsonBox');
let parametersBox = document.getElementById('parametersBox');

//Initially hide the parameters box
parametersBox.style.display = 'none';

let jsonRadio = document.getElementById('jsonRadio');
let paramsRadio = document.getElementById('paramsRadio');

//If JSON radio button is selected, hide the parameters box
jsonRadio.addEventListener('click', () => {
    parametersBox.style.display = 'none';
    requestJsonBox.style.display = 'block';
});

//If parameters radio button is selected, hide the JSON box
paramsRadio.addEventListener('click', () => {
    requestJsonBox.style.display = 'none';
    parametersBox.style.display = 'block';
});

let addParamBtn = document.getElementById('addParam');
addParamBtn.addEventListener('click', () => {
    let params = document.getElementById('params');
    let str = `
    <div class="form-row my-2 parameterFields">
            <label for="url" class="col-sm-2 col-form-label">Parameter ${countAddedParams + 1}</label>
            <div class="col-md-4">
                <input type="text" class="form-control" id="parameterKey${countAddedParams + 1}" placeholder="Enter Parameter ${countAddedParams + 1} Key">
            </div>
            <div class="col-md-4">
                <input type="text" class="form-control" id="parameterValue${countAddedParams + 1}" placeholder="Enter Parameter ${countAddedParams + 1} Value">
            </div>
            <button class="btn btn-primary deleteParam mx-2">-</button>
    </div>`;
    let paramElement = getDomElementFromString(str);
    params.appendChild(paramElement);

    //Delete parameter if clicked on '-' button
    let deleteParam = document.getElementsByClassName('deleteParam');
    for(item of deleteParam) {
        item.addEventListener('click', (e) => {
            e.target.parentElement.remove();
        });
    }
    countAddedParams++;
});

let submit = document.getElementById('submit');
submit.addEventListener('click', () => {
    // document.getElementById('responseJsonText').value = 'Please Wait.. Fetching response...;
    document.getElementById('responsePrism').innerHTML = 'Please Wait.. Fetching response...';

    //Get the values of fields entered by user
    let url = document.getElementById('url').value;
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;

    let data = {};
    //If the user has selected params add those params in an object
    if(contentType == 'params') {
        for(let i = 0; i < countAddedParams; i++) {
            if(document.getElementById('parameterKey' + (i + 1)) != undefined) {
                let key = document.getElementById('parameterKey' + (i + 1)).value;
                let value = document.getElementById('parameterValue' + (i + 1)).value;
                data[key] = value;
            }
        }
        data = JSON.stringify(data);
    } else {
        data = document.getElementById('requestJsonText').value;
    }

    //Logging values in console for debugging
    /*
    console.log("Url is ", url);
    console.log("requestType is ", requestType);
    console.log("contentType is ", contentType);
    console.log("Data is ", data);
    */
   
    //if the request type is GET, invoke fetch api to create a GET request
    if(requestType == 'GET') {
        fetch(url, {
            method: 'GET'
        }).then(response => response.text())
        .then((text) => {
            // document.getElementById('responseJsonText').value = text;
            document.getElementById('responsePrism').innerHTML = text;

            //This helps in copying the code using Prism.js
            document.getElementById('responsePrism').value = text;
            Prism.highlightAll();
        });
    } else {
        fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => response.text())
        .then((text) => {
            // document.getElementById('responseJsonText').value = text;
            document.getElementById('responsePrism').innerHTML = text;

            //This helps in copying the code using Prism.js
            document.getElementById('responsePrism').value = text;
            Prism.highlightAll();
        });
    }
});