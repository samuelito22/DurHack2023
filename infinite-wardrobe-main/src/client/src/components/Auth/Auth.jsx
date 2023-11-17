import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import styles from './styles.module.css';
import spaceImage from '../../assets/space1.png';

const cookies = new Cookies();

const initialState = {
    username: '',
    password: ''
}

const Auth = () => {
    const [form, setForm] = useState(initialState);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password } = form;

        const headers = {
            'Content-Type': 'application/json'
        }

        const body = {
            'username': username,
            'password': password
        }

        const res = await axios.post('/api/auth/login', body, {
            headers: headers,
            withCredentials: true
        });
        
        console.log(res);

        // if(res.status !== 200) {
        //     alert('Invalid credentials');
        //     return;
        // }

        window.location.reload();
    }

    return (
        <div className={styles.auth__form_container}>
            <div className={styles.auth__form_container_fields}>
                <div className={styles.auth__form_container_fields_content}>
                    <p>Signin</p>
                    <form>
                        <div className={styles.auth__form_container_fields_content_input}>
                            <label htmlFor="username">Username</label>
                            <input
                                name="username"
                                type="text"
                                placeholder="Username"
                                onChange={handleChange}
                                required
                                />
                        </div>
                        <div className={styles.auth__form_container_fields_content_input}>
                            <label htmlFor="password">Password</label>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                required
                                />
                        </div>
                        <div className={styles.auth__form_container_fields_content_button}>
                            <input type="button" onClick={handleSubmit} value="Sign In" />
                        </div>
                    </form>
                </div>
            </div>
            <div className={styles.auth__form_container_image}>
                <img src={ spaceImage } alt="sign in"/>
            </div>
        </div>
    )
}

export default Auth