import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table, FormControl } from "react-bootstrap";
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

const CREATE_METRIC = gql`
mutation createMetric($name: String!, $description: String!, $resolvesAt: String) {
  createMetric(name: $name, description: $description, resolvesAt: $resolvesAt){
    id
    name
    description
    createdAt
    resolvesAt
    user {
      name
    }
  }
}
`;

const CREATE_MEASUREMENT = gql`
mutation createMeasurement($metricId: String!, $mean: Float!) {
  createMeasurement(metricId: $metricId, mean: $mean){
    id
    metricId
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
`;

class MetricForm extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
    this.state = { name: "", description: "", resolvesAt: moment() };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
  }

  public handleChange(event: any, key: any) {
    let newValues = {};
    newValues[key] = event.target.value;
    this.setState(newValues);
  }

  public handleCalendarChange(resolvesAt: any) {
    this.setState({resolvesAt});
  }

  public handleSubmit(event: any) {
    // alert("A name was submitted: " + this.state.value);
    const variables = { name: this.state.name, description: this.state.description, resolvesAt: this.state.resolvesAt.toISOString() };
    this.props.onSubmit({
      variables,
    });
    event.preventDefault();
  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.name} onChange={(e) => {this.handleChange(e, "name"); }} />
          <input type="text" value={this.state.description} onChange={(e) => {this.handleChange(e, "description"); }} />
          <DatePicker selected={this.state.resolvesAt} onChange={this.handleCalendarChange}/>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class MeasurementForm extends React.Component<any, any> {
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
    this.props.onSubmit({variables: {mean: this.state.value, metricId: this.props.metricId } });
    event.preventDefault();
  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input type="text" value={this.state.value} onChange={this.handleChange} style={{width: "70px"}}/>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const DATE_FORMAT = "MMM Do YYYY";

const MetricIndexPresentational = (props) => {
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
          {(props.metrics.metrics && props.metrics.metrics.map((metric) => (
            <tr key={metric.id}>
              <td>{metric.name}</td>
              <td>{`${moment(metric.resolvesAt).format(DATE_FORMAT)}`}</td>
              <td>
                {metric.measurements[0] && metric.measurements[0].aggregatedMeasurement &&
                    <div>{metric.measurements[0].aggregatedMeasurement.mean}</div>
                }
              </td>
              <td><MeasurementForm onSubmit={props.createMeasurement} metricId={metric.id} /></td>
            </tr>
          )))}
        </tbody>
      </Table>
  );
};

const createMetricOptions: any = {
  update: (proxy, {data:  {createMetric} }) => {
    const data = proxy.readQuery({query:  QUESTION_QUERY });
    data.metrics.push({...createMetric,  measurements: [] });
    proxy.writeQuery({query:  QUESTION_QUERY, data });
  },
};

const createMeasurementOptions: any = {
  update:  (proxy, {data:  {createMeasurement} }) => {
    const data = proxy.readQuery({query:  QUESTION_QUERY });
    const metric: any = data.metrics.find((e) => e.id === createMeasurement.metricId);
    metric.measurements.push(createMeasurement);
    proxy.writeQuery({query:  QUESTION_QUERY, data });
  },
};

export const MetricIndex = compose(
  withRouter,
  graphql(QUESTION_QUERY, {name:  "metrics" }),
  graphql(CREATE_METRIC, {
    name:  "createMetric",
    options: createMetricOptions,
  }),
  graphql(CREATE_MEASUREMENT, {name:   "createMeasurement", options: createMeasurementOptions }),
  )(MetricIndexPresentational);