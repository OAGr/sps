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
query GetMetricQuery($id: String!){
   metric(id: $id){
   id 
   name
   description
   createdAt
   resolvesAt
   property {
     id
     name
   }
   entity {
     id
     name
   }
   user {
     id
     name
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
const DATE_FORMAT = "MMM Do YYYY";

const MetricShowPresentational = (props) => {
  const metric = props.metric.metric;
  let lastMeasurement;
  if (metric) {
    lastMeasurement = metric.measurements[metric.measurements.length - 1];
  }
  return (
      <Table striped={true} bordered={true} condensed={true} hover={true}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Resolves At</th>
            <th>Group Prediction</th>
            <th>Your Estimate</th>
          </tr>
        </thead>
        <tbody>
            {metric &&
            <tr>
              <td>{metric.name ? metric.name : "foobar"}</td>
              <td>{`${moment(metric.resolvesAt).format(DATE_FORMAT)}`}</td>
              <td>
                {lastMeasurement && lastMeasurement.aggregatedMeasurement &&
                    <div>{lastMeasurement.aggregatedMeasurement.mean}</div>
                }
              </td>
              <td><MeasurementForm metricId={metric.id} /></td>
            </tr>
            }
        </tbody>
      </Table>
  );
};

const options: any = ({match}) => {
    return {variables: { id: match.params.metricId }};
 };

export const MetricShow = compose(
  withRouter,
  graphql(QUESTION_QUERY, {name:  "metric" , options}),
  )(MetricShowPresentational);
