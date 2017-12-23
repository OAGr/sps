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

const QUESTION_QUERY = gql`
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

function standardSort(a: any, b: any) {
      if (!a.props) { return 1; }
      if (!b.props) { return -1; }
      return (a.props.children > b.props.children) ? 1 : -1;
}

const MetricIndexPresentational = (props) => {
  const data = props.metrics.metrics;
  const columns = [
    {
    Header: "Name",
    id: "name",
    accessor: (m) => <Link to={`/metrics/${m.id}`}>{m.name ? m.name : `${_.get(m, "entity.name")}-${_.get(m, "property.name")}-${moment(m.resolvesAt).format(DATE_FORMAT)}`}</Link>,
    sortMethod: standardSort,
  },
    {
    Header: "Entity",
    id: "entity.name", // String-based value accessors!
    accessor: (m) => (m.entity ? <Link to={`/entities/${m.entity.id}`}>{m.entity.name}</Link> : ""),
    sortMethod: standardSort,
  },
    {
    Header: "Property",
    id: "propertyName",
    accessor:  (m) => (_.has(m, "property.abstractProperty.id") ? <Link to={`/properties/${m.property.abstractProperty.id}`}>{m.property.abstractProperty.name}</Link> : ""),
    sortMethod: standardSort,
  },
    {
    Header: "Resolves At",
    id: "metric.resolvesAa", // String-based value accessors!
    accessor: (m) => `${moment(m.resolvesAt).format(DATE_FORMAT)}`,
  },
    {
    Header: "Measurements",
    id: "metric.measurements", // String-based value accessors!
    accessor: (m) => m.measurements.length,
  },
    {
    Header: "Group Prediction",
    id: "group-prediction", // String-based value accessors!
    accessor: (m) => {
      const lastMeasurement = m.measurements[m.measurements.length - 1];
      if (lastMeasurement && lastMeasurement.aggregatedMeasurement) {
          return lastMeasurement.aggregatedMeasurement.mean;
      } else {
        return "";
      }
    },
  },
    {
    Header: "Your prediction",
    id: "your-prediction", // String-based value accessors!
    accessor: (m) => (<MeasurementForm metricId={m.id} />),
  },
  ];
  return (
    <div>
        <ReactTable
          data={data}
          columns={columns}
        />
    </div>
  );
};

export const MetricIndex = compose(
  withRouter,
  graphql(QUESTION_QUERY, {name:  "metrics" }),
  )(MetricIndexPresentational);