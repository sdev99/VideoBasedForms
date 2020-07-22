import React, {Component} from 'react';
import {
    Alert,
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
//   Collapse,
//   DropdownItem,
//   DropdownMenu,
//   DropdownToggle,
//   Fade,
    Form,
    FormGroup,
    FormText,
    FormFeedback,
    Input,
//   InputGroup,
//   InputGroupAddon,
//   InputGroupButtonDropdown,
//   InputGroupText,
    Label,
    Row,
} from 'reactstrap';
import {connect} from 'react-redux';
import {createTask, editTask} from './../../actions';
import {SketchPicker} from 'react-color';

class TaskForms extends Component {

    questionsInputRefs = {};

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.toggleFade = this.toggleFade.bind(this);
        this.state = {
            collapse: true,
            fadeIn: true,
            timeout: 300,
            data: [],
            background: '#417505',
            edit_id: false,
            id: false,
            form_submitted: false,
            task_status: '1',

            questions: ['', '', '', '', '', '', '', '', '', '']
        };
    }

    componentDidMount() {

        if ('undefined' !== typeof (this.props.location.state)) {
            this.setState({
                data: this.props.location.state.edit_data
            })
            this.setState({
                id: this.props.location.state.edit_data.id
            });
            this.setState({
                edit_id: this.props.location.state.edit_id
            });
            this.setState({
                task_status: this.props.location.state.edit_data.task_status
            });
            let edit_data = this.props.location.state.edit_data;
            console.log(edit_data);
            this.setState({background: edit_data.background_color});

            // this.taskComment.value = edit_data.comment;
            // this.taskName.value = edit_data.task;
            // this.taskSubmissionDate.value = edit_data.submission_date;
            // // console.log('date val format',edit_data.submission_date)
            // this.taskCreateDate.value = edit_data.created_date;
            // this.taskHourlyRate.value = edit_data.hourly_rate;
            // this.taskCurrency.value = edit_data.currency;
        } else {

            // Remove this else condition, populating data for test purpose.

            let temptask = this.props.temptask;

            if (temptask.task) {
                // this.taskComment.value = temptask.comment;
                // this.taskName.value = temptask.task;
                // this.taskSubmissionDate.value = temptask.submission_date;
                // this.taskHourlyRate.value = temptask.hourly_rate;
                // this.taskCurrency.value = temptask.currency;
                this.setState({background: temptask.background_color})
            }

            let today = new Date();
            let dd = today.getDate();

            let mm = today.getMonth() + 1;
            let yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }
            today = yyyy + '-' + mm + '-' + dd;

            // this.taskCreateDate.value = today;
        }
    }

    toggle() {
        this.setState({collapse: !this.state.collapse});
    }

    toggleFade() {
        this.setState((prevState) => {
            return {fadeIn: !prevState}
        });
    }

    handleChangeComplete = (color) => {
        this.setState({background: color.hex});
    };

    handleInputChange = (e, key) => {
        const questions = this.state.questions;

        const question = this.questionsInputRefs[key].value;
        questions[key] = question;
        this.setState({question});

        // let data_object = {
        //     task,
        //     comment,
        //     created_date,
        //     submission_date,
        //     hourly_rate,
        //     task_status,
        //     background_color: this.state.background,
        //     currency,
        //     editing: false
        // }
        // if (false !== this.state.edit_id) {
        //     data_object = {
        //         _id: this.state.edit_id,
        //         id: this.state.id,
        //         total_time: this.state.data.total_time,
        //         task,
        //         comment,
        //         created_date,
        //         submission_date,
        //         hourly_rate,
        //         task_status,
        //         background_color: this.state.background,
        //         currency,
        //         editing: true
        //     }
        // } else {
        //     this.props.onKeppTask(data_object);
        // }

    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.handleInputChange(e);
        console.log('Edit', this.state);
        if (this.state.edit_id) {
            this.props.onEditTask(this.state);
            this.setState({form_submitted: true})
        } else {
            this.props.onAddTask(this.state);
            this.setState({form_submitted: true})
        }

        this.taskName.value = '';
        this.taskComment.value = '';
        this.taskCreateDate.value = '';
        this.taskSubmissionDate.value = '';
        this.taskHourlyRate.value = '';
        this.taskCurrency.value = '';
        this.props.removeTempTask();
    }

    render() {
        return (
            <div className="animated fadeIn taskFormWrapper">
                <Row>
                    <Col xs="12" sm="12">
                        {this.state.form_submitted && <Alert color="primary">
                            Task submitted successfully.
                        </Alert>}
                        <Card>
                            <CardHeader>
                                <strong>Question form</strong>
                                <small> Maximum 10 questions allowed</small>
                                {/* {this.props.location.state.edit_record_id} */}
                            </CardHeader>
                            <CardBody>
                                <Form className="form-horizontal was-validated" onSubmit={this.handleSubmit}>

                                    {
                                        this.state.questions.map((question, key) => (
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label htmlFor="task-name"> {'Question ' + (key + 1)}</Label>
                                                </Col>
                                                <Col xs="12" md="9">
                                                    <Input type="text"
                                                           id={'question_'+key}
                                                           innerRef={(input) => this.questionsInputRefs[key] = input}
                                                           onChange={(e) => {
                                                               this.handleInputChange(e, key);
                                                           }}
                                                           name={'question_'+key}
                                                           placeholder="Enter question..." required/>
                                                    {/* <FormFeedback invalid className="help-block">Please provide the task name.</FormFeedback>
                            <FormFeedback valid className="help-block">&nbsp;</FormFeedback> */}
                                                </Col>
                                            </FormGroup>
                                        ))
                                    }


                                    {/*        <FormGroup row>*/}
                                    {/*            <Col md="3">*/}
                                    {/*                <Label htmlFor="task-comment">Comments</Label>*/}
                                    {/*            </Col>*/}
                                    {/*            <Col xs="12" md="9">*/}
                                    {/*                <Input type="textarea" innerRef={(input) => this.taskComment = input}*/}
                                    {/*                       onChange={this.handleInputChange} name="task-comment"*/}
                                    {/*                       id="task-comment" rows="5"*/}
                                    {/*                />*/}
                                    {/*                /!* <FormText className="help-block">Please enter task comment.</FormText> *!/*/}
                                    {/*            </Col>*/}
                                    {/*        </FormGroup>*/}
                                    {/*        <FormGroup row>*/}
                                    {/*            <Col md="3">*/}
                                    {/*                <Label htmlFor="task-cdate">Created Date</Label>*/}
                                    {/*            </Col>*/}
                                    {/*            <Col xs="12" md="9">*/}
                                    {/*                <Input type="date" id="task-cdat"*/}
                                    {/*                       innerRef={(input) => this.taskCreateDate = input}*/}
                                    {/*                       onChange={this.handleInputChange} name="task-cdat"*/}
                                    {/*                       placeholder="Created Date" required/>*/}
                                    {/*                /!* <FormText className="help-block">Please enter task created date.</FormText> *!/*/}
                                    {/*            </Col>*/}
                                    {/*        </FormGroup>*/}
                                    {/*        <FormGroup row>*/}
                                    {/*            <Col md="3">*/}
                                    {/*                <Label htmlFor="task-sdate">Target Date</Label>*/}
                                    {/*            </Col>*/}
                                    {/*            <Col xs="12" md="9">*/}
                                    {/*                <Input type="date" id="task-sdat"*/}
                                    {/*                       innerRef={(input) => this.taskSubmissionDate = input}*/}
                                    {/*                       onChange={this.handleInputChange} name="task-sdat"*/}
                                    {/*                       placeholder="Target Date"/>*/}
                                    {/*                /!* <FormText className="help-block">Please enter task target date.</FormText> *!/*/}
                                    {/*            </Col>*/}
                                    {/*        </FormGroup>*/}
                                    {/*        <FormGroup row>*/}
                                    {/*            <Col md="3">*/}
                                    {/*                <Label htmlFor="task-hrate">Hourly Rate</Label>*/}
                                    {/*            </Col>*/}
                                    {/*            <Col xs="12" md="9">*/}
                                    {/*                <Input type="number" id="task-hrate"*/}
                                    {/*                       innerRef={(input) => this.taskHourlyRate = input}*/}
                                    {/*                       onChange={this.handleInputChange} name="task-name"*/}
                                    {/*                       placeholder="Enter Hourly rate..." required/>*/}
                                    {/*                /!* <FormFeedback invalid className="help-block">Please provide the hourly rate.</FormFeedback>*/}
                                    {/*<FormFeedback valid className="help-block">&nbsp;</FormFeedback> *!/*/}
                                    {/*            </Col>*/}
                                    {/*        </FormGroup>*/}
                                    {/*        <FormGroup row>*/}
                                    {/*            <Col md="3">*/}
                                    {/*                <Label htmlFor="task-hrate">Currency</Label>*/}
                                    {/*            </Col>*/}
                                    {/*            <Col xs="12" md="9">*/}
                                    {/*                <Input type="text" id="task-currency"*/}
                                    {/*                       innerRef={(input) => this.taskCurrency = input}*/}
                                    {/*                       onChange={this.handleInputChange} name="task-currency"*/}
                                    {/*                       placeholder="Enter currency symbol..." required/>*/}
                                    {/*                /!* <FormFeedback invalid className="help-block">Please provide Currency.</FormFeedback>*/}
                                    {/*<FormFeedback valid className="help-block">&nbsp;</FormFeedback> *!/*/}
                                    {/*            </Col>*/}
                                    {/*        </FormGroup>*/}
                                    {/*        <FormGroup row>*/}
                                    {/*            <Col md="3">*/}
                                    {/*                <Label htmlFor="task-hrate">Pick Color</Label>*/}
                                    {/*            </Col>*/}
                                    {/*            <Col xs="12" md="9">*/}
                                    {/*                <SketchPicker color={this.state.background}*/}
                                    {/*                              onChangeComplete={this.handleChangeComplete}*/}
                                    {/*                              onChange={this.handleInputChange}/>*/}
                                    {/*            </Col>*/}
                                    {/*        </FormGroup>*/}
                                    <CardFooter>
                                        <Button type="submit" size="sm" color="primary"><i
                                            className="fa fa-dot-circle-o"></i> Submit</Button>
                                        <Button type="reset" size="sm" color="danger"><i
                                            className="fa fa-ban right"></i> Reset</Button>
                                    </CardFooter>
                                </Form>
                            </CardBody>

                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onKeppTask: task => {
            dispatch({
                type: 'KEEP_TEMP_TASK',
                data: task
            });
        },
        removeTempTask: () => {
            dispatch({
                type: 'REMOVE_TEMP_TASK',
            });
        },
        onAddTask: task => {
            dispatch(createTask(task.data));
        },
        onEditTask: task => {
            console.log('edit task working', task);
            dispatch(editTask(task.data));
        }
    };
};
const mapStateToProps = state => {
    return {
        temptask: state.temptask
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(TaskForms);
