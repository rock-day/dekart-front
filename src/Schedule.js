import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import { Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Input, Label, Col, Row } from 'reactstrap';
import SelectSearch from 'react-select-search';
import './css/select-search.css';

// import ExampleControlSlot from '../ExampleControlSlot'
import moment from 'moment';
import 'moment/locale/ru';

const groups = [
  {
    groupId: '123',
    name: 'Математика ОГЭ8 - Петров И.',
  },
  {
    groupId: '234',
    name: 'История ЕГЭ11 - Иванов П.',
  },
];

const schedule = [
  {
    groupId: '123',
    groupName: 'Математика ОГЭ8 - Петров И.',
    day: 1,
    start: '15:45',
    end: '17:15',
    startDate: '2020-04-05',
    endDate: '2020-05-30',
    resourceId: 1,
  },
  {
    groupId: '234',
    groupName: 'История ЕГЭ11 - Иванов П.',
    day: 3,
    start: '16:30',
    end: '18:00',
    startDate: '2020-04-05',
    endDate: '2020-05-30',
    resourceId: 1,
  },
];

function createPlan(scheduleItem) {
  const localPlanArray = [];
  const startTime = moment(scheduleItem.start, 'HH:mm');
  const endTime = moment(scheduleItem.end, 'HH:mm');
  for (let date = moment(scheduleItem.startDate);
    date.isBefore(scheduleItem.endDate);
    date.add(1, 'days')) {
    if (date.day() === scheduleItem.day) {
      let s = moment(date, 'YYYY-MM-DD HH:mm');
      s = s.set({
        hour: startTime.get('hour'),
        minute: startTime.get('minute'),
      });
      let e = moment(date, 'YYYY-MM-DD HH:mm');
      e = e.set({
        hour: endTime.get('hour'),
        minute: endTime.get('minute'),
      });
      const planItem = {
        title: 'test',
        allDay: false,
        start: s.toDate(),
        end: e.toDate(),
        resourceId: 2,
        isPlanned: true,
      };
      localPlanArray.push(planItem);
    }
  }

  return localPlanArray;
}

const planArray = Array.from(schedule, createPlan);

const eventsPlan = [].concat.apply([], planArray);

// let events = [
//   {
//     id: 0,
//     title: 'Board meeting',
//     start: new Date(2018, 0, 29, 9, 0, 0),
//     end: new Date(2018, 0, 29, 13, 0, 0),
//     resourceId: 1,
//     isPlanned: false,
//   },
//   {
//     id: 1,
//     title: 'MS training',
//     allDay: true,
//     start: new Date(2018, 0, 29, 14, 0, 0),
//     end: new Date(2018, 0, 29, 16, 30, 0),
//     resourceId: 2,
//     isPlanned: true,
//   },
//   {
//     id: 2,
//     title: 'Team lead meeting',
//     start: new Date(2018, 0, 29, 8, 30, 0),
//     end: new Date(2018, 0, 29, 12, 30, 0),
//     resourceId: 3,
//     isPlanned: false,
//   },
//   {
//     id: 11,
//     title: 'Birthday Party',
//     start: new Date(2018, 0, 30, 7, 0, 0),
//     end: new Date(2018, 0, 30, 10, 30, 0),
//     resourceId: 4,
//     isPlanned: true,
//   },
// ];

const resourceMap = [
  { resourceId: 1, resourceTitle: 'Board room' },
  { resourceId: 2, resourceTitle: 'Training room' },
  { resourceId: 3, resourceTitle: 'Meeting room 1' },
  { resourceId: 4, resourceTitle: 'Meeting room 2' },
];

