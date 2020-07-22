import React, { Component, lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import TaskListItem from './TaskListItem';
import { Route, Redirect } from 'react-router'
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
} from 'reactstrap';

import { deleteTask } from '../../actions';


class TaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          edit: false,
          edit_record_id : 0,
          record_data: [],
        }
    }

    handleEditAction = (id, record) => {
      this.setState({
        edit: true,
        edit_record_id: id,
        record_data: record
      })
     // console.log('data with id to be edited',record);
      
    }
    render(){
        // console.log(this.props.tasks.data) 
        return(
          <Row>
          <Col xs="12" lg="12">
          {this.state.edit && 
          <Redirect to={{
              pathname: '/task/taskform',
              state: { 
                edit_id: this.state.edit_record_id,
                edit_data: this.state.record_data
              }
          }}/>}
          
          {this.state.edit}
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> List of tasks
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Task Name</th>
                    <th>Hourly Rate</th>
                    <th>Total Cost</th>
                    <th>Created Date</th>
                    <th>Target Date</th>
                    <th>Modified Date</th>
                    <th>Status</th>
                    <th>Comment</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.props.tasks && this.props.tasks.map((task)=>(
                          <TaskListItem item={task} onDelete={ this.props.onDelete } handleEditAction={this.handleEditAction} key={task._id}  />
                  ))}
                  </tbody>
                </Table>
                {/* <Pagination>
                  <PaginationItem>
                    <PaginationLink previous tag="button"></PaginationLink>
                  </PaginationItem>
                  <PaginationItem active>
                    <PaginationLink tag="button">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink tag="button">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink tag="button">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink tag="button">4</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink next tag="button"></PaginationLink>
                  </PaginationItem>
                </Pagination> */}
              </CardBody>
            </Card>
          </Col>
          </Row>
        );
    }

}
const mapDispatchToProps = dispatch => {
  return {
    onDelete: id => {
      console.log('Deleting the item with id ', id)
      dispatch(deleteTask(id));
    }
  };
};
const mapStateToProps = state => {
   console.log('all state TRIGGERED ', state); 
    return {
      tasks: state.tasks
    };
  };



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);