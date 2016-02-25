'use strict';

import { State } from './services/State/State';
import { Auth } from './services/Auth/Auth';
import { TextArea } from './services/TextArea/TextArea';
import { Editor } from './services/Editor/Editor';

new State();
new Auth();
new TextArea();
new Editor();

require('./styles/app.styl');