/**
 * Generates a new, empty initial state for the whole Vizbuilder.
 */
export default function initialStateFactory() {
  return {
    countryMembers: [],
    wdiIndicators: [],
    cubeSelected: {
      currency: undefined,
      geoLevels: [],
      geoItems: [],
      name: "",
      productLevels: [],
      timeItems: [],
      timeLevels: []
    },
    xConfig: {
      id: "",
      name: "",
      scale: ""
    },
    yConfig: {
      id: "",
      name: "",
      scale: ""
    }
  };
}
