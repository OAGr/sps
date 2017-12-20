import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table, FormControl, FormGroup, ControlLabel, HelpBlock, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import * as moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { BrowserRouter as Router } from "react-router-dom";

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

function FieldGroup({ id, label, help, ...props }: any) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
  }

class NewMetricFormPresentational extends React.Component<any, any> {
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
    this.props.createMetric({
      variables,
    })
    .then((e) => {
      console.log("Created the item!", e);
      this.props.history.push("/metrics");
    });
    event.preventDefault();
  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <h3> Make a new metric </h3>
          <FieldGroup type="text" label="Name" value={this.state.name} onChange={(e) => {this.handleChange(e, "name"); }} />
            <FormGroup>
            <ControlLabel>Description</ControlLabel>
            <FormControl componentClass="textarea" placeholder="This will evaulate when..." value={this.state.description} onChange={(e) => {this.handleChange(e, "description"); }}/>
            </FormGroup>
            <FormGroup>
                <ControlLabel>Resolves At</ControlLabel>
                <DatePicker selected={this.state.resolvesAt} onChange={this.handleCalendarChange}/>
            </FormGroup>
        <Button type="submit">Submit</Button>
      </form>
    );
  }
}

const createMetricOptions: any = {
  update: (proxy, {data:  {createMetric} }) => {
    const data = proxy.readQuery({query:  QUESTION_QUERY });
    data.metrics.push({...createMetric,  measurements: [] });
    proxy.writeQuery({query:  QUESTION_QUERY, data });
  },
};

export const NewMetricForm = compose(
  withRouter,
  graphql(CREATE_METRIC, {
    name:  "createMetric",
    options: createMetricOptions,
  }),
  )(NewMetricFormPresentational);