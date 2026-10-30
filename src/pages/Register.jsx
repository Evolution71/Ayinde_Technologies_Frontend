import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Old standalone sign-up form. It never sent the terms or CAPTCHA fields, so every
 * sign-up failed with "accept the Privacy Policy and Terms". Sign-up now lives in
 * AuthForms (the "Create account" tab on /login). This component only redirects.
 */
const Register = () => <Navigate to="/login" replace state={{ mode: 'register' }} />;

export default Register;
