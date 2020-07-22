import React, { Component, lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import MyTaskListItem from './MyTaskListItem';
import { Prompt } from 'react-router'
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Alert,
} from 'reactstrap';

import { removeRunningTask, updateTaskTime, updateTaskTimerStatus,  putTaskSequence,  updateTaskSuccess, getTaskDetailById, fetchAllTasks,  makeTaskComplete } from '../../actions';
import Button from 'reactstrap/lib/Button';


class MyTaskList extends Component {
    constructor(props) {
        super(props);
        this.state = {
          edit: false,
          edit_record_id : 0,
          record_data: [],
          active_task: false,
        }
        this.stopAllTasks = this.stopAllTasks.bind(this);
        this.completeAllTasks = this.completeAllTasks.bind(this);
        this.task_item = [];
        this.task_data = [];
        this.completep = 1;
        this.current_task_status = '1';
        this.action_complete = 1; 
        this.current_task = [];
    }

    /**
     * Function to stop and complete the task by single button.
     */
    completeAllTasks(){
      this.action_complete = 2;
      this.current_task = this.props.keeper;
      this.current_task._id = this.current_task.task_id;
      let complete = true;
      this.props.onAllCompleteAction(this.current_task, complete );

    }
    /**
     * Function to stop the task by signle button.
     */
    stopAllTasks(){
      this.action_complete = 1;
      this.current_task = this.props.keeper;
      
      this.current_task._id = this.current_task.task_id;
      let complete = false;
      this.props.onAllCompleteAction(this.current_task, complete);
    }

    /**
     * Calling stop action to update and dispatch task on Stop.
     */
    onStop = (task, data) => {
      this.props.onStopAction(task, data, this.action_complete ,  this.current_task);
    }
    /**
     * To be triggered on Start new task.
     */
    onStart = (item) => {
      let $this = this;
      getTaskDetailById(item._id).then(function(result){
        if('3' === result.data.task_status){
          $this.current_task_status ='3';
        }else{
          $this.current_task_status= '2';
          $this.props.onStartAction(item);
        }
      });

    }
    /**
     * Stop Disapatcher to update DB and status.
     */
    onStopDispatch = (task, time, task_status) => {
      this.props.onStopDispatchAction(task, time, task_status, this.action_complete,  this.current_task);
    } 

    /**
     * Set temperory task on new start task.
     */
    onNewStart = (task_item, task_data) => {
        this.task_item = task_item;
        this.task_data = task_data;
    }

    componentWillReceiveProps(nextProps) {
      if(nextProps.keeper.task_id){
        this.setState({active_task: true});
      }else{
        this.setState({active_task: false});
      }
    }
    render(){
        return(
          <Row>
            {this.state.active_task && <Prompt
             
              message="Are you sure you wish to leave ? Reminder: All timer will be stopped upon leaving."
            />}
         
          <Col xs="12" lg="12">
          
          
          {'3' === this.current_task_status && <Alert color="danger">
                 This task has already been completed, please refresh the page.
            </Alert>}

            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> List of my tasks
                <div className="card-header-actions">
                {/* {this.current_task_status} */}
        {this.state.active_task && <Button className="btn btn-primary" onClick={this.stopAllTasks} color="danger">Stop</Button> }
        {this.state.active_task && <Button className="btn btn-primary" onClick={this.completeAllTasks} color="success">Complete</Button> }
                </div>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Task Name</th>
                    <th>Status</th>
                    <th>Comment</th>
                    <th>Total Cost</th>
                    <th>Time</th>
                    <th>Action</th>
                    <th> </th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.props.tasks && this.props.tasks.map((task)=>(
                      <MyTaskListItem item={task} onStart={ this.onStart } onStop={this.onStop}  onNewStart={this.onNewStart} onStopDispatch={this.onStopDispatch}  key={task._id}  />
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
const mapDispatchToProps = dispatch => {
  return {
    /**
     * Dispatch the task status and update in DB Dispatchers in prop.
     */
    onAllCompleteAction: (data, complete) =>{
      if(complete){
        dispatch(makeTaskComplete(data));
      }
      dispatch(fetchAllTasks());
    },
    /**
     * Dispatcher to start new task and update previous.
     */
    onStartAction: task =>{
      dispatch(updateTaskTimerStatus(task._id));
    },
    /**
     * To be triggered on Stop Action to update in state and DB.
     */
    onStopAction: (task, task_data, complete_flag, current_task) =>{
      task.total_time = task_data.total_time;
      task.time_start = 0;
     
        if( current_task._id && task._id === current_task._id && 2 === complete_flag ){
          task_data.task_status ='3';
        }
        dispatch(putTaskSequence(task_data));
        dispatch(updateTaskTime(task._id, task_data.total_time, task_data.task_status)).then(function(){
         if(current_task._id && task._id === current_task._id && 2 === complete_flag){
           task.task_status ='3';
            dispatch(updateTaskSuccess({data: task}));
          }
          dispatch(removeRunningTask());
        })
    },
    /**
     * Update state and DB in different scenario.
     */
  onStopDispatchAction: (task, total_time, task_status, complete_flag, current_task) => {
    task.total_time = total_time;
    task.time_start = 0;
    if(total_time > 0){
      task.task_status = task_status;
    }
    if(current_task._id && task._id === current_task._id && 2 === complete_flag ){
      task.task_status ='3';
    }
    dispatch(updateTaskSuccess({data: task}));
    dispatch(removeRunningTask());
  }
    
  };
};
const mapStateToProps = state => {
    return {
      tasks: state.tasks,
      keeper: state.keeper
    };
  };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyTaskList);