const reportReducer = (state = [], action) => {
    switch (action.type) {
      case 'FETCH_REPORT':
        return action.data;
      case 'UPDATE_TASK_INPROGRESS_REPORT':
      return state.map((task) => {
        console.log(task._id, action.data.id)
        if(task._id === action.data.id){
          let updated_task  = task;
          updated_task.task_id.task_status = '2';
          return updated_task;
        }else{
          return task;
        }
      })
      default:
        return state;
    }
  }
  export default reportReducer;