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

const ENTITY_QUERY = gql`
query {
    entities {
        id
        image
        name
        createdAt
        categories {
          name
        }
      }
}
`;

const CREATE_ENTITIES = gql`
mutation upsertEntities($entities: [entityInput]) {
  upsertEntities(entities: $entities){
    id
  }
}
`;

const CATEGORIES_QUERY = gql`
query {
    categories {
        name
    }
}
`;

const DATE_FORMAT = "YYYY";

let hotTable;
const ccolumnHeaders = ["MetricName", "Entity", "Categories"];
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
    const newData = tableData.filter( (d) => !d.id);
    const variables = {entities: newData.map((d) => _.pick(d, ["image", "name"]))};
    // this.props.upsertEntities({variables});
  }

  public prepareData() {
    const data = this.props.entities.entities;
    let fData = data && data.map((e) => {
      return ({
        id: e.id,
        image: e.image,
        name: e.name,
        createdAt: e.createdAt,
        category: e.categories && e.categories[0] && e.categories[0].name,
      });
    }) || [];
    fData = [...fData, ..._.times(50, _.constant(null)).map((e) => ({}))];
    return fData;
  }

  public prepareColumns() {
    const categories = this.props.categories.categories;
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
      {
        data: "category",
        type: "autocomplete",
        source: categories && categories.map((c) => c.name),
        strict: false,
        visibleRows: 4,
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
          root="hot"
          ref={(node) => this.hotTable = node}
          data={data}
          colHeaders={ccolumnHeaders}
          rowHeaders={true}
          width="1800"
          height="1000"
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

export const EntityEditor = compose(
  graphql(ENTITY_QUERY, { name: "entities" }),
  graphql(CATEGORIES_QUERY, { name: "categories" }),
  graphql(CREATE_ENTITIES, { name: "upsertEntities" }),
  )(EntityEditorPresentational);