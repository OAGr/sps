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
import { Button, Table, FormControl, FormGroup, ControlLabel, Nav, NavItem } from "react-bootstrap";
import { ExistingAbstractPropertyEditor } from "../components/ExistingAbstractPropertyEditor";
import { NewAbstractPropertyEditor } from "../components/NewAbstractPropertyEditor";
import { ExistingEntityEditor } from "../components/ExistingEntityEditor";
import { NewEntityEditor } from "../components/NewEntityEditor";
import * as Dimensions from "react-dimensions";

const CATEGORIES_QUERY = gql`
query{
categories{
  id
  name
  entities {
      id
      image
      name
      createdAt
    }
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
    this.state = {
      selectedCategoryId: null,
      chosenNavItem: "1",
    };
  }
  public componentWillUpdate(newProps: any) {
    if (!this.props.categories.categories && newProps.categories.categories) {
      this.setState({selectedCategoryId: newProps.categories.categories[0].id});
    }
  }
  public render() {
    const {containerWidth, categories} = this.props;
    const category = categories.categories && categories.categories.find((c) => c.id === this.state.selectedCategoryId);
    const properties = category && category.properties;
    const entities = category && category.entities;
    return (
      <div>
        {categories.categories &&
          <FormGroup controlId="formControlsSelect">
            <ControlLabel>Type</ControlLabel>
            <FormControl componentClass="select" placeholder="select" onChange={(e) => { this.setState({ selectedCategoryId: e.target.value }); }}>
              {categories.categories && categories.categories.map((c) => (
                <option value={c.id}>{c.name}</option>
              ))}
            </FormControl>
          </FormGroup>
        }
        <Nav bsStyle="tabs" activeKey={this.state.chosenNavItem} onSelect={(e) => {this.setState({chosenNavItem: e}); }}>
          <NavItem eventKey="1">Entities</NavItem>
          <NavItem eventKey="2">New Entities</NavItem>
          <NavItem eventKey="3">Properties</NavItem>
          <NavItem eventKey="4">New Properties</NavItem>
          <NavItem eventKey="5">Edit Category Details</NavItem>
        </Nav>

        {this.state.chosenNavItem === "1" && entities && !!entities.length &&
          <ExistingEntityEditor entities={entities} width={containerWidth}/>
        }
        {this.state.chosenNavItem === "2" &&
          <NewEntityEditor entities={entities} extraRows={20} width={containerWidth} categoryId={category.id}/>
        }
        {this.state.chosenNavItem === "3" && properties &&
          <ExistingAbstractPropertyEditor properties={properties} extraRows={0} extraColumns={5} width={containerWidth}/>
        }
        {this.state.chosenNavItem === "4" &&
          <NewAbstractPropertyEditor extraRows={10} extraColumns={20} width={containerWidth}/>
        }
      </div>
    );
  }
}

export const PropertyEdit = compose(
  graphql(CATEGORIES_QUERY, { name: "categories" }),
  withRouter,
  Dimensions(),
  )((EntityIndexPresentational));