import {ButtonGroup, FormGroup, Intent, Spinner, Button} from "@blueprintjs/core";
import SelectMultiHierarchy from "components/SelectMultiHierarchy";
import React from "react";
import {withNamespaces} from "react-i18next";
import {
  countryColor,
  countryIcon,
  countryLevels,
  productColor,
  productIcon,
  productLevels,
  productDetail,
  vizTypes
} from "./constants";
import {addSelectedItem, removeSelectedItem} from "./toolbox";
import IconTooltip from "components/IconTooltip";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {boolean} disableGeomap
 * @property {TariffState["isLoadingPartner"]} isLoadingPartner
 * @property {TariffState["isLoadingProduct"]} isLoadingProduct
 * @property {TariffState["isLoadingReporter"]} isLoadingReporter
 * @property {(key: keyof TariffState, value: TariffState[key]) => void} [onChange]
 * @property {TariffState["partnerCuts"]} partnerCuts
 * @property {TariffState["partnerOptions"]} partnerOptions
 * @property {TariffState["productCuts"]} productCuts
 * @property {TariffState["productLevel"]} productLevel
 * @property {TariffState["productOptions"]} productOptions
 * @property {TariffState["reporterCuts"]} reporterCuts
 * @property {TariffState["reporterOptions"]} reporterOptions
 * @property {TariffState["vizType"]} vizType
 */

/** @type {React.FC<import("react-i18next").WithNamespaces & OwnProps>} */
const TariffControls = props => {
  const {
    onChange,
    partnerCuts,
    productCuts,
    productLevel,
    reporterCuts,
    t,
    vizType
  } = props;

  /**
   * @param {keyof TariffState} key
   * @param {TariffState[key]} value
   */
  const safeChangeHandler = (key, value) =>
    typeof onChange === "function" && onChange(key, value);

  const spinner = <Spinner size={Spinner.SIZE_SMALL} />;

  const productLevelDepth = productCuts.length > 0
    ? productLevels.indexOf(productCuts[0].type)
    : 0;

  return (
    <div className={props.className}>
      <FormGroup
        className="field-lg"
        label={
          <React.Fragment>
            <span>{t("tariffsexplorer_label_reporter")}</span>
            <IconTooltip
              className="tooltip-info"
              icon="info-sign"
              content={t("tariffsexplorer_tooltip_country")}
            />
          </React.Fragment>
        }>
        <SelectMultiHierarchy
          getColor={countryColor}
          getIcon={countryIcon}
          inputRightIcon={props.isLoadingReporter && spinner}
          items={props.reporterOptions}
          levels={countryLevels}
          placeholder={t("tariffsexplorer_placeholder_allreporters")}
          selectedItems={reporterCuts}
          onClear={() => safeChangeHandler("reporterCuts", [])}
          onItemSelect={item =>
            safeChangeHandler("reporterCuts", addSelectedItem(reporterCuts, item))
          }
          onItemRemove={(evt, item) => {
            evt.stopPropagation();
            safeChangeHandler("reporterCuts", removeSelectedItem(reporterCuts, item));
          }}
        />
      </FormGroup>

      <FormGroup
        className="field-lg"
        label={
          <React.Fragment>
            <span>{t("tariffsexplorer_label_partner")}</span>
            <IconTooltip
              className="tooltip-info"
              icon="info-sign"
              content={t("tariffsexplorer_tooltip_country")}
            />
          </React.Fragment>
        }>
        <SelectMultiHierarchy
          getColor={countryColor}
          getIcon={countryIcon}
          inputRightIcon={props.isLoadingPartner && spinner}
          items={props.partnerOptions}
          levels={countryLevels}
          placeholder={t("tariffsexplorer_placeholder_allpartner")}
          selectedItems={partnerCuts}
          onClear={() => safeChangeHandler("partnerCuts", [])}
          onItemSelect={item =>
            safeChangeHandler("partnerCuts", addSelectedItem(partnerCuts, item))
          }
          onItemRemove={(evt, item) => {
            evt.stopPropagation();
            safeChangeHandler("partnerCuts", removeSelectedItem(partnerCuts, item));
          }}
        />
      </FormGroup>

      <FormGroup
        className="field-lg"
        label={
          <React.Fragment>
            <span>{t("tariffsexplorer_label_products")}</span>
            <IconTooltip
              className="tooltip-info"
              icon="info-sign"
              content={t("tariffsexplorer_tooltip_product")}
            />
          </React.Fragment>
        }>
        <SelectMultiHierarchy
          getColor={productColor}
          getIcon={productIcon}
          inputRightIcon={props.isLoadingProduct && spinner}
          items={props.productOptions}
          levels={productLevels}
          placeholder={t("tariffsexplorer_placeholder_allproducts")}
          selectedItems={productCuts}
          onClear={() => safeChangeHandler("productCuts", [])}
          onItemSelect={item => {
            safeChangeHandler("productCuts", addSelectedItem(productCuts, item));
            const currentDepth = productLevels.indexOf(productLevel);
            const itemDepth = productLevels.indexOf(item.type);
            if (currentDepth < itemDepth) {
              safeChangeHandler("productLevel", productDetail[item.type]);
            }
          }}
          onItemRemove={(evt, item) => {
            evt.stopPropagation();
            safeChangeHandler("productCuts", removeSelectedItem(productCuts, item));
          }}
        />
      </FormGroup>

      <FormGroup className="field-md" label={t("tariffsexplorer_label_productdepth")}>
        <ButtonGroup>
          <Button
            disabled={productLevelDepth > 0}
            intent={Intent[productLevel === "Section" ? "PRIMARY" : "NONE"]}
            onClick={() => safeChangeHandler("productLevel", "Section")}
            text="Section"
          />
          <Button
            disabled={productLevelDepth > 1}
            intent={Intent[productLevel === "HS2" ? "PRIMARY" : "NONE"]}
            onClick={() => safeChangeHandler("productLevel", "HS2")}
            text="HS2"
          />
          <Button
            disabled={productLevelDepth > 2}
            intent={Intent[productLevel === "HS4" ? "PRIMARY" : "NONE"]}
            onClick={() => safeChangeHandler("productLevel", "HS4")}
            text="HS4"
          />
          <Button
            disabled={productLevelDepth > 3}
            intent={Intent[productLevel === "HS6" ? "PRIMARY" : "NONE"]}
            onClick={() => safeChangeHandler("productLevel", "HS6")}
            text="HS6"
          />
        </ButtonGroup>
      </FormGroup>

      <FormGroup className="field-sm" label={t("tariffsexplorer_label_viztype")}>
        <ButtonGroup className="viz-selector">
          <Button
            disabled={props.disableGeomap}
            intent={Intent[vizType === vizTypes.GEOMAP ? "PRIMARY" : "NONE"]}
            onClick={() => safeChangeHandler("vizType", vizTypes.GEOMAP)}
            text={t("tariffsexplorer_viztype_geomap")}
          />
          <Button
            intent={Intent[vizType === vizTypes.TABLE ? "PRIMARY" : "NONE"]}
            onClick={() => safeChangeHandler("vizType", vizTypes.TABLE)}
            text={t("tariffsexplorer_viztype_table")}
          />
        </ButtonGroup>
      </FormGroup>

      {props.children}
    </div>
  );
};

export default withNamespaces()(TariffControls);
