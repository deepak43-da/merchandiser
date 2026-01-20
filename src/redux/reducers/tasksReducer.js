const initialState = {
  tasks: [], // Array of DailySchedule_Get items (with Displays)
  lastFetched: null,
};

export default function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
        lastFetched: Date.now(),
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.ID === action.payload.ID ? { ...task, ...action.payload } : task,
        ),
      };
    default:
      return state;
  }
}
