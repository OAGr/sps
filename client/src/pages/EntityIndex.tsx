import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table, FormControl } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Link } from "react-router-dom";
import * as moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const ENTITY_QUERY = gql`
query {
    entities{
        id
        image
        name
        categories{
          name
        }
      }
}
`;

const DATE_FORMAT = "MMM Do YYYY";

const EntityIndexPresentational = (props) => {
  return (
      <Table striped={true} bordered={true} condensed={true} hover={true}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Categories</th>
          </tr>
        </thead>
        <tbody>
          {(props.entities.entities && props.entities.entities.map((ee) => (
            <tr key={ee.id}>
              <td><img src={ee.image} style={{height: "70px"}} / > </td>
              <td><Link to={`/entities/${ee.id}`}>{ee.name}</Link></td>
              <td>{ee.categories.map((p) => p.name)}</td>
            </tr>
          )))}
        </tbody>
      </Table>
  );
};

export const EntityIndex = compose(
    withRouter,
    graphql(ENTITY_QUERY, {name:    "entities" }),
  )(EntityIndexPresentational);