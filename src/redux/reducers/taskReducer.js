

import { tasksDummy } from "../../dummydata/dummydata.js";

const initialState = {
  list: [],
};

export default function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_TASKS":
      return {
        ...state,
        list: tasksDummy,
      };

    default:
      return state;
  }
}


