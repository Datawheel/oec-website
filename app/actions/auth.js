import axios from "axios";
import {
  SIGNUP_EXISTS,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS
} from "@datawheel/canon-core/src/consts";

export const signup = userData => dispatch => {

  dispatch({type: SIGNUP_REQUEST});

  axios.post("/auth/local/signup", userData)
    .then(resp => {
      axios.post("/auth/settings/change", userData)
        .then(() => {
          dispatch({type: SIGNUP_SUCCESS, payload: resp.data.user});
          if (userData.redirect) window.location = userData.redirect;
        })
        .catch(() => {
          dispatch({type: SIGNUP_SUCCESS, payload: resp.data.user});
          if (userData.redirect) window.location = userData.redirect;
        });
    })
    .catch(() => dispatch({type: SIGNUP_FAILURE, payload: {type: SIGNUP_EXISTS, payload: userData}}));

};
