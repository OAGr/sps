
import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table, FormControl } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { MeasurementForm } from "./MeasurementForm";
import * as moment from "moment";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import * as _ from "lodash";
import * as HotTable from "react-handsontable";

const PROPERTY_QUERY = gql`
query {
    properties{
        id
        name
        abstractId
    entity{
      id
      name
      image
    }
    metrics{
   id 
   name
    }
  }
}
`;

const DATE_FORMAT = "YYYY";

const ccolumns = [
  {
    data: "entity",
    readOnly: true,
  },
  {
    data: "property",
    readOnly: true,
  },
  {
    data: "metrics",
    readOnly: true,
  },
  {
    data: "starred",
    type: "checkbox",
    readOnly: false,
  },
];

const ccolumnHeaders = ["EntityName", "PropertyName", "MetricCount", "Saved"];

const PropertiesTablePresentational = (props) => {
  const data = props.properties.properties;
  const fData = data && data.map((p) => {
      return ({
      entity: _.get(p, "entity.name"),
      property: _.get(p, "name"),
      metrics: p.metrics.length,
      yourAnswer: "",
      starred: false,
    });
  });

  return (
    <div>
      <HotTable
        root="properties"
        data={fData}
        colHeaders={ccolumnHeaders}
        rowHeaders={true}
        width="1300"
        height="400"
        stretchH="all"
        columns={ccolumns}
        columnSorting={true}
        sortIndicator={true}
        manualRowMove={true}
      />
    </div>
  );
};

export const PropertiesTable = compose(
  graphql(PROPERTY_QUERY, { name: "properties" }),
  )(PropertiesTablePresentational);