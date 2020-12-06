
// The current screen viewed by the user
// Certain button presses changes this variable
// It is used in the render function to determine what to display to the user
const url = "https://exuberant-moored-horse.glitch.me"

let currentView = "signup-or-login"
// let currentView = "signup"

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
        .then(res => res.json());
};

let newPost = (endpoint, body, token = undefined) => {
    debugger
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
        .then(res => res.json());
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

    // chat box
    // get message to display
    newGet("/messages", apiToken)
        .then(body => {
            if (body.success) {
                console.log("received from /message  " + body.reason)
                for (let i = 0; i < body.messages.length; i ++) {
                    
                    let messageBox = document.createElement("div");
                    let from = JSON.stringify(body.messages[i]["from"]);
                    let content = JSON.stringify(body.messages[i]["contents"]);
                    let message = from + ": " + content
                    messageBox.innerText = message.replace(/['"]+/g, '');
                    chatBox.appendChild(messageBox);
                }
            }
        });

    // text box
    let textBox = document.createElement("input");
    

    // send message button
    let sendButton = document.createElement("button");
    sendButton.innerText = "Send message"
    sendButton.addEventListener("click", () => {
        let message = textBox.value;
        let body = {
            token: apiToken,
            contents: message,
        }
        newPost("/message", body, apiToken)
            .then(body => {
                console.log("received from /message  " + body.reason)
                
                currentView = "chatRoom";
                render();
            });
    });

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

    // title
    let title = document.createElement("div");
    title.innerText = errorEndpoint + " failed. Reason: " + errorReason;

    // home button
    let homeButton = document.createElement("button");
    homeButton.innerText = "Back to home";
    homeButton.addEventListener("click", () => {
        currentView = "signup-or-login";
        render()
    });

    container.appendChild(title);
    container.appendChild(homeButton);

    return container;
};

// [L]ogin view
let loginView = () => {
    let container = document.createElement("div")
    let usernameForm = document.createElement("div");
    let passwordForm = document.createElement("div");
    let buttonRow = document.createElement("div");

    //Title
    container.innerText = "Login";

    // Username form
    let usernameInput = document.createElement("input")
    usernameForm.innerText = "Username";

    // Password form
    let passwordInput = document.createElement("input")
    passwordForm.innerText = "Password";

    // Cancel Button
    let cancelButton = document.createElement("button")
    cancelButton.innerText = "Cancel"
    cancelButton.addEventListener("click", () => {
        currentView = "signup-or-login";
        render();
    });

    // Submit Button
    let submitButton = document.createElement("button")
    submitButton.innerText = "Submit"
    submitButton.addEventListener('click', () => {
        let username = usernameInput.value
        let password = passwordInput.value
        
        let bodyToBeSent = { username, password }
        
        newPost("/login", bodyToBeSent)
            .then(body => {
                console.log("received from /login  " + body.reason)

                if (!body.success) {
                    currentView = "errorPage";
                    errorEndpoint = "Login";
                    errorReason = body.reason;
                    render();
                } else {
                    apiToken = body.token;
                    currentView = "chatRoom";
                    render();
                }
            })
    })

    usernameForm.setAttribute("class", "flex");
    passwordForm.setAttribute("class", "flex");
    buttonRow.setAttribute("class", "flex");

    usernameForm.appendChild(usernameInput);
    passwordForm.appendChild(passwordInput);
    buttonRow.appendChild(cancelButton);
    buttonRow.appendChild(submitButton);
    
    container.appendChild(usernameForm);
    container.appendChild(passwordForm);
    container.appendChild(buttonRow);

    return container
};

// [Sign up] or login view
let signupOrLoginView = () => {
    //  You will need to modify this function
    let container = document.createElement("div");

    // login button
    let loginButton = document.createElement("button");
    loginButton.innerText = "login";
    loginButton.addEventListener("click", () => {
        currentView = "login";
        render();
    });

    // signup button
    let signupButton = document.createElement("button");
    signupButton.innerText = "signup";
    signupButton.addEventListener("click", () => {
        currentView = "signup";
        render();
    });
    container.setAttribute("class", "center");
    container.appendChild(signupButton);
    container.appendChild(loginButton);

    return container
};

// [Sign up] view
let signupView = () => {
    let container = document.createElement("div");
    let title = document.createElement("h4");
    let usernameRow = document.createElement("div");
    let passwordRow = document.createElement("div");
    let buttonRow = document.createElement("div");
    
    //Title
    title.innerText = "Sign Up";

    // Username form
    let usernameInput = document.createElement("input")
    usernameRow.innerText = "Username";

    // Password form
    let passwordInput = document.createElement("input")
    passwordRow.innerText = "Password";

    // Cancel Button
    let cancelButton = document.createElement("button")
    cancelButton.innerText = "Cancel"
    cancelButton.addEventListener("click", () => {
        currentView = "signup-or-login";
        render();
    });

    // Submit Button
    let submitButton = document.createElement("button")
    submitButton.innerText = "Submit"
    submitButton.addEventListener('click', () => {
        let username = usernameInput.value
        let password = passwordInput.value
        
        let bodyToBeSent = { username, password }
        
        newPost("/signup", bodyToBeSent)
            .then(body => {
                console.log("received from /login  " + body.reason)

                if (!body.success) {
                    currentView = "errorPage";
                    errorEndpoint = "Signup";
                    errorReason = body.reason;
                    render();
                } else {
                    alert("signup successful")
                    currentView = "login"
                    render();
                }
            });
    });
    container.setAttribute("class", "form");
    // container.setAttribute("class","test");
    // title.setAttribute("class", "test");
    // usernameRow.setAttribute("class", "form");
    // passwordRow.setAttribute("class", "form");
    // buttonRow.setAttribute("class", "form");

    usernameRow.appendChild(usernameInput);
    passwordRow.appendChild(passwordInput);
    buttonRow.appendChild(cancelButton);
    buttonRow.appendChild(submitButton);
    
    container.appendChild(title);
    container.appendChild(usernameRow);
    container.appendChild(passwordRow);
    container.appendChild(buttonRow);

    return container;
};

// render ----------------------------------------------------------------------

let render = () => {
    // Will contain a reference 
    let toRender = undefined
    // For debugging purposes
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
    document.body.innerHTML = ""
    document.body.appendChild(toRender);
}

// Initial render
render()