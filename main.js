document.getElementById('login-btn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('https://json-with-auth.onrender.com/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        const userAuthToken = data.token;
        const userId = data.userId;

        // Store in local storage
        localStorage.setItem('userAuthToken', userAuthToken);
        localStorage.setItem('userId', userId);

        // Display welcome notification
        document.getElementById('notification-container').innerText = `Hey ${username}, welcome back!`;
    } else {
        alert('Login failed. Please check your credentials.');
    }
});


document.getElementById('fetch-todos-btn').addEventListener('click', async () => {
    const userId = localStorage.getItem('userId');
    const userAuthToken = localStorage.getItem('userAuthToken');

    const response = await fetch(`https://json-with-auth.onrender.com/todos?userId=${userId}`, {
        headers: {
            'Authorization': `Bearer ${userAuthToken}`
        }
    });

    if (response.ok) {
        const todos = await response.json();
        const todosContainer = document.getElementById('todos-container');
        todosContainer.innerHTML = '';

        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.innerHTML = `
                <input type="checkbox" id="todo-${todo.id}" ${todo.completed ? 'checked' : ''}>
                <label for="todo-${todo.id}">${todo.title}</label>
            `;
            todosContainer.appendChild(todoItem);

            document.getElementById(`todo-${todo.id}`).addEventListener('change', async (e) => {
                const isChecked = e.target.checked;

                await fetch(`https://json-with-auth.onrender.com/todos/${todo.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userAuthToken}`
                    },
                    body: JSON.stringify({ completed: isChecked })
                });
            });
        });
    } else {
        alert('Failed to fetch todos.');
    }
});
