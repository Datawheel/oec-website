import vbInitialState from "./vbInitialState";
import {assign} from "d3plus-common";

/** */
export default function vizbuilderReducer(state = vbInitialState(), action) {
  let newState;
  switch (action.type) {
    case "VB_UPDATE_CUBE_SELECTED": {
      newState = state;
      newState.cubeSelected = action.payload;
      newState.cubeSelectedTemp = action.payload;
      return newState;
    }

    case "VB_UPDATE_CUBE_SELECTED_TEMP": {
      newState = state;
      newState.cubeSelectedTemp = action.payload;
      return newState;
    }

    case "VB_UPDATE_AXIS_CONFIG": {
      newState = state;
      const prevState = {...newState.axisConfig};
      newState.axisConfig = assign(prevState, action.payload);
      return newState;
    }

    case "VB_UPDATE_DATA": {
      newState = state;
      newState.data = action.payload.data;
      newState.loading = action.payload.loading;
      newState.API = action.payload.API;
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
