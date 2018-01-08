import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Button, Table, FormControl, FormGroup, ControlLabel } from "react-bootstrap";
import DatePicker from "react-datepicker";
import * as moment from "moment";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import * as _ from "lodash";
import * as HotTable from "react-handsontable";

const DATE_FORMAT = "YYYY";

const UPSERT_PROPERTIES = gql`
mutation upsertProperties($properties: [propertyInput]) {
  upsertProperties(properties: $properties){
    id
  }
}
`;
export class EntityEditorPresentational extends React.Component<any, any> {
  public hotTable;

  public constructor(props: any) {
    super(props);
    this.hotTable = null;
    this.prepareData = this.prepareData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public prepareData() {
    const properties = this.props.properties;
    let fData: any = properties && properties.map((e) => {
      let row: any = {};
      row.id = e.id;
      row.name = e.name;
      e.resolvesAt.map((time, index) => {
        row[`t${index}`] = moment(time).format("MM/YYYY");
      });
      return row;
    }) || [];
    fData = [...fData, ..._.times(this.props.extraRows, _.constant(null)).map((e) => ({}))];
    return fData;
  }

  public handleChange(changeData: any, type: any) {
    if (type === "edit" || type === "CopyPaste.paste") {
      let tableData;
      if (this.hotTable && this.hotTable.hotInstance) {
        tableData = this.hotTable.hotInstance.getData();
      }
      const rows = changeData.map((e) => {
        const row = tableData[e[0]];
        return ({
          id: row[0],
          [e[1]]: e[3],
        });
      });
      this.props.upsertProperties({variables: {properties: rows}});
    }
  }

  public prepareColumns() {
    return [
      {
        data: "id",
        readOnly: true,
      },
      {
        data: "name",
      },
      ..._.times(this.props.extraColumns, _.constant(null)).map((e, i) => ({
        data: `t${i}`,
        type: "date",
        dateFormat: "MM/YYYY",
        readOnly: true,
      })),
    ];
  }

  public prepareColumnHeaders() {
    return [
      "id",
      "name",
      ..._.times(this.props.extraColumns, _.constant(null)).map((e, i) => `t${i + 1}`),
    ];
  }

  public render() {
    return (
      <div>
        {this.props.properties &&
          <HotTable
            root={"existing-table"}
            ref={(node) => {
              this.hotTable = node;
              console.log("DECLARITNG", node, this.hotTable);
            }}

            data={this.prepareData()}
            colHeaders={this.prepareColumnHeaders()}
            rowHeaders={true}
            width={this.props.width}
            height={this.prepareData().length * 24 + 24}
            stretchH="all"
            columns={this.prepareColumns()}
            columnSorting={true}
            sortIndicator={true}
            manualRowMove={true}
            onAfterChange={this.handleChange}
          />
        }
      </div>
    );
  }
}

export const ExistingAbstractPropertyEditor: any = compose(
  graphql(UPSERT_PROPERTIES, {
    name:  "upsertProperties",
  }),
  )(EntityEditorPresentational);