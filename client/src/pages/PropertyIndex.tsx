import * as React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from "react-router";
import { compose } from "recompose";
import { Table, FormControl } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { MeasurementForm } from "./MeasurementForm";
import * as moment from "moment";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import * as _ from "lodash";

const PROPERTY_QUERY = gql`
query {
    properties{
        id
        name
        abstractId
    entity{
      id
      name
      image
    }
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
}
`;
const DATE_FORMAT = "YYYY";

function standardSort(a: any, b: any) {
    if (!a.props) { return 1; }
    if (!b.props) { return -1; }
    return (a.props.children > b.props.children) ? 1 : -1;
}

const metricColumns = [
    {
        Header: "Name",
        id: "name",
        accessor: (m) => <Link to={`/metrics/${m.id}`}>{m.name ? m.name : `${_.get(m, "entity.name")}-${_.get(m, "property.name")}-${moment(m.resolvesAt).format(DATE_FORMAT)}`}</Link>,
        sortMethod: standardSort,
    },
    {
        Header: "Resolves At",
        id: "metric.resolvesAa", // String-based value accessors!
        accessor: (m) => `${moment(m.resolvesAt).format(DATE_FORMAT)}`,
    },
    {
        Header: "Measurements",
        id: "metric.measurements", // String-based value accessors!
        accessor: (m) => m.measurements.length,
    },
    {
        Header: "Group Prediction",
        id: "group-prediction", // String-based value accessors!
        accessor: (m) => {
            const lastMeasurement = m.measurements[m.measurements.length - 1];
            if (lastMeasurement && lastMeasurement.aggregatedMeasurement) {
                return lastMeasurement.aggregatedMeasurement.mean;
            } else {
                return "";
            }
        },
    },
    {
        Header: "Your prediction",
        id: "your-prediction", // String-based value accessors!
        accessor: (m) => (<MeasurementForm metricId={m.id} />),
    },
];
const PropertyIndexPresentational = (props) => {
    const data = _.filter(props.properties.properties, (p) => !!p.abstractId);
    const columns = [
        {
            Header: "Entity Picture",
            id: "entity.picture", // String-based value accessors!
            accessor: (m) => (m.entity.image ? <img src={m.entity.image} style={{height: "30px"}}/> : ""),
            sortMethod: standardSort,
        },
        {
            Header: "Entity",
            id: "entity.name", // String-based value accessors!
            accessor: (m) => (m.entity ? <Link to={`/entities/${m.entity.id}`}>{m.entity.name}</Link> : ""),
            sortMethod: standardSort,
        },
        {
            Header: "Attribute",
            id: "attribute",
            accessor: (m) => <Link to={`/metrics/${m.id}`}>{m.name ? m.name : `${_.get(m, "entity.name")}-${_.get(m, "property.name")}-${moment(m.resolvesAt).format(DATE_FORMAT)}`}</Link>,
            sortMethod: standardSort,
        },
    ];
    return (
        <div>
            <ReactTable
                data={data}
                columns={columns}
                SubComponent={(row) => {
                    const metrics = row.original.metrics;
                    return (
                        <ReactTable
                            data={metrics}
                            defaultPageSize={4}
                            columns={metricColumns}
                            showPagination={false}
                        />
                    );
                }}
            />
        </div>
    );
};

export const PropertyIndex = compose(
    withRouter,
    graphql(PROPERTY_QUERY, { name: "properties" }),
  )(PropertyIndexPresentational);