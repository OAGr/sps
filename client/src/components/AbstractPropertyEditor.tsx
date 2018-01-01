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

const CATEGORIES_QUERY = gql`
query{
categories{
  id
  name
  properties{
    id
    name
    resolvesAt
  }
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
    this.state = { selectedCategoryId: null };
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
    const data = _.filter(this.props.properties.properties, (p) => !!p.category);
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

  public componentWillUpdate(newProps: any) {
    if (!this.props.categories.categories && newProps.categories.categories) {
      this.setState({selectedCategoryId: newProps.categories.categories[0].id});

    }
  }

  // --->
  public prepareDataa() {
    if (!this.props.categories.categories || !this.state.selectedCategoryId) { return []; }
    const category = this.props.categories.categories.find((c) => c.id === this.state.selectedCategoryId);
    console.log(this.props.categories.categories, this.state.selectedCategoryId);
    const properties = category.properties;
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
    console.log(fData);
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
        {this.props.categories.categories &&
          <FormGroup controlId="formControlsSelect">
            <ControlLabel>Type</ControlLabel>
            <FormControl componentClass="select" placeholder="select" onChange={(e) => { this.setState({ selectedCategoryId: e.target.value }); }}>
              {this.props.categories.categories && this.props.categories.categories.map((c) => (
                <option value={c.id}>{c.name}</option>
              ))}
            </FormControl>
          </FormGroup>
        }
        {this.props.categories.categories &&
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
        {/* {this.props.categories.categories && this.props.categories.categories.map((c) => (
          <div>
            {c.id === this.state.selectedCategoryId &&
              <div>
                <h2>{c.name}</h2>
                <hr/>
                {c.properties.map((p) => {
                  const dates = p.resolvesAt.map((time) => moment(time).format("MM/YYYY")).map((e) => ({ time: e }));
                  return (
                    <div key={p.id}>
                      <strong>{p.name}</strong>
                      <HotTable
                        root={p.id}
                        ref={(node) => this.hotTable = node}
                        data={dates}
                        colHeaders={ccolumnHeaders}
                        rowHeaders={true}
                        width="200"
                        height="200"
                        stretchH="all"
                        columns={[{
                          type: "date",
                          data: "time",
                          dateFormat: "MM/YYYY",
                        }]}
                        columnSorting={true}
                        sortIndicator={true}
                        manualRowMove={true}
                        onAfterChange={(changes, source) => {
                          // console.log(changes, source);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            }
          </div>
        ))} */}
      </div>
    );
  }
}

export const AbstractPropertyEditor = compose(
  graphql(CATEGORIES_QUERY, { name: "categories" }),
  )(EntityEditorPresentational);