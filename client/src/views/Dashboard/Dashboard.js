import React, {Component, lazy, Suspense} from 'react';
// import { Bar, Line } from 'react-chartjs-2';
// import {
//   Badge,
//   Card,
//   CardBody,
//   CardHeader,
//   Col,
//   Row,
//   Pagination, PaginationItem, PaginationLink,
//   Table,
// } from 'reactstrap';
// import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
// import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'

import TaskList from '../TaskForm/TaskList'
import Users from "../Users";

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

        this.state = {
            dropdownOpen: false,
            radioSelected: 2,
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    }

    onRadioBtnClick(radioSelected) {
        this.setState({
            radioSelected: radioSelected,
        });
    }

    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    render() {

        return (
            <div className="animated fadeIn">
                <Users/>


            </div>
        );
    }
}

export default Dashboard;
