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

function ModalScheduleEdit(props) {
  return (
    <Modal isOpen={props.isOpen} size='lg'>
      <ModalHeader>Расписание занятия</ModalHeader>
      <ModalBody>
        <Form>
          <Label>
            Группа
            <SelectSearch
              search
              onChange={props.handleGroupChange}
              value={props.scheduleItemData.newGroupId || ''}
              options={props.selectGroupOptions}
              defaultValue=''
              name='newTitle'
              placeholder='Выберите группу'
            />
          </Label>
          <Row>
            <Col sm={8}>
              <Row>
                <Col>
                  <FormGroup>
                    <Label>
                      Начало расписания
                      <Input
                        type='date'
                        name='newStartDate'
                        id='newStartDate'
                        value={moment.unix(props.scheduleItemData.newStart).format('YYYY-MM-DD') || ''}
                        onChange={props.handleInputChange}
                      />
                    </Label>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label>
                      Повторять до
                      <Input
                        type="date"
                        name="newRepeatDate"
                        id="repeat"
                        value={moment.unix(props.scheduleItemData.newRepeat).format('YYYY-MM-DD') || ''}
                        onChange={props.handleInputChange}
                      >
                      </Input>
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={5}>
                  <FormGroup>
                    <Label>
                      Дата урока
                      <Input
                        readOnly
                        type="date"
                        defaultValue={moment.unix(props.scheduleItemData.eventStart).format('YYYY-MM-DD') || ''}
                      >
                      </Input>
                    </Label>
                  </FormGroup>
                </Col>
                <Col sm={3}>
                  <FormGroup>
                    <Label for='newStartTime'>
                      Начало
                      <Input
                        type='time'
                        name='newStartTime'
                        id='newStartTime'
                        value={moment.unix(props.scheduleItemData.newStart).format('HH:mm') || ''}
                        onChange={props.handleInputChange}
                      />
                    </Label>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for='newEndTime'>
                      Окончание
                      <Input
                        type='time'
                        name='newEndTime'
                        id='newEndTime'
                        value={moment.unix(props.scheduleItemData.newEnd).format('HH:mm') || ''}
                        onChange={props.handleInputChange}
                      />
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
            <Col>
              <Label>
                Студенты
                <Students students={props.students} />
              </Label>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color='success' onClick={props.conductLesson}>Провести урок</Button>{' '}
        <Button color='primary' onClick={props.editEvent}>Сохранить</Button>{' '}
        <Button color='warning'
          onClick={props.excludeScheduleEvent}>Отменить</Button>{' '}
        <Button color='danger' onClick={props.deleteScheduleItem}>Удалить</Button>{' '}
        <Button color='secondary' onClick={props.closeModal}>Закрыть</Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalScheduleEdit;
