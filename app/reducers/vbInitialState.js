const axisConfig = {
  id: "",
  title: "",
  scale: "",
  selected: "Log"
};

/**
 * Generates a new, empty initial state for the whole Vizbuilder.
 */
export default function initialStateFactory() {
  return {
    data: [],
    loading: true,
    status: 200,
    countryMembers: [],
    wdiIndicators: [],
    cubeSelected: {
      currency: undefined,
      geoItems: [],
      geoLevels: [],
      name: "",
      productItems: [],
      productLevels: [],
      timeItems: [],
      timeLevels: []
    },
    axisConfig: {
      xConfig: axisConfig,
      yConfig: axisConfig
    }
  };
}
