import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input, Table, Container, Row, Col } from 'reactstrap';

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
          <td>{st.name}</td>
        </tr>
      );
    });

    return (
      <div>
        <Container>
          <Row>
            <Col sm={{ size: 4 }}>
              <Input
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
