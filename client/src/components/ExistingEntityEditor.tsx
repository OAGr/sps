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

const CREATE_ENTITIES = gql`
mutation createEntities($entities: [entityInput]) {
  createEntities(entities: $entities){
    id
  }
}
`;

const DATE_FORMAT = "YYYY";

let hotTable;
const ccolumnHeaders = ["id", "createdAt", "image", "name"];
export class EntityEditorPresentational extends React.Component<any, any> {
  public hotTable;

  public constructor(props: any) {
    super(props);
    this.hotTable = null;
    this.save = this.save.bind(this);
    this.prepareData = this.prepareData.bind(this);
    this.prepareData = this.prepareData.bind(this);
  }

  public save() {
    let tableData;
    if (this.hotTable && this.hotTable.hotInstance) {
      tableData = this.hotTable.hotInstance.getData();
    }
    tableData = tableData.map((d) => ({
      id: d[0],
      image: d[2],
      name: d[3],
    }));
    const newData = tableData.filter( (d) => !d.id);
    const variables = {entities: newData.map((d) => _.pick(d, ["image", "name"]))};
    // this.props.createEntities({variables});
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
          onAfterChange={(changes, source) => {
            console.log(changes, source);
          }}
        />
        <Button onClick={this.save}>
          SAVE
            </Button>
      </div>
    );
  }
}

export const ExistingEntityEditor: any = compose(
  graphql(CREATE_ENTITIES, { name: "createEntities" }),
  )(EntityEditorPresentational);