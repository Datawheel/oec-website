import vbInitialState from "./vbInitialState";

/** */
export default function vizbuilderReducer(state = vbInitialState(), action) {
  let newState;
  switch (action.type) {
    case "VB_UPDATE_CUBE_SELECTED": {
      newState = state;
      newState.cubeSelected = action.payload;
      return newState;
    }

    case "VB_UPDATE_DATA": {
      newState = state;
      newState.data = action.payload.data;
      newState.loading = action.payload.loading;
      return newState;
    }

    case "VB_UPDATE_COUNTRY_MEMBERS": {
      newState = state;
      newState.countryMembers = action.payload;
      return newState;
    }

    case "VB_UPDATE_WDI": {
      newState = state;
      newState.wdiIndicators = action.payload;
      return newState;
    }

    default: {
      return state;
    }

  }
}
