import {NonIdealState, Spinner} from "@blueprintjs/core";
import React from "react";
import {withNamespaces} from "react-i18next";

/**
 * @typedef OwnProps
 * @property {string} [className]
 * @property {string} error
 * @property {boolean} isLoading
 * @property {boolean} isEmpty
 */

/** @type {React.FC<import("react-i18next").WithNamespaces & OwnProps>} */
const TariffViz = props => {
  const {t} = props;

  if (props.isLoading) {
    return (
      <NonIdealState
        className={props.className}
        icon={<Spinner size={Spinner.SIZE_LARGE} />}
        title={t("Loading.title")}
      />
    );
  }

  if (props.error) {
    return (
      <NonIdealState
        className={props.className}
        description={props.error}
        icon="error"
        title={t("tariffsexplorer_transient_error")}
      />
    );
  }

  if (props.isEmpty) {
    return (
      <NonIdealState
        className={props.className}
        icon="error"
        title={t("tariffsexplorer_transient_empty")}
      />
    );
  }

  return (
    <div className={props.className}>
      {props.children}
    </div>
  );
};

export default withNamespaces()(TariffViz);
