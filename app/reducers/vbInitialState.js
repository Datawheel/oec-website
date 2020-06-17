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
  const cubeSelected = {
    currency: undefined,
    measure: undefined,
    geoItems: [],
    geoLevels: [],
    name: "",
    port: false,
    productItems: [],
    productLevels: [],
    timeItems: [],
    timeLevels: [],
    title: ""
  };
  return {
    API: undefined,
    data: [],
    loading: true,
    status: 200,
    countryMembers: [],
    wdiIndicators: [],
    cubeSelected,
    cubeSelectedTemp: cubeSelected,
    axisConfig: {
      xConfig: axisConfig,
      yConfig: axisConfig
    }
  };
}
