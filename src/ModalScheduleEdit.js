import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Input, Label, Col, Row } from 'reactstrap';
import SelectSearch from 'react-select-search';
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

class ModalScheduleEdit extends React.Component {
  render() {
    console.log(this.props)
    return (
      <Modal isOpen={this.props.isOpen} size='lg'>
        <ModalHeader>Расписание занятия</ModalHeader>
        <ModalBody>
          <Form>
            <Label>Группа
              <SelectSearch
                search
                onChange={this.props.handleGroupChange}
                value={this.props.scheduleItemData.newGroupId || ''}
                options={this.props.selectGroupOptions}
                defaultValue=''
                name='newTitle'
                placeholder='Выберите группу'
                isRequired
              />
            </Label>
            <Row>
              <Col sm={8}>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Начало расписания
                        <Input
                          type='date'
                          name='newStartDate'
                          id='newStartDate'
                          value={moment.unix(this.props.scheduleItemData.newStart).format('YYYY-MM-DD') || ''}
                          onChange={this.props.handleInputChange}
                        />
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label>Повторять до
                        <Input
                          type="date"
                          name="newRepeatDate"
                          id="repeat"
                          value={moment.unix(this.props.scheduleItemData.newRepeat).format('YYYY-MM-DD') || ''}
                          onChange={this.props.handleInputChange}
                        >
                        </Input>
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm={5}>
                    <FormGroup>
                      <Label>Дата урока
                        <Input
                          readOnly
                          type="date"
                          defaultValue={moment.unix(this.props.scheduleItemData.eventStart).format('YYYY-MM-DD') || ''}
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
                          value={moment.unix(this.props.scheduleItemData.newStart).format('HH:mm') || ''}
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
                          value={moment.unix(this.props.scheduleItemData.newEnd).format('HH:mm') || ''}
                          onChange={this.props.handleInputChange}
                        />
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Label>Студенты
                  <Students students={this.props.students} />
                </Label>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color='success' onClick={this.props.conductLesson}>Провести урок</Button>{' '}
          <Button color='primary' onClick={this.props.editEvent}>Изменить расписание</Button>{' '}
          <Button color='warning'
            onClick={this.props.excludeScheduleEvent}>Отменить урок</Button>{' '}
          <Button color='danger' onClick={this.props.deleteScheduleItem}>Удалить расписание</Button>{' '}
          <Button color='secondary' onClick={this.props.closeModal}>Отмена</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default ModalScheduleEdit;
