/* @refresh reload */
import './styles/index.css'
import { render } from 'solid-js/web';
import { Router } from "@solidjs/router";
import App from './App';

const root = document.getElementById('root');

render(() => <App />, root!);
