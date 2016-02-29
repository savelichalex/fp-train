'use strict';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

import { State } from './services/State/State';
import { Auth } from './services/Auth/Auth';
import { TextArea } from './services/TextArea/TextArea';
import { Editor } from './services/Editor/Editor';
import { Contents } from './services/Contents/Contents';

new State();
new Auth();
new TextArea();
// new Editor();
new Contents();

require('./styles/app.styl');