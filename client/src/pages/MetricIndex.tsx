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

const MetricIndexPresentational = (props) => {
  return (
      <Table striped={true} bordered={true} condensed={true} hover={true}>
        <thead>
          <tr>
            <th>Metric Name</th>
            <th>Entity</th>
            <th>Property</th>
            <th>Resolves At</th>
            <th>Group Prediction</th>
            <th>Your Estimate</th>
          </tr>
        </thead>
        <tbody>
          {(props.metrics.metrics && props.metrics.metrics.map((metric) => {
            const lastMeasurement = metric.measurements[metric.measurements.length - 1];
            return (
            <tr key={metric.id}>
              <td><Link to={`/metrics/${metric.id}`}>{`${metric.entity.name}-${metric.property.name}-${moment(metric.resolvesAt).format(DATE_FORMAT)}`}</Link></td>
              <td><Link to={`/entities/${metric.entity.id}`}>{metric.entity.name}</Link></td>
              <td><Link to={`/properties/${metric.property.abstractProperty.id}`}>{metric.property.abstractProperty.name}</Link></td>
              <td>{`${moment(metric.resolvesAt).format(DATE_FORMAT)}`}</td>
              <td>
                {lastMeasurement && lastMeasurement.aggregatedMeasurement &&
                    <div>{lastMeasurement.aggregatedMeasurement.mean}</div>
                }
              </td>
              <td><MeasurementForm metricId={metric.id} /></td>
            </tr>
            );
          }
          ))}
        </tbody>
      </Table>
  );
};

export const MetricIndex = compose(
  withRouter,
  graphql(QUESTION_QUERY, {name:  "metrics" }),
  )(MetricIndexPresentational);