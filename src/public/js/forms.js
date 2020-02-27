const signUpContainer = document.getElementById("registration-form");
const signInContainer = document.getElementById("logging-form");

const forms = document.querySelectorAll("form");
for (let f of forms) f.addEventListener("submit", submitForm);

const closeFormBtn = document.getElementsByClassName("close-window");
for (let c of closeFormBtn) c.addEventListener("click", () => c.parentElement.classList.toggle("active"));

const openSignUpForm = document.getElementById("sign-up-message").querySelector("a");
openSignUpForm.addEventListener("click", () => {
    signInContainer.classList.toggle("active");
    signUpContainer.classList.toggle("active");
});

function submitForm(e) {
    e.preventDefault();

    let form = e.target;
    let formData = new FormData(form);
    let request = new XMLHttpRequest();

    let url = "/user/" + form.dataset.type;
    request.onreadystatechange = () => {
        showValidationMessage(request, form);
    };

    request.open("POST", url, true);
    request.send(formData);
}

function showValidationMessage(request, form) {
    let div = form.querySelector(".validation-message");
    let message = div.querySelector("p");
    message.innerHTML = request.responseText;

    if (request.readyState == 4 && request.status == 200) {
        let formInputs = form.querySelectorAll("input");
        for (let f of formInputs) f.value = "";
        form.parentElement.classList.toggle("active");
        //show succesful message
    }
}

export function toggleSignClass() {
    if (!signUpContainer.classList.contains("active")) signInContainer.classList.toggle("active");
}