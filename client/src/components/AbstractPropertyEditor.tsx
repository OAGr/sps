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
    const data = this.props.properties;
    let fData: any = data && data.map((e) => {
      return ({
        id: e.id,
        name: e.name,
        category: e.category.name,
      });
    }) || [];
    fData = [...fData, ..._.times(50, _.constant(null)).map((e) => ({}))];
    return fData;
  }

  // --->
  public prepareDataa() {
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
    fData = [...fData, ..._.times(10, _.constant(null)).map((e) => ({}))];
    return fData;
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
      ..._.times(20, _.constant(null)).map((e, i) => ({
        data: `t${i}`,
        type: "date",
        dateFormat: "MM/YYYY",
      })),
    ];
  }

  public prepareColumnHeaders() {
    return [
      "id",
      "name",
      ..._.times(20, _.constant(null)).map((e, i) => `t${i}`),
    ];
  }

  public render() {
    return (
      <div>
        {this.props.properties &&
          <HotTable
            root={"foobar"}
            ref={(node) => this.hotTable = node}
            data={this.prepareDataa()}
            colHeaders={this.prepareColumnHeaders()}
            rowHeaders={true}
            width="1200"
            height="1200"
            stretchH="all"
            columns={this.prepareColumns()}
            columnSorting={true}
            sortIndicator={true}
            manualRowMove={true}
            onAfterChange={(changes, source) => {
              // console.log(changes, source);
            }}
          />
        }
      </div>
    );
  }
}

export const AbstractPropertyEditor: any = compose(
  )(EntityEditorPresentational);