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
import { EntityTable } from "../components/EntityTable";

const EntityIndexPresentational = (props) => {
  return (
    <EntityTable/>
  );
};

export const EntityIndex = compose(
    withRouter,
  )(EntityIndexPresentational);