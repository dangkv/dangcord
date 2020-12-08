
// The current screen viewed by the user
// Certain button presses changes this variable
// It is used in the render function to determine what to display to the user
let currentView = "signup-or-login";
const url = "https://exuberant-moored-horse.glitch.me";

// global variables
let errorEndpoint = undefined;
let errorReason = undefined;
let apiToken = undefined;

let newGet = (endpoint, token = undefined) => {
    let options = {
        method: "GET",
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    };

    if (this.token !== undefined) {
        options[headers]['token'] = token;
    };

    return fetch(url + endpoint, options)
};

let newPost = (endpoint, body, token = undefined) => {
    
    let options = {
        method: "POST",
        body: JSON.stringify(body),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    };

    if (this.token !== undefined) {
        options[headers]['token'] = token;
    };

    return fetch( url + endpoint, options)
};

// views -----------------------------------------------------------------------

// [C]hat room view
let chatRoomView = () => {
    let container = document.createElement("div");
    let topPadding = document.createElement("div");
    let chatBox = document.createElement("div");
    
    // bottom padding
    let bottomPadding = document.createElement("div");
    bottomPadding.setAttribute("class", "flex");

    // refresh button
    let refreshButton = document.createElement("button");
    refreshButton.innerText = "Refresh";
    refreshButton.addEventListener("click", () => {
        currentView = "chatRoom";
        render();
    });

    let refresh = async() => {
        let response = await newGet("/messages", apiToken);
        let body = JSON.parse(await response.text());

        if (body.success) {
            console.log("received from /message  " + body.reason)
            for (let i = 0; i < body.messages.length; i ++) {
                
                let messageBox = document.createElement("div");
                let from = JSON.stringify(body.messages[i]["from"]);
                let content = JSON.stringify(body.messages[i]["contents"]);
                let message = from + ": " + content
                messageBox.innerText = message.replace(/['"]+/g, '');
                chatBox.appendChild(messageBox);
            };
        };
    };

    refresh();

    // text box
    let textBox = document.createElement("input");

    // send message button
    let sendButton = document.createElement("button");
    let sendButtonClick = async() => {
        let bodyToBeSent = {
            token: apiToken,
            contents: textBox.value,
        };
        let response = await newPost("/message", bodyToBeSent, apiToken);
        let body = JSON.parse(await response.text());

        console.log("received from /message  " + body.reason);
   
        currentView = "chatRoom";
        render();
    }
    sendButton.innerText = "Send message"
    sendButton.addEventListener("click", sendButtonClick);
    
    chatBox.setAttribute("class", "chatRoom-chat-box");
    textBox.setAttribute("class", "chatRoom-message" )
    bottomPadding.setAttribute("class","chatRoom-message-bar");

    topPadding.appendChild(refreshButton);
    bottomPadding.appendChild(textBox);
    bottomPadding.appendChild(sendButton);

    container.appendChild(topPadding);
    container.appendChild(chatBox);
    container.appendChild(bottomPadding);

    return container;
};

// [E]rror view
let errorView = () => {
    
    let container = document.createElement("div");
    let buttonContainer = document.createElement("div");

    // title
    let title = document.createElement("h3");
    title.innerText = errorEndpoint + " failed. Reason: " + errorReason;

    // home button
    let homeButton = document.createElement("button");
    homeButton.innerText = "Back to home";
    homeButton.addEventListener("click", () => {
        currentView = "signup-or-login";
        render();
    });

    title.setAttribute("class", "error-page");
    buttonContainer.setAttribute("class", "error-button");

    buttonContainer.appendChild(homeButton);
    container.appendChild(title);
    container.appendChild(buttonContainer);

    return container;
};

// [L]ogin view
let loginView = () => {
    let container = document.createElement("div");
    let form = document.createElement("form");
    let title = document.createElement("h3");
    let usernameLabel = document.createElement("div");
    let passwordLabel = document.createElement("div");
    let buttonRow = document.createElement("div");

    //Title
    title.innerText = "Login";

    // Username form
    let usernameInput = document.createElement("input");
    usernameLabel.innerText = "Username";

    // Password form
    let passwordInput = document.createElement("input");
    passwordLabel.innerText = "Password";

    // Cancel Button
    let cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel"
    cancelButton.addEventListener("click", () => {
        currentView = "signup-or-login";
        render();
    });

    // Submit Button
    let submitButton = document.createElement("button");
    let submitButtonClick = async() => {
        let username = usernameInput.value;
        let password = passwordInput.value;

        let bodyToBeSent = { username, password };

        let response = await newPost("/login", bodyToBeSent);
        let body = JSON.parse(await response.text());

        console.log("received from /login  " + body)

        if (!body.success) {
            currentView = "errorPage";
            errorEndpoint = "Login";
            errorReason = body.reason;
            render();
        } else {
            apiToken = body.token;
            currentView = "chatRoom";
            render();
        };
    };
    submitButton.innerText = "Submit"
    submitButton.addEventListener('click', submitButtonClick);

    title.setAttribute("class", "form-title");
    form.setAttribute("class", "form");
    buttonRow.setAttribute("class", "form-buttons")

    buttonRow.appendChild(cancelButton);
    buttonRow.appendChild(submitButton);

    container.appendChild(title);
    form.appendChild(usernameLabel);
    form.appendChild(usernameInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    container.appendChild(form);
    container.appendChild(buttonRow);

    return container;
};

// [Sign up] or login view
let signupOrLoginView = () => {
    //  You will need to modify this function
    let container = document.createElement("div");

    // login button
    let loginButton = document.createElement("button");
    loginButton.innerText = "Login";
    loginButton.addEventListener("click", () => {
        currentView = "login";
        render();
    });

    // signup button
    let signupButton = document.createElement("button");
    signupButton.innerText = "Signup";
    signupButton.addEventListener("click", () => {
        currentView = "signup";
        render();
    });
    container.setAttribute("class", "signup-or-login");
    container.appendChild(signupButton);
    container.appendChild(loginButton);

    return container;
};

// [Sign up] view
let signupView = () => {
    let container = document.createElement("div");
    let form = document.createElement("form");
    let title = document.createElement("h3");
    let usernameLabel = document.createElement("div");
    let passwordLabel = document.createElement("div");
    let buttonRow = document.createElement("div");
    
    // title
    title.innerText = "Sign Up";

    // username form
    let usernameInput = document.createElement("input");
    usernameLabel.innerText = "Username";

    // password form
    let passwordInput = document.createElement("input");
    passwordLabel.innerText = "Password";

    // cancel Button
    let cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.addEventListener("click", () => {
        currentView = "signup-or-login";
        render();
    });

    // submit Button
    let submitButton = document.createElement("button");
    let submitButtonClick = async() => {
        let username = usernameInput.value;
        let password = passwordInput.value;

        let bodyToBeSent = { username, password };

        let response = await newPost("/signup", bodyToBeSent);
        let body = JSON.parse(await response.text());

        console.log("received from /login  " + body)

        if (!body.success) {
            currentView = "errorPage";
            errorEndpoint = "Signup";
            errorReason = body.reason;
            render();
        } else {
            alert("signup successful")
            currentView = "login"
            render();
        };
    };
    submitButton.innerText = "Submit";
    submitButton.addEventListener('click', submitButtonClick);

    // build page
    title.setAttribute("class", "form-title");
    form.setAttribute("class", "form");
    buttonRow.setAttribute("class", "form-buttons")

    buttonRow.appendChild(cancelButton);
    buttonRow.appendChild(submitButton);
    
    container.appendChild(title);
    form.appendChild(usernameLabel);
    form.appendChild(usernameInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    container.appendChild(form);
    container.appendChild(buttonRow);

    return container;
};

// render ----------------------------------------------------------------------

let render = () => {
    let toRender = undefined

    console.log("rendering view", currentView)
    if (currentView === "signup-or-login") {
        toRender = signupOrLoginView();
    } else if (currentView === "signup") {
        toRender = signupView();
    } else if (currentView === "login") {
        toRender = loginView();
    }else if (currentView === "errorPage") {
        toRender = errorView();
    }else if (currentView === "chatRoom") {
        toRender = chatRoomView(); 
    } else {
        // woops
        alert("unhandled currentView " + currentView);
    }

    // Removes all children from the body
    document.body.innerHTML = "";
    document.body.appendChild(toRender);
}

// Initial render
render()
