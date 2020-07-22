const keeperReducer = (state = [], action) => {
    switch (action.type) {
      case 'FETCH_KEEPER':
          return action.data;
      case 'ADD_KEEPER':
          return state = action.data;
      case 'REMOVE_KEEPER':
          return state = [];
      default:
          return state;
    }
  }
  export default keeperReducer;