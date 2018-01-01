import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table, FormControl } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { MeasurementForm } from "./MeasurementForm";
import * as moment from "moment";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import * as _ from "lodash";
import * as HotTable from "react-handsontable";
import { MetricsTable } from "./MetricsTable";
import { PropertiesTable } from "./PropertiesTable";
// import {MetricsTalbe} from "./"

const MetricIndexPresentational = (props) => {
  return (
    <div>
      <MetricsTable/>
    </div>
  );
};

export const MetricIndex = compose(
  withRouter,
  )(MetricIndexPresentational);