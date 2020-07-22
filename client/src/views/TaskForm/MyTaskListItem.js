import React, { Component} from 'react';
import { Badge, Button, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

import { keepRunningTask } from '../../actions';

class MyTaskListItem extends Component{
    
    constructor(props){
        super(props);
        let prev_total_time = parseInt(this.props.item.total_time);
        this.state = {
            time: prev_total_time,
            timeseq: 0,
            start: 0,
            startseq: 0,
            isOn: false,
            task_status: this.props.item.task_status
        }
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.completeTask = this.completeTask.bind(this);
    }
    /**
     * Function to Start the timer by triggering OnStart Procedure.
     */
    startTimer(){
        this.props.onStart(this.props.item);      
    }
    /**
     * Stop The Timer function to set the state to stop and clear Interval.
     */
    stopTimer(){
        this.setState({isOn: false})
        clearInterval(this.timer);
        this.setState({timeseq: 0});
       if( this.state.timeseq > 0 ){
            let data = {
                task_id: this.props.item._id,
                total_time: this.state.time,
                seq_time:  this.state.timeseq,
                task_status: this.state.task_status
            }
            this.props.onStop(this.props.item, data)
       }
       this.setState({timeseq: 0});
    }
    /**
     * Function to complete the task by setting status to 3 = Completed.
     */
    completeTask(){
        this.setState({task_status: '3'},()=>{
            this.stopTimer();
        }); 
    }
    /**
     * This function will trigger when it receives the next property.
     *
     * @param {*} nextProps Property receved after mounting.
     */
    componentWillReceiveProps(nextProps) { 
        const newValue =  !! nextProps.item.time_start;
        /**
         * Check if the received task is to start and current task is not Started.
         */
        if(newValue && !this.state.isOn){
            let _date = Date.now();
            this.setState({
                time: this.state.time,
                timeseq: this.state.timeseq,
                start: _date - this.state.time,
                startseq:  _date - this.state.timeseq,
                isOn: true,
                task_status: '2'
            })
            this.timer = setInterval(() => {
                let _date = Date.now();
                this.setState({
                    time: _date - this.state.start,
                    timeseq: _date - this.state.startseq,
                });
                let data = {
                    task_id: this.props.item._id,
                    total_time: this.state.time,
                    seq_time:  this.state.timeseq,
                    task_status: this.state.task_status
                }
                this.props.onStartTaskAction(data);
             }, 1);
            
        }else{
            this.stopTimer();
            if(nextProps.item.task_status !== this.props.item.task_status){
                this.setState({task_status: nextProps.item.task_status});    
            }
        }
   
      }

      /**
       * Function will be triggered after mount.
       * Stop the timer and dispatch it to state.
       */
      componentWillUnmount() {
        this.stopTimer(); 
        this.props.onStopDispatch(this.props.item, this.state.time, this.state.task_status);
      }
    render() {
        var colorStyle = {
            background: this.props.item.background_color,
            padding: "10px",
            margin: "0 auto",
            width: "20px",
            height: "20px"
          };

    const prettyMilliseconds = require('pretty-ms');  

    let start = (this.state.time == 0) ?
        <Button size="sm" className="btn-pill btn_action" color="danger"  type="button" onClick={this.startTimer}>Start</Button> :
        null
  
    let stop = (this.state.isOn) ?
        <Button size="sm" className="btn-pill btn_action" color="info"  type="button" onClick={this.stopTimer}>Stop</Button> :
        null
    let resume = (this.state.time != 0 && !this.state.isOn) ?
        <Button size="sm" className="btn-pill btn_action" color="danger"  type="button"  onClick={this.startTimer}>Resume</Button> :
        null
    let complete = (this.state.time != 0) && (this.state.isOn)?
        <Button size="sm" className="btn-pill btn_action" color="success"  type="button"  onClick={this.completeTask}>Complete</Button> :
        null
        return( 
            
            (this.state.task_status !== '3' && <tr>
                <td>{this.props.item.id}</td>
                <td>{this.props.item.task}</td>
                <td>{this.state.task_status == '3' && <span className="custombadge"><Badge color="dark">Completed</Badge></span>}
                        {this.state.task_status == '2' && <span className="custombadge"><Badge color="success">In progress</Badge></span>}
                        {this.state.task_status == '1' && <span className="custombadge"><Badge color="info">New</Badge></span>}</td>
                <td><div className="comment_break">{this.props.item.comment}</div></td>
                <td>{Number.parseFloat(((this.props.item.total_time / 1000) /3600) * this.props.item.hourly_rate).toFixed(2)}</td>
                <td><div className="time_slot">{prettyMilliseconds(this.state.time)}</div></td>
                <td>
                <Row className="align-items-center">
                <Col col="6" sm="6" md="6" xl className="mb-6 mb-xl-0">
                    <div className="action-box">
                        {this.state.task_status !== '3' && start}
                        {this.state.task_status !== '3' && resume}
                        {this.state.task_status !== '3' && stop}
                        {this.state.task_status !== '3' && complete}
                        {this.state.task_status === '3' && <span className="custombadge"><Badge color="dark">Completed</Badge></span>}
                    </div>
                </Col>
               
                </Row>
                </td>
                <td><div style={colorStyle}></div></td>
            </tr>)
        );
    }
}
/**
 * Adding function in Properties.
 */
const mapDispatchToProps = dispatch => {
    return {
      /**
       * Adding the running task in state.
       */
      onStartTaskAction: (data) =>{
        dispatch(keepRunningTask(data));
      },
    };
  };

export default connect(null, mapDispatchToProps)(MyTaskListItem);