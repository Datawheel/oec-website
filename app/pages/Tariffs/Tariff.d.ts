interface SelectedItem {
  color: string;
  icon: string;
  id: string | number;
  name: string;
  searchIndex: string;
  type: string;
}

type HSLevel = "Section" | "HS2" | "HS4" | "HS6";
type VizType = "map" | "table";

interface TariffState {
  isGeomapAvailable: boolean;
  isLoadingPartner: boolean;
  isLoadingProduct: boolean;
  isLoadingReporter: boolean;
  isLoadingTariffs: boolean;
  partnerCuts: SelectedItem[];
  partnerOptions: any[];
  productCuts: SelectedItem[];
  productLevel: HSLevel;
  productOptions: any[];
  reporterCuts: SelectedItem[];
  reporterOptions: any[];
  tariffDatums: TariffDatum[];
  tariffError: string;
  tariffMembers: Record<string, string[]>;
  vizType: VizType;
};

interface TariffDatum {
  "Year": number;
  "Partner Country ID": string;
  "Partner Country": string;
  "Reporter Country ID": string;
  "Reporter Country": string;
  "Agreement ID": number;
  "Agreement": string;
  "Tariff": number;
  "Section"?: string;
  "Section ID"?: number;
  "HS2"?: string;
  "HS2 ID"?: number;
  "HS4"?: string;
  "HS4 ID"?: number;
  "HS6"?: string;
  "HS6 ID"?: number;
}

interface ChartConfig<T = TariffDatum> {
  aggs: {[K in keyof T]?: (d: (T[K])[]) => string | number};
  axisConfig: any;
  colorScale: keyof T | ((d: T) => number);
  colorScaleConfig: any;
  data: any[];
  fitFilter: (d: any) => boolean;
  groupBy: Array<keyof T | ((d: T) => string)>;
  time: keyof T;
  tooltipConfig: any;
  topojson: string;
  topojsonFill: (d) => string;
  total: boolean;
  zoom: boolean;
}
