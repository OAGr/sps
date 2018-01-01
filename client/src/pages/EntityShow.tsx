import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table, FormControl, Row, Col, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import * as moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { MeasurementForm } from "./MeasurementForm";
import * as ReactDataSheet from "react-datasheet";

import {
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import * as _ from "lodash";
import styled from "styled-components";

const ENTITY_QUERY = gql`
query GetEntityQuery($id: String!){
    entity(id: $id){
        id
        name
        image
        properties{
          id
          name
          type
          metrics{
            id 
            name
            description
            createdAt
            resolvesAt
            user {
                name
            }
            entity {
                id
                name
            }
            measurements {
                id
                mean
                createdAt
                user {
                    name
                }
                aggregatedMeasurement {
                    mean
                }
            }
          }
        }
        categories{
          name
        }
      }
}`;

const DATE_FORMAT = "YYYY";

// const data = [
//     { name: "Page A",  pv: 2400},
//     { name: "Page B", pv: 1398},
//     { name: "Page C", pv: 9800},
// ];

const PropertyBackground = styled.div`
  background-color: #f1f4f7;
  padding: 10px 16px 0;
  border-radius: 2px;
  margin-bottom: 7px;
  h3 {
    font-size: 1.2em;
    margin-top: .2em;
  }
`;

const Test = styled.div`
    display: block;
    padding: 5px;
    margin: auto;
    width: 500px;
    margin-top: 20px;
    background-color: white;
`;
class Property extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
    let metrics = _.orderBy(this.props.property.metrics, ((m) => moment(m.resolvesAt).unix()));
    let data = metrics.map((metric) => {
      const lastMeasurement = metric.measurements[metric.measurements.length - 1];
      return ([
        {value: `${moment(metric.resolvesAt).format(DATE_FORMAT)}`, readOnly: true},
        {value: lastMeasurement && lastMeasurement.aggregatedMeasurement.mean, readOnly: true},
        {value: 0, readOnly: false},
      ]);
    });

    this.state = {
      isOpen: true,
      grid: [
        [
          {value: "Year", readOnly: true},
          {value: "Group Prediction", readOnly: true},
          {value: "Your Estimate", readOnly: true},
        ],
        ...data,
      ],
    };
  }

  public render() {
    const { property } = this.props;
    let metrics = _.orderBy(property.metrics, ((m) => moment(m.resolvesAt).unix()));
    let data = metrics.map((metric) => {
      const lastMeasurement = metric.measurements[metric.measurements.length - 1];
      let value;
      value = lastMeasurement && lastMeasurement.aggregatedMeasurement && lastMeasurement.aggregatedMeasurement.mean || 0;
      const name = `${moment(metric.resolvesAt).format(DATE_FORMAT)}`;
      console.log(moment(metric.resolvesAt).unix(), moment(moment(metric.resolvesAt).unix()));
      return { value, time: moment(metric.resolvesAt).unix() };
    });
    // data = _.orderBy(data, (e) => (e.time));

    return (
      <PropertyBackground>
        <Row>
          <Col xs={3}>
            <h3> {property.name}</h3>
            <div onClick={() => { this.setState({ isOpen: !this.state.isOpen }); }}>o</div>
          </Col>
          <Col xs={9}>
            <Test>
            <ReactDataSheet
              data={this.state.grid}
              valueRenderer={(cell) => cell.value}
              onChange={(cell, rowI, colJ, value) =>
                this.setState({
                  grid: this.state.grid.map((col) =>
                    col.map((rowCell) =>
                      (rowCell === cell) ? ({ value: value }) : rowCell
                    )
                  ),
                })
              }
            />
            </Test>
          </Col>
          <Col xs={9}>
            <ResponsiveContainer width="100%" height={80} >
              <ScatterChart>
                <XAxis
                  dataKey="time"
                  domain={["auto", "auto"]}
                  name="Time"
                  tickFormatter={(unixTime) => {
                    return moment(unixTime * 1000).format("YYYY");
                  }}
                  type="number"
                />
                <YAxis dataKey="value" name="Value" />

                <Scatter
                  data={data}
                  line={{ stroke: "#777" }}
                  lineJointType="monotoneX"
                  lineType="joint"
                  name="Values"
                  isAnimationActive={false}
                />
                <Tooltip cursor={{ strokeDasharray: "50 50" }} />

              </ScatterChart>
            </ResponsiveContainer>
            {this.state.isOpen &&
              <Table striped={false} bordered={true} condensed={true} hover={true}>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Group Prediction</th>
                    <th>Your Estimate</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics && metrics.map((metric) => {
                    const lastMeasurement = metric.measurements[metric.measurements.length - 1];
                    return (
                      <tr key={metric.id}>
                        <td>{`${moment(metric.resolvesAt).format(DATE_FORMAT)}`}</td>
                        <td>
                          {lastMeasurement && lastMeasurement.aggregatedMeasurement &&
                            <div>{lastMeasurement.aggregatedMeasurement.mean}</div>
                          }
                        </td>
                        <td><MeasurementForm metricId={metric.id} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            }
          </Col>
        </Row>
      </PropertyBackground>
    );
  }
}

class EntityShowPresentational extends React.Component<any, any> {
  public constructor(props: any) {
    super(props);
    this.state = { selectedPropertyIndex: null };
    this.onChange = this.onChange.bind(this);
  }

  public componentWillReceiveProps(nextProps: any) {
    if (!this.props.entity.entity && !!nextProps.entity.entity && nextProps.entity.entity.properties[0]) {
      this.setState({ selectedPropertyIndex: nextProps.entity.entity.properties[0].id });
    }
  }

  public onChange = (value) => {
    this.setState({ selectedPropertyIndex: value });
  }

  public render() {
    const { entity } = this.props.entity;
    let selectedProperty;
    if (entity) {
      selectedProperty = entity.properties.find((p) => p.id === this.state.selectedPropertyIndex);
    }
    return (
      <div>
        {entity &&
          <div>
            <Row>
              <Col xs={2}>
                <img src={entity.image} style={{ height: "100px" }} />
                <h2> {entity.name}</h2>
              </Col>
              <Col sm={10}>
                {entity.properties.map((p) => (
                  <Property property={p} />
                ))
                }
              </Col>
            </Row>
          </div>
        }
      </div>
    );
  }
}

const options: any = ({ match }) => ({
  variables: { id: match.params.entityId },
});

export const EntityShow = compose(
  withRouter,
  graphql(ENTITY_QUERY, { name: "entity", options })
  )(EntityShowPresentational);