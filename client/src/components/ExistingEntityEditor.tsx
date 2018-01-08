import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Button, Table, FormControl } from "react-bootstrap";
import DatePicker from "react-datepicker";
import * as moment from "moment";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import * as _ from "lodash";
import * as HotTable from "react-handsontable";

const UPSERT_ENTITIES = gql`
mutation upsertEntities($entities: [entityInput]) {
  upsertEntities(entities: $entities){
    id
  }
}
`;

const DATE_FORMAT = "YYYY";

const ccolumnHeaders = ["id", "createdAt", "image", "name"];
export class EntityEditorPresentational extends React.Component<any, any> {
  public hotTable;

  public constructor(props: any) {
    super(props);
    this.hotTable = null;
    this.prepareData = this.prepareData.bind(this);
    this.prepareData = this.prepareData.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public prepareData() {
      const data = this.props.entities;
      let fData = data && data.map((e) => {
      return ({
        id: e.id,
        image: e.image,
        name: e.name,
        createdAt: e.createdAt,
      });
    }) || [];
      return fData;
  }

  public prepareColumns() {
    return [
      {
        data: "id",
        readOnly: true,
      },
      {
        data: "createdAt",
        readOnly: true,
      },
      {
        data: "image",
      },
      {
        data: "name",
      },
    ];
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
      this.props.upsertEntities({variables: {entities: rows}});
    }
  }

  public render() {
    const data = this.prepareData();
    const columns = this.prepareColumns();
    return (
      <div>
        <HotTable
          root="existingEntityEditor"
          ref={(node) => this.hotTable = node}
          data={data}
          colHeaders={ccolumnHeaders}
          rowHeaders={true}
          width={this.props.width}
          height={data.length * 24 + 24}
          stretchH="all"
          columns={columns}
          columnSorting={true}
          sortIndicator={true}
          manualRowMove={true}
          onAfterChange={this.handleChange}
        />
      </div>
    );
  }
}

export const ExistingEntityEditor: any = compose(
  graphql(UPSERT_ENTITIES, { name: "upsertEntities" }),
  )(EntityEditorPresentational);