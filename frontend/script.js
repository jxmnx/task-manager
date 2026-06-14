console.log("script loaded");

const API_URL = "https://task-manager-4enr.onrender.com";

// REGISTER
async function register() {
    try {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch(
            `${API_URL}/api/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        alert(data.message);

        if (response.ok) {
            window.location.href = "login.html";
        }

    } catch (error) {
        console.error(error);
        alert("Registration Failed");
    }
}

// LOGIN
async function login() {
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch(
            `${API_URL}/api/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        localStorage.setItem("token", data.token);

        alert("Login Successful");

        window.location.href = "index.html";

    } catch (error) {
        console.error(error);
        alert("Login Failed");
    }
}

// LOAD TASKS
async function loadTasks() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const response = await fetch(
        `${API_URL}/api/tasks`,
        {
            headers: {
                Authorization: token
            }
        }
    );

    const tasks = await response.json();

    if (!Array.isArray(tasks)) {
        console.log(tasks);
        return;
    }

    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {

        taskList.innerHTML += `
        <div class="task">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Status: ${task.status}</p>

            <button onclick="deleteTask('${task._id}')">
                Delete
            </button>
        </div>
        `;
    });
}

// ADD TASK
async function addTask() {

    const title =
        document.getElementById("taskTitle").value;

    const description =
        document.getElementById("taskDescription").value;

    const token =
        localStorage.getItem("token");

    await fetch(
        `${API_URL}/api/tasks`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token
            },
            body: JSON.stringify({
                title,
                description
            })
        }
    );

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";

    loadTasks();
}

// DELETE TASK
async function deleteTask(id) {

    const token =
        localStorage.getItem("token");

    await fetch(
        `${API_URL}/api/tasks/${id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: token
            }
        }
    );

    loadTasks();
}

// LOGOUT
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// AUTO LOAD TASKS
if (window.location.pathname.includes("index.html")) {
    loadTasks();
}