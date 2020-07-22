import React, {Component, lazy, Suspense} from 'react';
import {connect} from 'react-redux';
import MyTaskListItem from './MyTaskListItem';
import {Route, Redirect} from 'react-router'
// import { Bar, Line } from 'react-chartjs-2';
import {
    Badge,
    Card,
    CardBody,
    CardHeader,
    Col,
    Row,
    Pagination, PaginationItem, PaginationLink,
    Table,
    Button
} from 'reactstrap';

import {CSVLink, CSVDownload} from "react-csv";
import Moment from 'react-moment';
import {fetchAllSequences, updateTaskInprogress, updateTaskInprogressReport} from '../../actions';

class TaskListReport extends Component {
    constructor(props) {
        super(props);
        this.handleReopen = this.handleReopen.bind(this);
    }

    componentWillMount() {
        this.props.onNewStart();
    }

    handleReopen(task_id, seq_id) {
        let vote = window.confirm('Do you really want to open this task');

        if (vote) {
            this.props.onReopenProp(task_id, seq_id);
        }


    }

    render() {
        const prettyMilliseconds = require('pretty-ms');
        /**
         * Prepare the data headers for CSV export.
         */
        const headers = [
            {label: "Task Id", key: "taskid"},
            {label: "Sequence Id", key: "sequence_id"},
            {label: "Task", key: "task"},
            {label: "Hourly Rate", key: "hourly"},
            {label: "Total Time", key: "time"},
            {label: "Total Cost", key: "totalcost"},
            {label: "Currency", key: "currency"},
            {label: "Time Sequence", key: "seq"},
            {label: "Created Date", key: "created"},
            {label: "Completion Date", key: "completed"},
            {label: "Comment", key: "comment"},
            {label: "Status", key: "status"}
        ];
        var moment = require('moment');
        const task_data = [];
        const task_data_p = [];
        let seq_id = 0;
        if (this.props.report) {
            this.props.report.forEach(task => {
                if ('1' === task.task_status) {
                    seq_id = 0;
                }
                let data = {
                    taskid: task.task_id.id,
                    sequence_id: seq_id,
                    task: task.task_id.task,
                    currency: task.task_id.currency,
                    hourly: task.task_id.hourly_rate,
                    time: prettyMilliseconds(parseInt(task.task_id.total_time)),
                    totalcost: Number.parseFloat(((task.task_id.total_time / 1000) / 3600) * task.task_id.hourly_rate).toFixed(2),
                    seq: prettyMilliseconds(parseInt(task.seq_time)),
                    created: moment(task.task_id.created_date).format("YYYY-MM-DD"),
                    completed: ('1' == task.task_status) ? moment(task.task_id.updatedAt).format("YYYY-MM-DD") : moment(task.updatedAt).format("YYYY-MM-DD"),
                    comment: task.task_id.comment,
                    // status: (task.task_status == '3')? 'Completed': (task.task_status == '2') ? 'In progress': 'New',
                    status: ('1' !== task.task_status) ? "" : (task.task_id.task_status == '3') ? 'Completed' : (task.task_id.task_status == '2') ? 'In progress' : 'New',
                }
                let rdata = data;
                rdata._id = task._id;
                rdata._idtask = task.task_id._id;
                rdata.background_color = task.task_id.background_color;
                rdata.task_status = task.task_status;
                rdata.main_status = task.task_id.task_status;
                task_data_p.push(rdata);
                data.sequence_id = 0 === seq_id ? '' : seq_id;
                data.seq = 0 === seq_id ? '' : prettyMilliseconds(parseInt(task.seq_time));
                task_data.push(data);
                seq_id++;
            });
        }

        return (
            <Row>
                <Col xs="12" lg="12">
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i> Report
                            <div className="card-header-actions">
                                <CSVLink data={task_data} headers={headers}
                                         className="btn btn-primary"
                                         filename={"TaskListReport.csv"}
                                >
                                    Download
                                </CSVLink>
                            </div>

                        </CardHeader>
                        <CardBody>
                            <Table responsive>
                                <thead>
                                <tr>
                                    <th>Task ID</th>
                                    <th>Sequence ID</th>
                                    <th>Task</th>
                                    <th>Total Time</th>
                                    <th>Hourly Rate</th>
                                    <th>Total Cost</th>
                                    <th>Time Sequence</th>
                                    <th style={{minWidth: '100px'}}>Created Date</th>
                                    <th style={{minWidth: '100px'}}>Completion Date</th>
                                    <th>Comment</th>
                                    <th>Status</th>
                                    <th>Reopen</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.props.report && task_data_p.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.taskid}</td>
                                        <td>{'1' !== item.task_status && <span>{item.sequence_id}</span>}</td>
                                        <td>{item.task}</td>
                                        <td>
                                            <div className="time_slot">{'1' == item.task_status &&
                                            <span>{item.time}</span>}</div>
                                        </td>
                                        <td>{'1' == item.task_status && <span>{item.currency}{item.hourly}</span>}</td>
                                        <td>{'1' == item.task_status && <span>{item.totalcost}</span>}</td>
                                        <td>
                                            <div className="time_slot">{'1' !== item.task_status &&
                                            <span>{item.seq}</span>}</div>
                                        </td>
                                        <td>{item.created}</td>
                                        <td>{item.completed}</td>
                                        <td>
                                            <div className="comment_break">{item.comment}</div>
                                        </td>
                                        <td>
                                            {'1' == item.task_status &&
                                            <span className="custombadge">{item.main_status == '3' &&
                                            <Badge color="dark">Completed</Badge>}
                                                {item.main_status == '2' && <Badge color="success">In progress</Badge>}
                                                {item.main_status == '1' && <Badge color="info">New</Badge>}</span>}
                                            {/* {'1' !== item.task_status && <span className="custombadge"><Badge color="dark">Completed</Badge></span>} */}
                                        </td>
                                        <td>
                                            {'1' == item.task_status &&
                                            <span className="custombadge">{item.main_status == '3' &&
                                            <Button size="sm" className="btn-pill btn_action" color="danger"
                                                    onClick={() => this.handleReopen(item._idtask, item._id)}
                                                    type="button">Reopen</Button>}</span>}
                                        </td>
                                        <td>
                                            <div style={{
                                                background: item.background_color,
                                                padding: "10px",
                                                margin: "0 auto",
                                                width: "20px",
                                                height: "20px"
                                            }}></div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = state => {
    return {
        report: state.report
    };
};
const mapDispatchToProps = dispatch => {
    return {
        /**
         * Fetch all the report on new report render.
         */
        onNewStart: () => {
            dispatch(fetchAllSequences());
        },
        /**
         * Reopen the Task and update the Report, Tasks in state and in DB.
         */
        onReopenProp: (task_id, seq_id) => {
            dispatch(updateTaskInprogress(task_id));
            dispatch(updateTaskInprogressReport(seq_id));
        }
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(TaskListReport);
