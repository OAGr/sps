import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table, FormControl } from "react-bootstrap";

const QUESTION_QUERY = gql`
query {
  metrics {
   id 
   name
   measurements {
     mean
   }
   aggregatedMeasurements {
     mean
   }
  }
}
`;

const CREATE_METRIC = gql`
mutation createMetric($name: String!) {
  createMetric(name: $name){
    id
    name
  }
}
`;

const CREATE_MEASUREMENT = gql`
mutation createMeasurement($metricId: String!, $mean: Float!) {
  createMeasurement(metricId: $metricId, mean: $mean){
    id
    metricId
    mean
  }
}
`;

class MetricForm extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
    this.state = {value: ""};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public handleChange(event: any) {
    this.setState({value: event.target.value});
  }

  public handleSubmit(event: any) {
    // alert("A name was submitted: " + this.state.value);
    this.props.onSubmit({
      variables: {name: this.state.value},
    });

    event.preventDefault();
  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class MeasurementForm extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
    this.state = {value: ""};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public handleChange(event: any) {
    this.setState({value: event.target.value});
  }

  public handleSubmit(event: any) {
    // alert("A name was submitted: " + this.state.value);
    console.log("Submitting", this.state.value, this.props.metricId);
    this.props.onSubmit({variables: {mean: this.state.value, metricId: this.props.metricId}}); 
    event.preventDefault();
  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

const QuestionPagePresentational = (props) => {
  console.log(props.metrics);
  return (
    <div>
       <Table striped={true} bordered={true} condensed={true} hover={true}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Measurements</th>
            <th>Estimate</th>
          </tr>
        </thead>
        <tbody>
          {(props.metrics.metrics && props.metrics.metrics.map((metric) => (
            <tr key={metric.id}>
              <td>{metric.name}</td>
              <td>{metric.measurements.map((m) => (`${m.mean},`))}</td>
              <td>{metric.aggregatedMeasurements.map((m) => (`${m.mean},`))}</td>
              <td><MeasurementForm onSubmit={props.createMeasurement} metricId={metric.id}/></td>
            </tr>
          )))}
        </tbody>
      </Table>
      <MetricForm onSubmit={props.createMetric}/>
    </div>
  );
};

const createMetricOptions: any = {
  update: (proxy, {data: {createMetric}}) => {
    const data = proxy.readQuery({query: QUESTION_QUERY});
    data.metrics.push({...createMetric, measurements: []});
    proxy.writeQuery({query: QUESTION_QUERY, data});
  },
};

const createMeasurementOptions: any = {
  update: (proxy, {data: {createMeasurement}}) => {
    const data = proxy.readQuery({query: QUESTION_QUERY});
    const metric: any = data.metrics.find((e) => e.id === createMeasurement.metricId);
    metric.measurements.push(createMeasurement);
    proxy.writeQuery({query: QUESTION_QUERY, data});
  },
};

export const QuestionPage = compose(
  withRouter,
  graphql(QUESTION_QUERY, {name: "metrics"}),
  graphql(CREATE_METRIC, {
    name: "createMetric",
    options: createMetricOptions,
  }),
  graphql(CREATE_MEASUREMENT, {name: "createMeasurement", options: createMeasurementOptions}),
  )(QuestionPagePresentational);