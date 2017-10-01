import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import AppContainer from './components/common/AppContainer';
import '../assets/css/style.css';

render(
	<AppContainer />,
	document.getElementById('app')
);