class Schedule extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      events: eventsPlan,
      isAddModalOpen: false,
      isEditModalOpen: false,
      newEventData: {
        newGroupId: '',
        newTitle: '',
        newStart: '',
        newEnd: '',
        newResourceId: '',
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
  }

  handleSelect = (event) => {
    this.setState({
      newEventData: {
        newStart: event.start,
        newEnd: event.end,
        newResourceId: event.resourceId,
      },
      isAddModalOpen: true,
    });
  };

  handleSelectEvent = (event) => {
    console.log(event.title, event.start, event.end)
  };

  eventStyleGetter = ({ event, start, end, isSelected, isPlanned }) => {
    let style = {
      backgroundColor: '',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block',
    };

    if (isPlanned) {
      style.backgroundColor = 'green';
    }

    return {
      style: style,
    };
  };

  addEvent = () => {
    this.setState({
      events: [
        ...this.state.events,
        {
          start: this.state.newEventData.newStart,
          end: this.state.newEventData.newEnd,
          groupId: this.state.newEventData.newGroupId,
          title: this.state.newEventData.newTitle,
          resourceId: this.state.newEventData.newResourceId,
        },
      ],
      isAddModalOpen: false,
      isEditModalOpen: false,
    });
  };

  closeModal = () => {
    this.setState({
      isAddModalOpen: false,
      isEditModalOpen: false,
    });
  };

  handleGroupChange(event) {
    this.setState((prevState) => ({
      newEventData: {
        ...prevState.newEventData,
        newGroupId: event,
        newTitle: groups.find((grp) => (grp.groupId === event)).name,
      },
    }));
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;

    const name = target.name;
    let state = this.state;
    let attr = '';
    let attrValue = '';

    switch (name) {
      case 'newStartTime': {
        attr = 'newStart';
        let startDate = moment(state.newEventData.newStart);
        startDate = startDate.set({
          hour: value.substr(0, 2),
          minute: value.substr(3, 2),
        });
        attrValue = startDate.toDate();
        break;
      }

      case 'newEndTime': {
        attr = 'newEnd';
        let endDate = moment(state.newEventData.newEnd);
        endDate = endDate.set({
          hour: value.substr(0, 2),
          minute: value.substr(3, 2),
        });
        attrValue = endDate.toDate();
        break;
      }

      default:
        attr = name;
        attrValue = value;
    }

    this.setState((prevState) => ({
      newEventData: {
        ...prevState.newEventData,
        [attr]: attrValue,
      },
    }));
  }

  // changeEventHandler = (event) => ({
  //   this.setState({
  //     newEventData: {
  //       newTitle: this.state.newEventData.newTitle,
  //       newStart: event.target.value,
  //       newEnd: this.state.newEventData.newEnd,
  //       newResourceId: this.state.newEventData.newResourceId,
  //     },
  //   }),
  // };

  render() {
    moment.locale('ru-RU');
    const localizer = momentLocalizer(moment);
    const minTime = new Date();
    minTime.setHours(8, 0, 0);
    const maxTime = new Date();
    maxTime.setHours(22, 0, 0);

    const groupOptions = groups.map((group) => ({
      name: group.name,
      value: group.groupId.toString(),
    }));

    // [
    //   { name: 'Swedish', value: 'sv' },
    //   { name: 'English', value: 'en' },
    //   {
    //     type: 'group',
    //     name: 'Group name',
    //     items: [
    //       { name: 'Spanish', value: 'es' },
    //     ],
    //   },
    // ];

    return (
      <div>
        <Calendar
          selectable
          events={this.state.events}
          localizer={localizer}
          defaultView={Views.WEEK}
          views={['day', 'work_week', 'month', 'week', 'agenda']}
          step={30}
          min={minTime}
          max={maxTime}
          defaultDate={new Date()}
          onSelectEvent={this.handleSelectEvent}
          onDoubleClickEvent={event => event.isPlanned = !event.isPlanned}
          onSelectSlot={this.handleSelect}
          eventPropGetter={this.eventStyleGetter}
        />
        <Modal isOpen={this.state.isAddModalOpen}>
          <ModalHeader>Расписание занятия</ModalHeader>
          <ModalBody>
            <Form>
              <Label>Группа</Label>
              {/* <Input type='text' name='newTitle' onChange={this.handleInputChange}
              value={this.state.newEventData.newTitle || ''}></Input> */}
              <SelectSearch
                search
                onChange={this.handleGroupChange}
                value={this.state.newEventData.newGroupId || ''}
                options={groupOptions}
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
                      value={moment(this.state.newEventData.newStart).format('YYYY-MM-DD') || ''}
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
                      value={moment(this.state.newEventData.newStart).format('HH:mm') || ''}
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Label for='newEndTime'>Оконачание</Label>
                    <Input
                      type='time'
                      name='newEndTime'
                      id='newEndTime'
                      value={moment(this.state.newEventData.newEnd).format('HH:mm') || ''}
                      onChange={this.handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={2}>
                  <Label>Повтор:</Label>
                </Col>
                <Col>
                  <FormGroup check inline>
                    <Label check>
                      <Input type="checkbox" name="check" id="monRpt"/>
                      Пн
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input type="checkbox" name="check" id="tueRpt"/>
                      Вт
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input type="checkbox" name="check" id="wedRpt"/>
                      Ср
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input type="checkbox" name="check" id="thuRpt"/>
                      Чт
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input type="checkbox" name="check" id="friRpt"/>
                      Пт
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input type="checkbox" name="check" id="satRpt"/>
                      Сб
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label check>
                      <Input type="checkbox" name="check" id="sunRpt"/>
                      Вс
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.addEvent}>Добавить</Button>{' '}
            <Button color='secondary' onClick={this.closeModal}>Отмена</Button>
          </ModalFooter>
        </Modal>
        {/* <Modal isOpen={this.state.isEditModalOpen}>
          <ModalHeader>Modal title</ModalHeader>
          <ModalBody>
            <Form>
          <Label>Title</Label>
          <Input type='text' name='Title'>
          </Input>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.addEvent}>Изменить</Button>{' '}
            <Button color='secondary' onClick={this.closeModal}>Отмена</Button>
          </ModalFooter>
        </Modal> */}
      </div>
    );
  }
}

//Schedule.propTypes = propTypes

export default Schedule;
