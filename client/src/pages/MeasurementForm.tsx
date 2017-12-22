import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table, FormControl, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import * as moment from "moment";
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
   measurements {
    id
    mean
    metricId
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

const CREATE_MEASUREMENT = gql`
mutation createMeasurement($metricId: String!, $mean: Float!) {
  createMeasurement(metricId: $metricId, mean: $mean){
    id
    mean
    createdAt
    metricId
    user {
      name
    }
    aggregatedMeasurement {
      mean
    }
  }
}
`;

class MeasurementFormPresentational extends React.Component<any, any> {
  public constructor(props: any) {
      super(props); 
      this.state = { value: "" };

      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  public handleChange(event: any) {
    this.setState({ value: event.target.value });
  }

  public handleSubmit(event: any) {
    this.props.createMeasurement({variables: {mean: this.state.value, metricId: this.props.metricId } });
  }

  public render() {
    return (
      <div>
        <label>
          <input type="text" value={this.state.value} onChange={this.handleChange} style={{width: "70px"}}/>
        </label>
        <Button onClick={this.handleSubmit}> Submit</Button>
      </div>
    );
  }
}

const createMeasurementOptions: any = {
  update:  (proxy, {data:  {createMeasurement} }) => {
    const data = proxy.readQuery({query:  QUESTION_QUERY });
    const metric: any = data.metrics.find((e) => e.id === createMeasurement.metricId);
    metric.measurements.push(createMeasurement);
    proxy.writeQuery({query:  QUESTION_QUERY, data });
  },
};

export const MeasurementForm = compose<any, any>(
  withRouter,
  graphql(QUESTION_QUERY, {name:  "metrics" }),
  graphql(CREATE_MEASUREMENT, {name:   "createMeasurement", options: createMeasurementOptions }),
  )(MeasurementFormPresentational);