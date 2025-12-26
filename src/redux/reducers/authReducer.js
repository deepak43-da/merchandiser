
const initialState = {
  user: null,
  loading: false
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN_REQUEST":
      return { ...state, loading: true };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "LOGIN_FAILURE":
      return { ...state, loading: false };
    default:
      return state;
  }
}
