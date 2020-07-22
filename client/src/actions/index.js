import { ADD_TASK, DELETE_TASK, FETCH_TASK, UPDATE_TASK, UPDATE_TASK_TIME, UPDATE_TASK_TIMER_STATUS, FETCH_REPORT } from './types';
import axios from 'axios';
/**
 * API Url: url of the server instance.
 */
const apiUrl = 'https://spk-tasklistapp.herokuapp.com/api';
/**
 * Create task dispatcher.
 */
export const createTask = (data) => {
  return (dispatch) => {
    return axios.post(`${apiUrl}/putData`, data)
      .then(response => {

        dispatch(createTaskSuccess(response.data))
        let data ={
          task_id: response.data.data._id,
          total_time: '0',
          seq_time:  '0',
          task_status: '1'
        }
        dispatch(putTaskSequence(data));
      })
      .catch(error => {
        throw(error);
      });
  };
};

/**
 * Create task success dispatcher to redux.
 */
export const createTaskSuccess =  (response) => {
  let task = response.data;
  return {
    type: ADD_TASK,
    data: task
  }
};

/**
 * Action to put task sequence in DB.
 */
export const putTaskSequence = (data) => {
  return (dispatch) => {
    return axios.post(`${apiUrl}/putSequence`, data)
      .then(response => {
        // dispatch(createTaskSuccess(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
}

/**
 * Update the task Data in DB.
 */
export const editTask = (data) => {
  return (dispatch) => {
    return axios.post(`${apiUrl}/updateData`, data)
      .then(response => {
        dispatch(updateTaskSuccess(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

/**
 * Update Task success dispatcher.
 */
export const updateTaskSuccess =  (response) => {
  let task = response.data;
  return {
    type: UPDATE_TASK,
    data: task
  }
};

/**
 * Delete Task success dispatch to redux.
 */
export const deleteTaskSuccess = id => {
  return {
    type: DELETE_TASK,
    payload: {
      id
    }
  }
}

/**
 *  Function to delete Task by Id from DB.
 */
export const deleteTask = id => {
  return (dispatch) => {
    return axios.delete(`${apiUrl}/deleteData`, {data: {
      _id: id
    }})
      .then(response => {
        dispatch(deleteTaskSuccess(response.data._id))
      })
      .catch(error => {
        throw(error);
      });
  };
};

/**
 * Fetch Task dispatcher.
 */
export const fetchTasks = (tasks) => {
  return {
    type: FETCH_TASK,
    tasks
  }
};

/**
 * Fetch all tasks from the Database.
 */
export const fetchAllTasks = () => {
  return (dispatch) => {
    return axios.get(`${apiUrl}/getData`)
      .then(response => {
        dispatch(fetchTasks(response.data.data))
      })
      .catch(error => {
        throw(error);
      });
  };
};

/**
 * Fetch Sequences from the DB.
 */
export const fetchSequences = (data) => {
    return {
      type: FETCH_REPORT,
      data
    }
  };

/**
 * Fetch All sequences from the Database.
 */
export const fetchAllSequences = () => {
    return (dispatch) => {
      return axios.get(`${apiUrl}/getSequences`)
        .then(response => {

          dispatch(fetchSequences(response.data.data))
        })
        .catch(error => {
          throw(error);
        });
    };
  };

/**
 * Function to get Task Detail By ID.
 */
export const getTaskDetailById = (_id)=>{
  return axios.get(`${apiUrl}/getTaskDataById?_id=`+_id )
  .then(response => {
    return response.data;
  })
  .catch(error => {
    throw(error);
  });
};

/**
 * update Task status Dispatcher.
 */
export const updateTaskTimerStatus = (_id)=>{
  return {
    type: UPDATE_TASK_TIMER_STATUS,
    data: {
      task_id: _id,
      stop_all: false,
    }
  }
}

/**
 * Task Time update Dispatcher.
 */
export const updateTaskTimerStopAll = (_id)=>{
  return {
    type: UPDATE_TASK_TIMER_STATUS,
    data: {
      task_id: _id,
      stop_all: true,
    }
  }
}

/**
 * Function to update TaskTime in Databse.
 */
export const updateTaskTime = (_id, time, task_status)=>{
  return (dispatch) => {
    return axios.post(`${apiUrl}/updateTaskTime`, {_id, time, task_status})
      .then(response => {
        //dispatch(updateTaskTimeSuccess(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
}

/**
 * Function to marke the Task as Complete in DB.
 */
export const makeTaskComplete = (data) => {
  return (dispatch) => {
    return axios.post(`${apiUrl}/updateTaskComplete`, {_id: data._id})
      .then(response => {
        //dispatch(updateTaskTimeSuccess(response.data))
      })
      .catch(error => {
        throw(error);
      });
  };
}
/**
 * Update Task Time success dispatcher.
 */
export const updateTaskTimeSuccess = (data)=>{
  return {
    type: UPDATE_TASK_TIME,
    data: {
      task_id: data._id,
      time: data.time
    }
  }
}
/**
 * Update task status as Complete.
 */
export const updateTaskTimeComplete = (data)=>{
  return {
    type: 'UPDATE_TASK_COMPLETE',
    data:{
      task_id : data._id
    }
  }
}


export const updateTaskTimerStop = (_id) => {
  return {
    type: UPDATE_TASK_TIMER_STATUS,
    data: {
      task_id: _id,
      stop_all: true,
    }
  }
}
/**
 * Keep task dispatcher.
 */
export const fetchKeeper = () => {
  return {
    type: 'FETCH_THE_KEEPER',
  }
}
/**
 * Dispatcher to add task in State.
 */
export const keepRunningTask = (data) => {
  return {
    type: 'ADD_KEEPER',
    data
  }
}
/**
 * Dispatcher to remove Task from the State.
 */
export const removeRunningTask = () => {
  return {
    type: 'REMOVE_KEEPER',
  }
}
/**
 * Function to update the task status
 */
export const updateTaskInprogress = (task_id) => {
  return (dispatch) => {
    return axios.post(`${apiUrl}/updateTaskInprogress`, {_id: task_id})
      .then(response => {
        dispatch(updateTaskInprogressRedux(task_id))
      })
      .catch(error => {
        throw(error);
      });
  };
}
/**
 * Update Task status to Inprogress in State.
 */
export const updateTaskInprogressRedux = (task_id) => {
  return {
    type: 'UPDATE_TASK_INPROGRESS',
    data: {id: task_id}
  }
}
/**
 * Update Task status as In progress in Report State.
 *
 * @param {*} seq_id Sequence ID.
 */
export const updateTaskInprogressReport = (seq_id) => {
  return{
    type: 'UPDATE_TASK_INPROGRESS_REPORT',
    data: {id: seq_id}
  }
}
