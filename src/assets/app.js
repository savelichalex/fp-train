'use strict';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

import { State } from './services/State/State';
import { Router } from './services/Router/Router';
import { Auth } from './services/Auth/Auth';
import { Contents } from './services/Contents/Contents';
import { Lecture } from './services/Lecture/Lecture';
import { Interpreter } from './services/Interpreter/Interpreter';
import { Task } from './services/Task/Task';

require('codemirror/mode/clojure/clojure');

new State();
new Auth();
new Contents();
new Lecture();
new Task();
new Interpreter();
new Router();

require('./styles/app.styl');
require('codemirror/lib/codemirror.css');