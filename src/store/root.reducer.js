import { combineReducers } from 'redux';

import { documentsReducer }  from './documents/reducer.documents'
import { streamsReducer } from './streams/reducer.streams'
import { teamsReducer } from './teams/reducer.teams';
import { sidebarReducer } from './sidebar/reducer.sidebar';
import { searchReducer } from './search/reducer.search';
import { tasksReducer } from './tasks/reducer.tasks';
import { usersReducer } from './users/reducer.users';
import { authReducer } from './auth/reducer.auth';
import { boardReducer } from './board/reducer.board'


export default combineReducers({
  documents: documentsReducer,
  streams: streamsReducer,
  teams: teamsReducer,
  sidebar: sidebarReducer,
  search: searchReducer,
  tasks: tasksReducer,
  users: usersReducer,
  auth: authReducer,
  board: boardReducer,
})