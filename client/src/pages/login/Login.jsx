import React, { useState } from 'react'
import { Form, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import joi from 'joi';

import { inputWrapper } from '../../components/input/Input';
import { submitWrapper } from '../../components/submit/Submit';
import user from '../../services/user';

import './Login.css';

export default function Login() {
	const [account, setAccount] = useState({
		email: '',
		password: ''
	})
	const [error, setError] = useState({});
	const state = {
		data: account,
		setData: setAccount,
		error,
		setError
	}

	const schema = joi.object({
		email: joi.string()
			.email({
				minDomainSegments: 2,
				tlds: { allow: ['com', 'net'] }
			})
			.required()
			.label("Email"),
		password: joi.string()
			.alphanum()
			.min(3)
			.max(1024)
			.required()
			.label('Password')
	})

	async function doSubmit() {
		try {
			const response = await user.login(account);
			user.loginWithJwt(response.headers["x-auth-token"]);
			window.location = '/';
		}
		catch (ex) {
			if (ex.response) {
				const errors = { ...state.error, email: ex.response.data.error };
				state.setError(errors);
			}
		}
	}

	return (
		<Form data-testid='page-login'>
			<Container className='form-container'>
				<Row>
					<Col md={{ span: 8, offset: 2 }}>
						{inputWrapper('email', 'email', 'Email', state)}
						{inputWrapper('password', 'password', 'Password', state)}
						<Row className='row justify-content-between'>
							{submitWrapper('Login', state, schema, doSubmit)}
							<Link to="/register" className='register-link'>
								Not register yet?
							</Link>
						</Row>
					</Col>
				</Row>
			</Container>
		</Form >
	)
}
