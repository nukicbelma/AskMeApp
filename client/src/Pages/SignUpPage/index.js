import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import NavbarComponent from '../../Components/Navbar/index.js';
import Popup from '../Popup';
import validatePassword from '../../Validation/validatePassword.js';
import validateUsername from '../../Validation/validateUsername.js';
import api from '../../api.js';

const SignupPage = (props) => {
	const history = useHistory();
	const [formAttributes, setFormAttributes] = useState({
		username: '',
		email: '',
		firstname: '',
		lastname: '',
		formError: 'email format is not valid, password is too short'
	});

	async function handleClick(e) {
		e.preventDefault();
		const formElement = document.querySelector('form');
		const formData = new FormData(formElement);
		const email = formData.get('email');
		const password = formData.get('password');
		const firstname = formData.get('firstname');
		const lastname = formData.get('lastname');

		const res = await api.signup({
			email,
			password, 
			firstname,
			lastname
		});

		if (res.status === 200) {
			// redirect to success page if result is a success
			history.push('/');
		} else if (res.status === 400) {
			const result = res.data;
			setFormAttributes({ formError: result.validation.body.message });
		}
	}
	function handleUserInput(e) {
		const formElement = e.currentTarget;
		const formData = new FormData(formElement);
		const email = formData.get('email');
		const password = formData.get('password');
		const emailError = validateUsername(email);
		const passwordError = validatePassword(password);
		const formError = [];
		if (emailError !== 'valid') {
			formError.push(emailError);
		}
		if (passwordError !== 'valid') {
			formError.push(passwordError);
		}
		if (formError.length === 0) {
			setFormAttributes({ email, password });
		} else {
			setFormAttributes({
				email,
				password,
				formError: formError.join(', ')
			});
		}
	}
	return (
		<>
			<NavbarComponent />
			{formAttributes.formError ? (
				<Popup message={formAttributes.formError} error />
			) : (
				<Popup message='email and password look good!' />
			)}
			<div
				style={{
					marginLeft: '20%',
					marginRight: '20%',
					marginTop: '2%',
					padding: '2.5em'
				}}
				className='card'
			>
				<Form
					id='addUserForm'
					onSubmit={handleClick}
					onChange={handleUserInput}
				>
					<Form.Group>
						<Form.Label>Email</Form.Label>
						<Form.Control
							name='email'
							className='form-control'
							id='email'
							placeholder='Enter email'
							value={formAttributes.email}
						/>
					</Form.Group>
					<Form.Group className='form-group'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							name='password'
							className='form-control'
							id='password'
							placeholder='Enter password'
							value={formAttributes.password}
						/>
					</Form.Group>
					<Form.Group className='form-group'>
						<Form.Label>First name</Form.Label>
						<Form.Control
							type='firstname'
							name='firstname'
							className='form-control'
							id='firsname'
							placeholder='Enter first name'
							value={formAttributes.firstname}
						/>
					</Form.Group>
					<Form.Group className='form-group'>
						<Form.Label>Last name</Form.Label>
						<Form.Control
							type='lastname'
							name='lastname'
							className='form-control'
							id='lastname'
							placeholder='Enter last name'
							value={formAttributes.lastname}
						/>
					</Form.Group>
					<button type='submit' className='btn btn-primary' style={{float: 'right'}}>
						Sign up!
					</button>
				</Form>
			</div>
		</>
	);
};

export default SignupPage;
