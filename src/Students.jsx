import React from 'react';
import { Input, Table, Container, Row, Col, Button, NavLink, Label, FormGroup, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import Student from './Student';

let students = [];

class Students extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      students,
      filter: '',
    };

    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentDidMount() {
    students = [
      {
        id: '1',
        groups: ['123'],
        name: 'Мальвина Селёдкина',
      },
      {
        id: '2',
        groups: ['234'],
        name: 'Артемий Вассерман',
      },
      {
        id: '3',
        groups: ['123', '234'],
        name: 'Пётр Васечкинffffffffffff Васечкинffffffffffff',
      },
      {
        id: '4',
        groups: ['123', '234'],
        name: 'Элла Памфилова',
      },
    ];

    this.setState({
      students,
    })
  }

  handleFilterChange(event) {
    this.setState({
      filter: event.target.value,
      students: students.filter((st) => (st.name.toLowerCase().includes(event.target.value.toLowerCase()))),
    });
  }

  render() {
    const studentsTable = this.state.students.map((st) => {
      return (
        <tr key={st.id} align="left">
          <td>
            <NavLink
              tag={Link}
              to={{
                pathname: '/student',
                state: {
                  studentId: st.id,
                }
              }}>
            {st.name}
            </NavLink>
          </td>
        </tr>
      );
    });
    const studentId = 135

    return (
      <div>
        <Container fluid={true}>
          <Row>
            <Col xs="2">
              <NavLink
                tag={Link}
                to={{
                  pathname: '/student',
                  state: {
                    studentId: studentId,
                  }
                }}>
              Добавить студента
              </NavLink>
            </Col>
            <Col xs="4">
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
          <tbody>
            {studentsTable}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Students;
