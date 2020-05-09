import React from 'react';
import { Input, Label, FormGroup, Col, Container, Button, Modal, ModalHeader, ModalBody, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/ru';

let returnPath = '';
let studentId = '';
let createStudent = false;

class Student extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      student: {
        uuid: '',
        lastname: '',
        firstname: '',
        middlename: '',
        birthdate: '',
        phone: '',
        email: '',
        address: '',
      },
      isDelConfirmModalOpen: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveStudent = this.saveStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state) {
      returnPath = this.props.location.state.returnPath;
      createStudent = this.props.location.state.createStudent;
      studentId = this.props.location.state.studentId;
      this.setState({
        student: {
          uuid: studentId,
        },
      });
      if (createStudent === false) this.getStudent(studentId);
    }
  }

  getStudent(studentId) {
    const url = 'http://localhost:5000/api/v1/students/' + studentId;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.data) {
          this.setState({
            student: {
              uuid: res.data.uuid,
              lastname: res.data.lastname,
              firstname: res.data.firstname,
              middlename: res.data.middlename,
              birthdate: moment(res.data.birthdate).format('YYYY-MM-DD'),
              phone: res.data.phone,
              email: res.data.email,
              address: res.data.address,
            },
          });
        } else {
          this.setState({
            student: {
              uuid: studentId,
            },
          });
        }
      })
      .catch(console.log);
  }

  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    let state = this.state;
    let attr = '';
    let attrValue = '';

    switch (name) {
      case 'birthdate': {
        attr = 'birthdate';
        attrValue = value;
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

  saveStudent() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uuid: this.state.student.uuid,
        lastname: this.state.student.lastname,
        firstname: this.state.student.firstname,
        middlename: this.state.student.middlename,
        birthdate: this.state.student.birthdate,
      }),
    };
    fetch('http://localhost:5000/api/v1/students', requestOptions)
      .then(response => response.json())
      // .then(data => this.setState({ postId: data.id }));
  }

  deleteStudent(action) {
    switch (action) {
      case 'confirm': {
        const requestOptions = {
          method: 'DELETE',
        };
        const url = 'http://localhost:5000/api/v1/students/' + studentId;
        fetch(url, requestOptions)
          .then(response => response.json())
          // .then(data => this.setState({ postId: data.id }));
        this.setState({ isDelConfirmModalOpen: false });
        break;
      }

      case '': {
        this.setState({
          isDelConfirmModalOpen: true,
        });
        break;
      }

      default:
        this.setState({
          isDelConfirmModalOpen: false,
        });
    }
  }

  handleDeleteStudent() {
    this.setState({
      isDelConfirmModalOpen: true,
    });
  };

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
              <Label for="lastname" sm={3}>Фамилия</Label>
              <Col>
                <Input type="text" name="lastname" id="lastname" value={this.state.student.lastname} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="firstname" sm={3}>Имя</Label>
              <Col>
                <Input type="text" name="firstname" id="firstname" value={this.state.student.firstname} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="middlename" sm={3}>Отчество</Label>
              <Col>
                <Input type="text" name="middlename" id="middlename" value={this.state.student.middlename} onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="birthdate" sm={3}>Дата рождения</Label>
              <Col>
                <Input type="date" name="birthdate" id="birthdate" value={this.state.student.birthdate} onChange={this.handleInputChange} />
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
                  <Button color='primary' onClick={this.saveStudent}>Сохранить</Button>{' '}
                  <Button
                    color="danger"
                    onClick={() => this.deleteStudent('')}
                  >
                    Удалить
                  </Button>{' '}
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
        <Modal isOpen={this.state.isDelConfirmModalOpen} size='lg'>
          <ModalHeader>Уверены, что хотите удалить студента?</ModalHeader>
          <ModalBody>
            <div align="center">
              <Container>
                <Row>
                <Col sm={4}>
                  <Button
                    color="danger"
                    onClick={() => this.deleteStudent('confirm')}
                    tag={Link}
                    to={{
                      pathname: returnPath,
                    }}
                  >
                    Удалить
                  </Button>
                </Col>
                <Col sm={8}>
                  <Button
                    color="secondary"
                    onClick={() => this.deleteStudent('cancel')}
                  >
                    Отмена
                  </Button>
                </Col>
                </Row>
              </Container>
            {/* </div>
            <div align="right"> */}
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Student;
