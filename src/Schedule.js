import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import { Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Form, FormGroup, Input, Label, Col, Row } from 'reactstrap';
import SelectSearch from 'react-select-search';
import './css/select-search.css';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import 'moment/locale/ru';

function createPlan(scheduleItem) {
  let planItem = {};

  const localPlanArray = [];
  const startDateTime = moment.unix(scheduleItem.startDateTime);
  const endDateTime = moment.unix(scheduleItem.endDateTime);
  const endDateRepeat = scheduleItem.endDateRepeat
    ? moment.unix(scheduleItem.endDateRepeat)
    : startDateTime.clone();
  const starth = startDateTime.get('hour');
  const startm = startDateTime.get('minute');
  const endh = endDateTime.get('hour');
  const endm = endDateTime.get('minute');
  const weekDay = startDateTime.day();
  for (let date = startDateTime.clone();
    date.isSameOrBefore(endDateRepeat);
    date.add(1, 'days')) {
    if (date.day() === weekDay) {
      let s = moment(date, 'YYYY-MM-DD HH:mm');
      s = s.set({
        hour: starth,
        minute: startm,
      });
      let e = moment(date, 'YYYY-MM-DD HH:mm');
      e = e.set({
        hour: endh,
        minute: endm,
      });
      planItem = {
        scheduleId: scheduleItem.id,
        title: scheduleItem.groupName,
        allDay: false,
        start: s.toDate(),
        end: e.toDate(),
        resourceId: scheduleItem.resourceId,
        isPlanned: true,
      };
      localPlanArray.push(planItem);
    }
  }

  return localPlanArray;
}

let groups = [];
let resourceMap = [];

class Schedule extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      schedule: [],
      events: [],
      isPlanModalOpen: false,
      isAddModalOpen: false,
      isEditModalOpen: false,
      newEventData: {
        newScheduleId: null,
        newGroupId: '',
        newTitle: '',
        newStart: 0,
        newEnd: 0,
        newResourceId: 0,
        newRepeat: 1,
      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
  }

  componentDidMount() {
    resourceMap = [
      { resourceId: 1, resourceTitle: 'Аудитория 1' },
      { resourceId: 2, resourceTitle: 'Аудитория 2' },
      // { resourceId: 3, resourceTitle: 'Meeting room 1' },
      // { resourceId: 4, resourceTitle: 'Meeting room 2' },
    ];

    groups = [
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
        id: '1',
        groupId: '123',
        groupName: 'Математика ОГЭ8 - Петров И.',
        startDateTime: 1587213900,
        endDateTime: 1587219300,
        endDateRepeat: 1589760000,
        resourceId: 1,
      },
    ];

    const planArray = Array.from(schedule, createPlan);
    const eventsPlan = [].concat.apply([], planArray);

    this.setState({
      schedule,
      events: eventsPlan,
    });
  }

  handleSelect = (event) => {
    this.setState({
      newEventData: {
        newStart: event.start.getTime() / 1000,
        newEnd: event.end.getTime() / 1000,
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
      style,
    };
  };

  addEvent = () => {
    const newScheduleItem = {
      id: `${uuidv4()}`,
      groupId: this.state.newEventData.newGroupId,
      groupName: groups.find((grp) => (grp.groupId === this.state.newEventData.newGroupId)).name,
      startDateTime: this.state.newEventData.newStart,
      endDateTime: this.state.newEventData.newEnd,
      // endDateRepeat: 1589760000,
      resourceId: this.state.newEventData.newResourceId,
    };

    const schedule = this.state.schedule;
    schedule.push(newScheduleItem);

    const planArray = Array.from(schedule, createPlan);
    const eventsPlan = [].concat.apply([], planArray);

    this.setState({
      schedule,
      events: eventsPlan,
      isAddModalOpen: false,
      isEditModalOpen: false,
    });
  };

  closeModal = () => {
    this.setState({
      isAddModalOpen: false,
      isPlanModalOpen: false,
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
        let startDate = moment.unix(state.newEventData.newStart);
        startDate = startDate.set({
          hour: value.substr(0, 2),
          minute: value.substr(3, 2),
        });
        attrValue = startDate.unix();
        break;
      }

      case 'newEndTime': {
        attr = 'newEnd';
        let endDate = moment.unix(state.newEventData.newEnd);
        endDate = endDate.set({
          hour: value.substr(0, 2),
          minute: value.substr(3, 2),
        });
        attrValue = endDate.unix();
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

    return (
      <div>
        <div>
          <Calendar
            selectable
            events={this.state.events}
            localizer={localizer}
            defaultView={Views.WEEK}
            views={['day', 'week', 'agenda']}
            step={30}
            min={minTime}
            max={maxTime}
            defaultDate={new Date()}
            onSelectEvent={this.handleSelectEvent}
            onDoubleClickEvent={event => event.isPlanned = !event.isPlanned}
            onSelectSlot={this.handleSelect}
            eventPropGetter={this.eventStyleGetter}
            resources={resourceMap}
            resourceIdAccessor="resourceId"
            resourceTitleAccessor="resourceTitle"
          />
          <Modal isOpen={this.state.isAddModalOpen}>
            <ModalHeader>Расписание занятия</ModalHeader>
            <ModalBody>
              <Form>
                <Label>Группа</Label>
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
                        value={moment.unix(this.state.newEventData.newStart).format('YYYY-MM-DD') || ''}
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
                        value={moment.unix(this.state.newEventData.newStart).format('HH:mm') || ''}
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
                        value={moment.unix(this.state.newEventData.newEnd).format('HH:mm') || ''}
                        onChange={this.handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Повтор
                        <Input
                          type="select"
                          name="newRepeat"
                          id="repeat"
                          value={this.state.newEventData.newRepeat}
                          onChange={this.handleInputChange}
                        >
                          <option value="">не повторять</option>
                          <option value="1">Понедельник</option>
                          <option value="2">Вторник</option>
                          <option value="3">Среда</option>
                          <option value="4">Четверг</option>
                          <option value="5">Пятница</option>
                          <option value="6">Суббота</option>
                          <option value="0">Воскресенье</option>
                        </Input>
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
        </div>
      </div>
    );
  }
}

//Schedule.propTypes = propTypes

export default Schedule;
