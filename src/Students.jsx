import React from 'react';
import { Input, Table, Container, Row, Col, Button, NavLink, Label, FormGroup, Form } from 'reactstrap';
import { Link } from 'react-router-dom';
import Student from './Student';
import { v4 as uuidv4 } from 'uuid';

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
        fname: 'Мальвина',
        sname: 'Селёдкина',
        mname: 'Ивановна',
        birthday: '',
        phone: '111-11-11',
        email: '',
        address: '',
      },
      {
        id: '2',
        groups: ['234'],
        name: 'Артемий Вассерман',
        fname: 'Артемий',
        sname: 'Вассерман',
        mname: 'Иванович',
        birthday: '',
        phone: '222-22-22',
        email: '',
        address: '',
      },
      {
        id: '3',
        groups: ['123', '234'],
        name: 'Пётр Васечкин',
        fname: 'Пётр',
        sname: 'Васечкин',
        mname: 'Иванович',
        birthday: '',
        phone: '333-33-33',
        email: '',
        address: '',
      },
      {
        id: '4',
        groups: ['123', '234'],
        name: 'Элла Памфилова',
        fname: 'Элла',
        sname: 'Памфилова',
        mname: 'Ивановна',
        birthday: '',
        phone: '444-44-44',
        email: '',
        address: '',
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
                pathname: '/student/',
                state: {
                  studentId: st.id,
                  returnPath: '/students/',
                },
              }}
            >
              {st.name}
            </NavLink>
          </td>
          <td>
            <p>{st.phone}</p>
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
