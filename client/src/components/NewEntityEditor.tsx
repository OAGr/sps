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
mutation upsertEntities($entities: [entityInput]) {
  upsertEntities(entities: $entities){
    id
  }
}
`;

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
      image: d[0],
      name: d[1],
      categoryIds: [this.props.categoryId],
    }));
    const newData = tableData.filter( (d) => !!d.name);
    const variables = {entities: newData.map((d) => _.pick(d, ["image", "name", "categoryIds"]))};
    this.props.upsertEntities({variables});
  }

  public prepareData() {
    return _.times(this.props.extraRows, _.constant(null)).map((e) => ({}));
  }

  public prepareColumns() {
    return [
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
    console.log(data, columns);
    return (
      <div>
        <HotTable
          root="newEntityEditor"
          ref={(node) => this.hotTable = node}
          data={data}
          colHeaders={["image", "name"]}
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

export const NewEntityEditor: any = compose(
  graphql(CREATE_ENTITIES, { name: "upsertEntities" }),
  )(EntityEditorPresentational);