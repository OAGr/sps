import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import * as moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { EntityTable } from "../components/EntityTable";
import { EntityEditor } from "../components/EntityEditor";
import { AbstractPropertyEditor } from "../components/AbstractPropertyEditor";
import { Button, Table, FormControl, FormGroup, ControlLabel } from "react-bootstrap";

const CATEGORIES_QUERY = gql`
query{
categories{
  id
  name
  properties{
    id
    name
    resolvesAt
  }
}
}
`;

export class EntityIndexPresentational extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
    this.state = { selectedCategoryId: null };
  }
  public componentWillUpdate(newProps: any) {
    if (!this.props.categories.categories && newProps.categories.categories) {
      this.setState({selectedCategoryId: newProps.categories.categories[0].id});
    }
  }
  public render() {
    const category = this.props.categories.categories && this.props.categories.categories.find((c) => c.id === this.state.selectedCategoryId);
    const properties = category && category.properties;
    return (
      <div>
        {this.props.categories.categories &&
          <FormGroup controlId="formControlsSelect">
            <ControlLabel>Type</ControlLabel>
            <FormControl componentClass="select" placeholder="select" onChange={(e) => { this.setState({ selectedCategoryId: e.target.value }); }}>
              {this.props.categories.categories && this.props.categories.categories.map((c) => (
                <option value={c.id}>{c.name}</option>
              ))}
            </FormControl>
          </FormGroup>
        }
        {properties &&
          <AbstractPropertyEditor properties={properties} />
        }
      </div>
    );
  }
}

export const PropertyEdit = compose(
  graphql(CATEGORIES_QUERY, { name: "categories" }),
  withRouter,
  )(EntityIndexPresentational);