/**
 * Generates a new, empty initial state for the whole Vizbuilder.
 */
export default function initialStateFactory() {
  return {
    countryMembers: [],
    wdiIndicators: [],
    cubeSelected: {
      name: "",
      geoLevels: [],
      timeLevels: [],
      productLevels: []
    }
  };
}
