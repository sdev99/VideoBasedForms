const taskReducer = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TASK':
            return state.concat([action.data]);
        case 'DELETE_TASK':
            return state.filter((task) => task._id !== action.payload.id);
        case 'EDIT_TASK':
            return state.map((task) => task.id === action.id ? {...task, editing: !task.editing} : task);
        case 'UPDATE_TASK':
            return state.map((task) => {
                if (task._id === action.data._id) {
                    return {
                        ...task,
                        id: action.data.id,
                        total_time: action.data.total_time,
                        task: action.data.task,
                        comment: action.data.comment,
                        created_date: action.data.created_date,
                        submission_date: action.data.submission_date,
                        hourly_rate: action.data.hourly_rate,
                        task_status: action.data.task_status,
                        background_color: action.data.background_color,
                    }
                } else {
                    return task;
                }
            });
        case 'FETCH_TASK':
            return action.tasks;
        case 'FETCH_TASKD':
            return action.taskd;
        case 'UPDATE_TASK_TIME':
            return state.map((task) => task._id === action.data.task_id ? {
                ...task,
                total_time: action.data.time,
                time_start: 0
            } : task);
        case 'UPDATE_TASK_TIMER_STATUS':
            if (action.data.stop_all) {
                return state.map((task) => task._id === action.data.task_id ? {...task, time_start: 0} : {
                    ...task,
                    time_start: 0
                });
            } else {
                return state.map((task) => task._id === action.data.task_id ? {...task, time_start: 1} : {
                    ...task,
                    time_start: 0
                });
            }
        case 'UPDATE_TASK_COMPLETE':
            return state.map((task) => {
                if (task._id === action.data.task_id) {
                    return {
                        ...task,
                        id: task.id,
                        total_time: task.total_time,
                        task: task.task,
                        comment: task.comment,
                        created_date: task.created_date,
                        submission_date: task.submission_date,
                        hourly_rate: task.hourly_rate,
                        task_status: '3',
                        background_color: task.background_color,
                        new_status: '3'
                    }
                } else {
                    return task;
                }
            })
        case 'UPDATE_TASK_INPROGRESS':
            return state.map((task) => {
                if (task._id === action.data.id) {
                    return {
                        ...task,
                        task_status: '2',
                    }
                } else {
                    return task;
                }
            })
        default:
            return state;
    }
}
export default taskReducer;
