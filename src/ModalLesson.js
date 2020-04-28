import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Input, Label, Col, Row, Table} from 'reactstrap';
import './css/select-search.css';
import moment from 'moment';
import 'moment/locale/ru';

function Students(props) {
  const studentsTable = props.studentLessons.map((sl) => {
    return (
      <tr key={sl.id}>
        <td>{sl.studentName}</td>
        <td align='right'>
          <Input type='checkbox' id={sl.id} value={sl.isExcuse} />{' '}
        </td>
        <td>
          {
            sl.isExcuse
              ?
              <div>
                <Input type='text' value={sl.comment} />
                <Input type='file' />
              </div>
              : null
          }
        </td>
      </tr>
    )
  });
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th width='35%'>Студент</th>
          <th colSpan='2'>Отсутствие по уважтельной причине</th>
        </tr>
      </thead>
      <tbody>
        {studentsTable}
      </tbody>
    </Table>
  );
}

function ModalLesson(props) {
  return (
    <Modal isOpen={props.isOpen} size='lg'>
      <ModalHeader>Проведённый урок - {props.group ? props.group.name : ''}</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col>
              <Row>
                <Col lg={4}>
                  <FormGroup>
                    <Label>Дата урока
                      <Input
                        readOnly
                        type="text"
                        defaultValue={moment.unix(props.lessonData.newStart).format('YYYY-MM-DD') || ''}
                      >
                      </Input>
                    </Label>
                  </FormGroup>
                </Col>
                <Col lg={2}>
                  <FormGroup>
                    <Label for='newStartTime'>Начало
                      <Input
                        type='time'
                        name='newStartTime'
                        id='newStartTime'
                        value={moment.unix(props.lessonData.newStart).format('HH:mm') || ''}
                        onChange={props.handleInputChange}
                      />
                    </Label>
                  </FormGroup>
                </Col>
                <Col lg={2}>
                  <FormGroup>
                    <Label for='newEndTime'>Окончание
                      <Input
                        type='time'
                        name='newEndTime'
                        id='newEndTime'
                        value={moment.unix(props.lessonData.newEnd).format('HH:mm') || ''}
                        onChange={props.handleInputChange}
                      />
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </Row>
          <FormGroup>
            <Students studentLessons={props.studentLessons} />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onClick={props.editLesson}>Сохранить</Button>{' '}
        <Button color='warning' onClick={props.deleteLesson}>Отменить</Button>{' '}
        <Button color='secondary' onClick={props.closeModal}>Закрыть</Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalLesson;
