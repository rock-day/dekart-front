import React from 'react';
import { Input, Label, FormGroup, Col, Container, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/ru';

let students = [];
let returnPath = '';
let studentId = '';

class Student extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      students,
      student: {
        id: '',
        groups: [],
        name: '',
        fname: '',
        sname: '',
        mname: '',
        birthday: '',
        phone: '',
        email: '',
        address: '',
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    // console.log('props', this.props)
    // const { handle } = this.props.match.params;
    // const { studentId } = this.props.location.state;
    students = [
      {
        id: '1',
        groups: ['123'],
        name: 'Мальвина Селёдкина',
        fname: 'Мальвина',
        sname: 'Селёдкина',
        mname: 'Ивановна',
        birthday: 1588258404,
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
        birthday: 1588258404,
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
        birthday: 1588258404,
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
        birthday: 1588258404,
        phone: '444-44-44',
        email: '',
        address: '',
      },
    ];

    this.setState({
      students,
    });

    returnPath = this.props.location.state ? this.props.location.state.returnPath : '';
    studentId = this.props.location.state ? this.props.location.state.studentId : '';

    const i = students.findIndex((st) => (st.id === studentId));
    const student = students[i];
    if (student) {
      this.setState({
        student,
      });
    }
    else {
      this.setState({
        student: {
          id: studentId,
        },
      });
    }
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    let state = this.state;
    let attr = '';
    let attrValue = '';

    switch (name) {
      case 'birthday': {
        attr = 'birthday';
        attrValue = moment(value).unix();
        break;
      }

      default:
        attr = name;
        attrValue = value;
    }

    this.setState((prevState) => ({
      student: {
        ...prevState.student,
        [attr]: attrValue,
      },
    }));
  }

  render() {
    return (
      <div align='left'>
        <Container fluid>
          <div>
            Студент
            <p/>
          </div>
          <Col sm={5}>
            <FormGroup row>
              <Label for="sname" sm={3}>Фамилия</Label>
              <Col>
                <Input type="text" name="sname" id="sname" value={this.state.student.sname} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="fname" sm={3}>Имя</Label>
              <Col>
                <Input type="text" name="fname" id="fname" value={this.state.student.fname} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="mname" sm={3}>Отчество</Label>
              <Col>
                <Input type="text" name="mname" id="mname" value={this.state.student.mname} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="birthday" sm={3}>Дата рождения</Label>
              <Col>
                <Input type="date" name="birthday" id="birthday" value={moment.unix(this.state.student.birthday).format('YYYY-MM-DD')} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="phone" sm={3}>Телефон</Label>
              <Col>
                <Input type="text" name="phone" id="phone" value={this.state.student.phone} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="email" sm={3}>E-mail</Label>
              <Col>
                <Input type="email" name="email" id="email" value={this.state.student.email} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="address" sm={3}>Адрес</Label>
              <Col>
                <Input type="text" name="address" id="address" value={this.state.student.address} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            {
            returnPath !== ''
              ? (
                <div align="right">
                  <Button
                    color="secondary"
                    tag={Link}
                    to={{
                      pathname: returnPath,
                    }}
                  >
                    Закрыть
                  </Button>
                </div>
              )
              : null
            }
          </Col>
        </Container>
      </div>
    );
  }
}

export default Student;
