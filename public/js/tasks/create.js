const accessToken = localStorage.getItem('accessToken');
const apiVersion =1;

if(!accessToken){
	window.location.href = "http://localhost:3000/";
}
document.querySelector('#createTaskForm').addEventListener('submit', async (event)=>{
	event.preventDefault()

	const title = document.querySelector('#titleInput').value;
	const description = document.querySelector('#descriptionInput').value;
	const status = document.querySelector('#status').value;

	try {
		const requestBody = { title, description, status };

		const response = await fetch('/api/tasks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				// Custom Accept header: application/vnd.myapp.{version}+json
				Accept: `application/vnd.myapp.${apiVersion}+json`,
				Authorization: accessToken ? `Bearer ${accessToken}` : '',
			},
			body: JSON.stringify(requestBody),
		});

		const json = await response.json();

		if (!response.ok) {
			if (response.status === 401) {
				console.log('we should do refresh...');
				localStorage.clear();
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

		const { task } = json.data;
		alert(`task "${title}" created successfully`)
		console.log(`task created successfully with id: ${task._id}`);

	} catch (error) {
		console.error('Network or parsing error:', error);
		alert('An unexpected error occurred. Please try again later.');
	}
})


