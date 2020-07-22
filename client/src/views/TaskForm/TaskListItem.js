import React, { Component} from 'react';
import { Badge, Button, Row, Col } from 'reactstrap';
import Moment from 'react-moment';

class TaskListItem extends Component{
  
    render() {
        
        return(
            (this.props.item.task_status !== '3' && <tr>
                <td>{this.props.item.id}</td>
                <td>{this.props.item.task}</td>
                <td>{this.props.item.currency} {this.props.item.hourly_rate}</td>
                <td>{Number.parseFloat(((this.props.item.total_time / 1000) /3600) * this.props.item.hourly_rate).toFixed(2)}</td>
                <td><Moment format="YYYY-MM-DD">{this.props.item.created_date}</Moment></td>
                <td><Moment format="YYYY-MM-DD">{this.props.item.submission_date}</Moment></td>
                <td><Moment format="YYYY-MM-DD">{this.props.item.updatedAt}</Moment></td>
                <td>{this.props.item.new_status}{this.props.item.task_status == '3' && <span className="custombadge"><Badge color="dark">Completed</Badge></span>}
                    {this.props.item.task_status == '2' && <span className="custombadge"><Badge color="success">In progress</Badge></span>}
                    {this.props.item.task_status == '1' && <span className="custombadge"><Badge color="info">New</Badge></span>}
                    </td>
                <td><div className="comment_break">{this.props.item.comment}</div></td>
                <td>
                    <div className="action-box">
                        <Button size="sm" className="btn-pill btn_action" color="danger"  type="button" onClick={() => this.props.onDelete(this.props.item._id)}>
                            Delete
                        </Button>
                        <Button size="sm" className="btn-pill btn_action" color="info"  type="button" onClick={() => this.props.handleEditAction(this.props.item._id, this.props.item)}>
                            Edit
                        </Button>
                     </div>
                </td>
            </tr>)
        );
    }
}



export default TaskListItem;