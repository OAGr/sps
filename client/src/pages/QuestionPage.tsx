import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table } from "react-bootstrap";

const QUESTION_QUERY = gql`
query {
  metrics {
   id 
   name
  }
}
`;

const QuestionPagePresentational = (props) => {
    console.log(props.metrics);
    return (
    <div>
       yo 
       <Table striped={true} bordered={true} condensed={true} hover={true}>
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
       {(props.metrics.metrics && props.metrics.metrics.map((metric) => (
      <tr>
        <td>{metric.id}</td>
        <td>{metric.name}</td>
      </tr>
       )))}
    </tbody>
  </Table>
    </div>
    );
};

export const QuestionPage = compose(
    withRouter,
    graphql(QUESTION_QUERY, { name: "metrics" }),
  )(QuestionPagePresentational);