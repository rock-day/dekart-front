import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Input, Label, Col, Row } from 'reactstrap';
import SelectSearch from 'react-select-search';
import './css/select-search.css';
import moment from 'moment';
import 'moment/locale/ru';

function ModalScheduleAdd(props) {
  return (
    <Modal isOpen={props.isAddModalOpen}>
      <ModalHeader>Расписание занятия</ModalHeader>
      <ModalBody>
        <Form>
          <Label>Группа</Label>
          <SelectSearch
            search
            onChange={props.handleGroupChange}
            value={props.scheduleItemData.newGroupId || ''}
            options={props.selectGroupOptions}
            defaultValue=''
            name='newTitle'
            placeholder='Выберите группу'
          />
          <Row>
            <Col>
              <FormGroup>
                <Label for='newStartDate'>Дата</Label>
                <Input readOnly
                  type='date'
                  id='newStartDate'
                  value={moment.unix(props.scheduleItemData.newStart).format('YYYY-MM-DD') || ''}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for='newStartTime'>Начало</Label>
                <Input
                  type='time'
                  name='newStartTime'
                  id='newStartTime'
                  value={moment.unix(props.scheduleItemData.newStart).format('HH:mm') || ''}
                  onChange={props.handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label for='newEndTime'>Окончание</Label>
                <Input
                  type='time'
                  name='newEndTime'
                  id='newEndTime'
                  value={moment.unix(props.scheduleItemData.newEnd).format('HH:mm') || ''}
                  onChange={props.handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormGroup>
                <Label>Повторять до
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
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onClick={props.addEvent}>Добавить</Button>{' '}
        <Button color='secondary' onClick={props.closeModal}>Отмена</Button>
      </ModalFooter>
    </Modal>
  )
}

export default ModalScheduleAdd;
