
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

const METRICS_QUERY = gql`
query {
  metrics {
   id 
   name
   description
   createdAt
   resolvesAt
   user {
     name
   }
   entity {
     id
     name
     categories {
         name
     }
   }
   property {
     name
     abstractProperty{
       id
       name
     }
   }
   measurements {
    id
    mean
    createdAt
    user {
      name
    }
    aggregatedMeasurement {
      mean
    }
   }
  }
}
`;

const DATE_FORMAT = "YYYY";

const ccolumns = [
  {
    data: "metricName",
    readOnly: true,
  },
  {
    data: "entity",
    readOnly: true,
  },
  {
    data: "categories",
    readOnly: true,
  },
  {
    data: "property",
    readOnly: true,
  },
  {
    data: "resolvesAt",
    readOnly: true,
  },
  {
    data: "measurements",
    readOnly: true,
  },
  {
    data: "mean",
    readOnly: true,
  },
  {
    data: "",
    readOnly: false,
  },
  {
    data: "starred",
    type: "checkbox",
    readOnly: false,
  },
];

const ccolumnHeaders = ["MetricName", "Entity", "Categories", "Property", "Resolves At", "Measurements", "Mean", "Your Estimate", "Saved"];

const MetricTablePresentational = (props) => {
  const data = props.metrics.metrics;
  const fData = data && data.map((m) => {
    let mean;
    const lastMeasurement = m.measurements[m.measurements.length - 1];
    if (lastMeasurement && lastMeasurement.aggregatedMeasurement) {
      mean = lastMeasurement.aggregatedMeasurement.mean;
    } else {
      mean = "";
    }
    const categories = _.get(m, "entity.categories") || [];
    return ({
      entity: _.get(m, "entity.name"),
      property: _.get(m, "property.abstractProperty.name"),
      resolvesAt: `${moment(m.resolvesAt).format(DATE_FORMAT)}`,
      measurements: m.measurements.length,
      categories: categories.map((c) => c.name).join(","),
      metricName: `${_.get(m, "entity.name")}-${_.get(m, "property.abstractProperty.name")}-${moment(m.resolvesAt).format(DATE_FORMAT)}`,
      mean,
      yourAnswer: "",
      starred: false,
    });
  });

  return (
    <div>
      <HotTable
        root="hot"
        data={fData}
        colHeaders={ccolumnHeaders}
        rowHeaders={true}
        width="1400"
        height="1000"
        stretchH="all"
        columns={ccolumns}
        columnSorting={true}
        sortIndicator={true}
        manualRowMove={true}
      />
    </div>
  );
};

export const MetricsTable = compose(
  graphql(METRICS_QUERY, { name: "metrics" }),
  )(MetricTablePresentational);