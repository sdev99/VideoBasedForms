const keepTaskReducer = (state = [], action) => {
    switch (action.type) {
      case 'FETCH_TEMP_TASK':
          return state;
      case 'KEEP_TEMP_TASK':
          return state = action.data;
      case 'REMOVE_TEMP_TASK':
          return state = [];
      default:
          return state;
    }
  }
  export default keepTaskReducer;