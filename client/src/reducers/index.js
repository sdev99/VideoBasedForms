import { combineReducers } from 'redux';
import tasks from './taskReducer';
import report from './reportReducer';
import keeper from './keeperReducer';
import temptask from './keepTaskReducer';
export default combineReducers({
    tasks: tasks,
    report: report,
    keeper: keeper,
    temptask: temptask
});