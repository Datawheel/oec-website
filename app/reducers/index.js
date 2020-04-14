import {cmsReducer} from "@datawheel/canon-cms";
import {explorerReducer} from "@datawheel/tesseract-explorer";
import vizbuilderReducer from "./vbReducer";

export default {
  cms: cmsReducer,
  explorer: explorerReducer,
  vizbuilder: vizbuilderReducer
};
