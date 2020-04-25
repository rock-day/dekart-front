import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Input, Label, Col, Row } from 'reactstrap';
import './css/select-search.css';
import moment from 'moment';
import 'moment/locale/ru';

function Students(props) {
  const students = props.students;
  const studentsList = students.map((student) =>
    <li key={student.id}>{student.name}</li>
  );
  return (
    <ul>{studentsList}</ul>
  );
}

class ModalLesson extends React.Component {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} size='lg'>
        <ModalHeader>Проведённый урок - {this.props.group ? this.props.group.name : ''}</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col sm={8}>
                <Row>
                  <Col sm={5}>
                    <FormGroup>
                      <Label>Дата урока
                        <Input
                          readOnly
                          type="date"
                          defaultValue={moment.unix(this.props.lessonData.newStart).format('YYYY-MM-DD') || ''}
                        >
                        </Input>
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col sm={3}>
                    <FormGroup>
                      <Label for='newStartTime'>Начало
                        <Input
                          type='time'
                          name='newStartTime'
                          id='newStartTime'
                          value={moment.unix(this.props.lessonData.newStart).format('HH:mm') || ''}
                          onChange={this.props.handleInputChange}
                        />
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for='newEndTime'>Окончание
                        <Input
                          type='time'
                          name='newEndTime'
                          id='newEndTime'
                          value={moment.unix(this.props.lessonData.newEnd).format('HH:mm') || ''}
                          onChange={this.props.handleInputChange}
                        />
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Label>Студенты
                  <Students students={this.props.students} />
                </Label>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color='primary' onClick={this.props.editLesson}>Изменить</Button>{' '}
          <Button color='danger' onClick={this.props.deleteLesson}>Удалить</Button>{' '}
          <Button color='secondary' onClick={this.props.closeModal}>Закрыть</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default ModalLesson;
