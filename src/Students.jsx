import React from 'react';
import { Input, Table, Container, Row, Col, Button, NavLink, Label, FormGroup, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import Student from './Student';
import { v4 as uuidv4 } from 'uuid';

let students = [];
let studentsFilter = [];

class Students extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      students,
      studentsFilter,
      filter: '',
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    this.getStudents();
  }

  getStudents() {
    fetch('http://localhost:5000/api/v1/students')
      .then((res) => res.json())
      .then((data) => {
        this.setState({ students: data.data, studentsFilter: data.data });
      })
      .catch(console.log);
  }

  handleFilterChange(event) {
    this.setState({
      filter: event.target.value,
      studentsFilter: this.state.students.filter((st) => (st.lastname.toLowerCase().includes(event.target.value.toLowerCase()) || st.firstname.toLowerCase().includes(event.target.value.toLowerCase()))),
    });
  }

  render() {
    const studentsTable = this.state.studentsFilter.map((st) => {
      return (
        <tr key={st.uuid} align="left">
          <td>
            <NavLink
              tag={Link}
              to={{
                pathname: '/student/',
                state: {
                  studentId: st.uuid,
                  returnPath: '/students/',
                },
              }}
            >
              {st.firstname + ' ' + st.lastname}
            </NavLink>
          </td>
          <td>
            <p></p>
          </td>
        </tr>
      );
    });

    return (
      <div>
        <Container fluid>
          <Row>
            <Col xs="3">
              <Button
                color='success'
                tag={Link}
                to={{
                  pathname: '/student/',
                  state: {
                    studentId: `${uuidv4()}`,
                    returnPath: '/students/',
                  },
                }}>
              Добавить студента
            </Button>
            </Col>
            <Col xs="6">
              <Input
                id="search"
                type="text"
                name="filter"
                value={this.state.filter}
                onChange={this.handleFilterChange}
                placeholder="Введите часть ФИО для поиска"
              />
            </Col>
          </Row>
        </Container>
        <Table responsive hover>
          <thead>
            <tr align='left'>
              <th>ФИО</th>
              <th>Телефон</th>
            </tr>
          </thead>
          <tbody>
            {studentsTable}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Students;
