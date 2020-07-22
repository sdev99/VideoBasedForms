import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Badge, Card, CardBody, CardHeader, Col, Row, Table, Button} from 'reactstrap';

import usersData from './UsersData'
import {CSVLink} from "react-csv";

function UserRow(props) {
    const user = props.user
    const userLink = `/users/${user.id}`

    const getBadge = (status) => {
        return status === 'Active' ? 'success' :
            status === 'Inactive' ? 'secondary' :
                status === 'Pending' ? 'warning' :
                    status === 'Banned' ? 'danger' :
                        'primary'
    }

    return (
        <tr key={user.id.toString()}>
            <th scope="row"><Link to={userLink}>{user.id}</Link></th>
            <td><Link to={userLink}>{user.name}</Link></td>
            <td>{user.email}</td>
            <td>{user.registered}</td>
            {/*<td>{user.role}</td>*/}
            {/*<td><Link to={userLink}><Badge color={getBadge(user.status)}>{user.status}</Badge></Link></td>*/}
        </tr>
    )
}

class Users extends Component {

    render() {

        const userList = usersData.filter((user) => user.id < 10)

        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl={6}>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Users B <small
                                className="text-muted">Allowed max 10 users</small>

                                <div className="card-header-actions">
                                    <Link to={'/user/userform'}>
                                        <Button color="secondary">Add User</Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Table responsive hover>
                                    <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email Address</th>
                                        <th scope="col">Registered</th>
                                        {/*<th scope="col">status</th>*/}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {userList.map((user, index) =>
                                        <UserRow key={index} user={user}/>
                                    )}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Users;
