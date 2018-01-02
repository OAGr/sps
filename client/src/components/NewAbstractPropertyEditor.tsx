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

let hotTable;
export class EntityEditorPresentational extends React.Component<any, any> {
  public hotTable;

  public constructor(props: any) {
    super(props);
    this.hotTable = null;
    this.save = this.save.bind(this);
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
      category: d[4],
    }));
    const newData = tableData.filter((d) => !d.id);
    const variables = { entities: newData.map((d) => _.pick(d, ["image", "name"])) };
    // this.props.createEntities({variables});
  }

  public prepareData() {
    console.log(_.times(this.props.extraRows, _.constant(null)).map((e) => ({})));
    return _.times(this.props.extraRows, _.constant(null)).map((e) => ({}));
  }

  public prepareColumns() {
    return [
      {
        data: "name",
      },
      ..._.times(this.props.extraColumns, _.constant(null)).map((e, i) => ({
        data: `t${i}`,
        type: "date",
        dateFormat: "MM/YYYY",
      })),
    ];
  }

  public prepareColumnHeaders() {
    return [
      "name",
      ..._.times(this.props.extraColumns, _.constant(null)).map((e, i) => `t${i + 1}`),
    ];
  }

  public render() {
    return (
      <HotTable
        root={"new-properties"}
        ref={(node) => this.hotTable = node}
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
        onAfterChange={(changes, source) => {
          // console.log(changes, source);
        }}
      />
    );
  }
}

export const NewAbstractPropertyEditor: any = compose(
  )(EntityEditorPresentational);