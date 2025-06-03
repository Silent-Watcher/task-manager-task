const accessToken = localStorage.getItem('accessToken');

if(accessToken){
	window.location.href = "http://localhost:3000/";
}

window.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('signupForm');
	const apiVersion = 1;

	form.addEventListener('submit', async (event) => {
		event.preventDefault();


		const email = document.querySelector('#emailInput').value;
		const password = document.querySelector('#passwordInput').value;
		const passwordConfirm = document.querySelector('#ConfirmPassInput').value;

		try {
			const requestBody = { email, password, confirmPassword: passwordConfirm };

			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// Custom Accept header: application/vnd.myapp.{version}+json
					Accept: `application/vnd.myapp.${apiVersion}+json`,
				},
				body: JSON.stringify(requestBody),
			});

			const json = await response.json();

			if (!response.ok) {
				alert(
					`register failed (${json.code || response.status}): ${json.message}`,
				);
				return;
			}

			const { accessToken, user } = json.data;

			localStorage.setItem('accessToken', accessToken);

			console.log('register successful. Token =', accessToken);

			// alert(`Welcome back, ${user.email}!`);
			window.location.href = "http://localhost:3000/";

		} catch (error) {
			console.error('Network or parsing error:', error);
			alert('An unexpected error occurred. Please try again later.');
		}
	});
});
