const apiVersion = 1;

function renderAuthLinks() {
	const login = document.createElement('p');
	const loginLink = document.createElement('a');
	loginLink.href = '/auth/login';
	loginLink.textContent = 'Login';
	login.appendChild(loginLink);

	const signup = document.createElement('p');
	const signupLink = document.createElement('a');
	signupLink.href = '/auth/signup';
	signupLink.textContent = 'Signup';
	signup.appendChild(signupLink);

	const targetElement = document.querySelector('.auth-links');
	targetElement.appendChild(login);
	targetElement.appendChild(signup);

	document.querySelector('table').classList.add('hidden')
	document.querySelector('.addTaskCto').classList.add('hidden')
}

function renderTasks(tasks) {
	document.querySelector('table').classList.remove('hidden')
	document.querySelector('.addTaskCto').classList.remove('hidden')
	document.querySelector('.user-email').textContent = tasks[0].user.email
	document.querySelector('.auth-links').innerHTML = null;

	const tasksFragment = document.createDocumentFragment();

	// biome-ignore lint/complexity/noForEach: <explanation>
	tasks.forEach((task) => {
		const tr = document.createElement('tr');
		const { id, title, description, status } = task;

		const idElem = document.createElement('td');
		idElem.textContent = id;

		const titleElem = document.createElement('td');
		titleElem.textContent = title;

		const descriptionElem = document.createElement('td');
		descriptionElem.textContent = description;

		const statusElem = document.createElement('td');
		statusElem.textContent = status;

		tr.append(idElem, titleElem, descriptionElem, statusElem);

		tasksFragment.append(tr);
	});

	document.querySelector('tbody').append(tasksFragment);
}

window.addEventListener('DOMContentLoaded', async () => {
	const accessToken = localStorage.getItem('accessToken');
	console.log('accessToken: from index page ', accessToken);

	if (!accessToken) {
		renderAuthLinks();
		return;
	}

	const defaultHeaders = {
		'Content-Type': 'application/json',
		Accept: `application/vnd.myapp.${apiVersion}+json`,
		Authorization: accessToken ? `Bearer ${accessToken}` : '',
	};

	const fetchOpts = {
		method: 'GET',
		headers: { ...defaultHeaders },
	};

	const response = await fetch('/api/tasks', fetchOpts);
	const json = await response.json();

	if (!response.ok) {
		console.log(response);
		if (response.status === 401) {
			console.log('we should do refresh...');
			const response = await fetch('/api/auth/refresh', {
				method: 'POST',
				'Content-Type': 'application/json',
				Accept: `application/vnd.myapp.${apiVersion}+json`,
			});
			const json = await response.json();
			console.log('json: ', json);
			const { accessToken } = json.data;
			if (accessToken) localStorage.setItem('accessToken', accessToken);
		}
		return;
	}

	const { tasks } = json.data;

	console.log('tasks: ', tasks);

	if (tasks) {
		renderTasks(tasks);
	}
});
