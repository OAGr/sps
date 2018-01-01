import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table, FormControl } from "react-bootstrap";
import DatePicker from "react-datepicker";
import * as moment from "moment";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import * as _ from "lodash";
import * as HotTable from "react-handsontable";

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

const DATE_FORMAT = "YYYY";

const ccolumns = [
  {
    data: "imageHtml",
    renderer: "html",
    readOnly: true,
  },
  {
    data: "name",
    renderer: "html",
    readOnly: true,
  },
  {
    data: "categories",
    readOnly: true,
  },
];

const ccolumnHeaders = ["MetricName", "Entity", "Categories"];

const EntityTablePresentational = (props) => {
  const data = props.entities.entities;
  let fData = data && data.map((e) => {
    return ({
      image: e.image,
      imageHtml: `<img src=${e.image} style="height: 30px">`,
      name: `<a href="/entities/${e.id}">${e.name}</a>`,
      categories: e.categories.map((c) => c.name).join(""),
    });
  }) || [];
  return (
    <div>
      <HotTable
        root="hot"
        data={fData}
        colHeaders={ccolumnHeaders}
        rowHeaders={true}
        width="1400"
        height="1000"
        stretchH="all"
        columns={ccolumns}
        columnSorting={true}
        sortIndicator={true}
        manualRowMove={true}
      />
    </div>
  );
};

export const EntityTable = compose(
  graphql(ENTITY_QUERY, { name: "entities" }),
  )(EntityTablePresentational);