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

const CREATE_CATEGORY = gql`
mutation upsertCategory($name: String!) {
    upsertCategory(name:$name){
        id
        name
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

class NewCategoryFormPresentational extends React.Component<any, any> {
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
    const variables = { name: this.state.name };
    this.props.createCategory({
      variables,
    })
    .then((e) => {
      this.props.history.push("/metrics");
    });
    event.preventDefault();
  }

  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <h3> Make a new category </h3>
        <FieldGroup type="text" label="Name" value={this.state.name} onChange={(e) => {this.handleChange(e, "name"); }} />
        <Button type="submit">Submit</Button>
      </form>
    );
  }
}

export const CategoryNew = compose(
  withRouter,
  graphql(CREATE_CATEGORY, {
    name:  "createCategory",
  }),
  )(NewCategoryFormPresentational);