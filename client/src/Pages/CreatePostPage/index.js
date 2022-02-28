import React, { useState } from 'react';
import validateDate from '../../Validation/validateDate';
import 'bootstrap/dist/css/bootstrap.css';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import NavbarComponent from '../../Components/Navbar/index.js';
import Popup from '../Popup';
import api from '../../api.js';


const PostCreator = (props) => {
	const history = useHistory();
	const [popup, setPopup] = useState({});
	const params = new URLSearchParams(props.location.search);
	async function handleClickPost(e) {
		e.preventDefault();
		const formElement = e.currentTarget;
		const formData = new FormData(formElement);
		const title = formData.get('title');
		const body = formData.get('body');
		const date = formData.get('date');

		if (!validateDate(date)) {
			setPopup({
				message: 'Please enter a valid date and time or leave field empty'
			});
			formElement.querySelector('input[name="date"]').value = '';
			return;
		}
		const reqBody = { title, body };
		if (date !== '') {
			reqBody.date = date;
		}
		const res = await api.sendPostSubmitRequest(reqBody);
		if (res.status === 200) {
			if (res.data !== 'OK') {
				history.push(`/posts/${res.data}`);
			} else {
				history.push('/');
			}
		} else if (res.status === 401) {
			setPopup({ message: 'Invalid username or password. Please login again.' });
		} else {
			setPopup({ message: 'Sorry something went wrong.' });
		}
	}

	async function handleClickComment(e) {
		e.preventDefault();
		const formElement = e.currentTarget;
		const formData = new FormData(formElement);
		const body = formData.get('body');
		const res = await api.sendPostSubmitRequest({
			title: 'Comment',
			body,
			parent: params.get('parentId')
		});
		if (res.status === 200) {
			history.push(`/posts/${params.get('originalId')}`);
		} else if (res.status === 401) {
			setPopup({ message: 'Invalid username or password. Please login again.' });
		} else {
			setPopup({ message: 'Sorry something went wrong.' });
		}
	}
	return (
		<>
			<NavbarComponent />
			{popup.message && <Popup error message={popup.message} />}
			<div
				style={{
					'margin-left': '20%',
					'margin-right': '20%',
					'margin-top': '2%',
					padding: '2em'
				}}
				className='card'
			>
				<Form
					id='addPostForm'
					onSubmit={
						params.get('parentId') ? handleClickComment : handleClickPost
					}
				>
					{!params.get('parentId') && (
						<div className='form-group'>
							<label>Title</label>
							<Form.Control
								name='title'
								className='form-control'
								id='title'
								placeholder='Enter title'
							/>
						</div>
					)}
					<div className='form-group'>
						<label>Question</label>
						<Form.Control
							name='body'
							className='form-control'
							id='body'
							placeholder='Enter your question here'
						/>
					</div>
					<button type='submit' className='btn btn-primary' style={{float: 'right'}}>
						Ask!
					</button>
				</Form>
			</div>
		</>
	);
};

export default PostCreator;
