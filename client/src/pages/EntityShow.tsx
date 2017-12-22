import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table, FormControl, Row, Col, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import * as moment from "moment";
import "react-datepicker/dist/react-datepicker.css";

const ENTITY_QUERY = gql`
query GetEntityQuery($id: String!){
    entity(id: $id){
        id
        name
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

const Property = ({ property }: any) => {
    return (
        <div>
            <h3> {property.name}</h3>
            <h3> {property.metrics.map((m) => (<div>
                {`${moment(m.resolvesAt).format(DATE_FORMAT)}`}
            </div>))}</h3>
      <Table striped={true} bordered={true} condensed={true} hover={true}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Resolves At</th>
            <th>Group Prediction</th>
            <th>Your Estimate</th>
          </tr>
        </thead>
        <tbody>
          {(property.metrics && property.metrics.map((metric) => (
            <tr key={metric.id}>
              <td>{metric.name}</td>
              <td>{`${moment(metric.resolvesAt).format(DATE_FORMAT)}`}</td>
              <td>
                {metric.measurements[0] && metric.measurements[0].aggregatedMeasurement &&
                    <div>{metric.measurements[0].aggregatedMeasurement.mean}</div>
                }
              </td>
              {/* <td><MeasurementForm onSubmit={props.createMeasurement} metricId={metric.id} /></td> */}
            </tr>
          )))}
        </tbody>
      </Table>
        </div>
        );
};

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
                        <h2> {entity.name}</h2>
                        <Row>
                            <Col xs={3}>
                                <ToggleButtonGroup type="checkbox" vertical={true} value={[this.state.selectedPropertyIndex]} >
                                    {entity.properties.map((p) => (
                                        <ToggleButton value={p.id} onClick={() => this.onChange(p.id)}>
                                            {p.name}
                                        </ToggleButton>
                                    ))}
                                </ToggleButtonGroup>
                            </Col>
                            <Col sm={9}>
                                {selectedProperty &&
                                    <Property property={selectedProperty} />
                                }
                            </Col>
                        </Row>
                    </div>
                }
            </div>
        );
    }
}

const options: any = {
    name: "entities", variables: { id: "6765818d-905c-45ae-9ea2-5ccf161f11ef" },
};

export const EntityShow = compose(
    withRouter,
    graphql(ENTITY_QUERY, { name: "entity", options })
  )(EntityShowPresentational);