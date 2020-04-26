import React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import 'moment/locale/ru';
import ModalScheduleAdd from './ModalScheduleAdd'
import ModalScheduleEdit from './ModalScheduleEdit';
import ModalLesson from './ModalLesson';

let groups = [];
let students = [];
let resourceMap = [];
let lessons = [];

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
  const lessonsDates = scheduleItem.lessons.map((lesson) => lessons.find((lsn) => (lsn.id === lesson)).start.getTime() / 1000);

  for (let date = startDateTime.clone();
    date.isSameOrBefore(endDateRepeat);
    date.add(7, 'days')) {
    if (
    scheduleItem.exclude.indexOf(date.unix()) === -1
    && lessonsDates.indexOf(date.unix()) === -1) {
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
        groupId: scheduleItem.groupId,
        title: groups.find((grp) => (grp.groupId === scheduleItem.groupId)).name,
        allDay: false,
        start: s.toDate(),
        end: e.toDate(),
        resourceId: scheduleItem.resourceId,
        repeat: moment.unix(scheduleItem.endDateRepeat).toDate(),
        status: 0,
      };
      localPlanArray.push(planItem);
    }
  }

  return localPlanArray;
}

class Schedule extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = {
      schedule: [],
      events: [],
      lessons: [],
      isAddModalOpen: false,
      isEditModalOpen: false,
      isLessonModalOpen: false,
      newEventData: {
        newScheduleId: '',
        newGroupId: '',
        newTitle: '',
        newStart: 0,
        newEnd: 0,
        newResourceId: 0,
        newRepeat: 0,

      },
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.deleteScheduleItem = this.deleteScheduleItem.bind(this);
    this.excludeScheduleEvent = this.excludeScheduleEvent.bind(this);
    this.updateEvents = this.updateEvents.bind(this);
  }

  updateEvents(schedule, lessons) {
    const planArray = Array.from(schedule, createPlan);
    const eventsPlan = [].concat.apply([], planArray);
    const events = eventsPlan.concat(lessons);

    this.setState({
      schedule,
      lessons,
      events,
    });
  }

  componentDidMount() {
    resourceMap = [
      { resourceId: 1, resourceTitle: 'Аудитория 1' },
      { resourceId: 2, resourceTitle: 'Аудитория 2' },
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
        name: 'Пётр Васечкин',
      },
      {
        id: '4',
        groups: ['123', '234'],
        name: 'Элла Памфилова',
      },
    ];

    const schedule = [
      {
        id: '1',
        groupId: '123',
        startDateTime: 1587213900,
        endDateTime: 1587219300,
        endDateRepeat: 1589760000,
        resourceId: 1,
        exclude: [],
        lessons: ['1', '2'],
      },
    ];

    lessons = [
      {
        id: '1',
        scheduleId: '1',
        groupId: '234',
        title: groups.find((grp) => (grp.groupId === '234')).name,
        allDay: false,
        start: new Date(2020, 3, 23, 10),
        end: new Date(2020, 3, 23, 12),
        resourceId: 1,
        repeat: '',
        status: 1,
      },
      {
        id: '2',
        scheduleId: '1',
        groupId: '123',
        title: groups.find((grp) => (grp.groupId === '123')).name,
        allDay: false,
        start: new Date(1587213900000),
        end: new Date(1587219300000),
        resourceId: 1,
        repeat: '',
        status: 1,
      },
    ];

    this.updateEvents(schedule, lessons);
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
    if (event.status === 0) {
      const scheduleItem = this.state.schedule.find((schd) => (schd.id === event.scheduleId));
      this.setState({
        newEventData: {
          newScheduleId: scheduleItem.id,
          newGroupId: scheduleItem.groupId,
          newStart: scheduleItem.startDateTime,
          newEnd: scheduleItem.endDateTime,
          newRepeat: scheduleItem.endDateRepeat,
          newResourceId: scheduleItem.resourceId,
          eventStart: event.start.getTime() / 1000,
          eventEnd: event.end.getTime() / 1000,
          exclude: scheduleItem.exclude,
          lessons: scheduleItem.lessons,
          status: scheduleItem.status,
        },
        isEditModalOpen: true,
      });
    } else if (event.status === 1) {
      const lesson = this.state.lessons.find((lsn) => (lsn.id === event.id));
      this.setState({
        newEventData: {
          id: lesson.id,
          newScheduleId: lesson.scheduleId,
          newGroupId: lesson.groupId,
          newResourceId: lesson.resourceId,
          newStart: event.start.getTime() / 1000,
          newEnd: event.end.getTime() / 1000,
        },
        isLessonModalOpen: true,

        // id: `${uuidv4()}`,
        // scheduleId: scheduleItem.id,
        // groupId: this.state.newEventData.newGroupId,
        // title: groups.find((grp) => (grp.groupId === this.state.newEventData.newGroupId)).name,
        // allDay: false,
        // start: new Date(this.state.newEventData.eventStart * 1000),
        // end: new Date(this.state.newEventData.eventEnd * 1000),
        // resourceId: 1,
        // repeat: '',
        // status: 1,
      });
    }
  };

  eventStyleGetter = ({ event, start, end, isSelected, status }) => {
    let style = {
      backgroundColor: '',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block',
    };

    switch (status) {
      case 0:
        style.backgroundColor = 'grey';
        break;
      case 1:
        style.backgroundColor = 'blue';
        break;
      default:

    };

    return {
      style,
    };
  };

  addEvent = () => {
    if (!this.state.newEventData.newGroupId) {
      alert('Нужно обязательно указать группу');
      return;
    }

    const newScheduleItem = {
      id: `${uuidv4()}`,
      groupId: this.state.newEventData.newGroupId,
      groupName: groups.find((grp) => (grp.groupId === this.state.newEventData.newGroupId)).name,
      startDateTime: this.state.newEventData.newStart,
      endDateTime: this.state.newEventData.newEnd,
      endDateRepeat: this.state.newEventData.newRepeat,
      resourceId: this.state.newEventData.newResourceId,
      exclude: [],
      lessons: [],
    };

    let schedule = this.state.schedule;
    schedule.push(newScheduleItem);

    this.updateEvents(schedule, lessons);

    this.setState({
      isAddModalOpen: false,
      // newEventData: '',
    });
  };

  editEvent = () => {
    if (!this.state.newEventData.newGroupId) {
      alert('Нужно обязательно указать группу');
      return;
    }

    const newScheduleItem = {
      id: this.state.newEventData.newScheduleId,
      groupId: this.state.newEventData.newGroupId,
      groupName: groups.find((grp) => (grp.groupId === this.state.newEventData.newGroupId)).name,
      startDateTime: this.state.newEventData.newStart,
      endDateTime: this.state.newEventData.newEnd,
      endDateRepeat: this.state.newEventData.newRepeat,
      resourceId: this.state.newEventData.newResourceId,
      exclude: this.state.newEventData.exclude,
      lessons: this.state.newEventData.lessons,
    };

    const schedule = this.state.schedule;
    const lessons = this.state.lessons;
    const i = schedule.findIndex((schd) => (schd.id === this.state.newEventData.newScheduleId));
    schedule[i] = newScheduleItem;

    this.updateEvents(schedule, lessons);

    this.setState({
      isEditModalOpen: false,
      // newEventData: '',
    });
  };

  editLesson = () => {
    const schedule = this.state.schedule;
    // const conductDate = moment.unix(this.state.newEventData.eventStart);
    const lessons = this.state.lessons;
    const i = lessons.findIndex((lsn) => (lsn.id === this.state.newEventData.id));
    const oldLesson = lessons[i];

    const newLesson = {
      ...oldLesson,
      start: new Date(this.state.newEventData.newStart * 1000),
      end: new Date(this.state.newEventData.newEnd * 1000),
    };

    lessons[i] = newLesson;

    this.updateEvents(schedule, lessons);

    this.setState({
      isLessonModalOpen: false,
    });
  };

  closeModal = () => {
    this.setState({
      isAddModalOpen: false,
      isEditModalOpen: false,
      isLessonModalOpen: false,
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
      case 'newStartDate': {
        attr = 'newStart';
        let startDate = moment.unix(state.newEventData.newStart);
        startDate = startDate.set({
          year: value.substr(0, 4),
          month: value.substr(5, 2) - 1,
          date: value.substr(8, 2),
        });
        attrValue = startDate.unix();
        break;
      }

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

      case 'newRepeatDate': {
        attr = 'newRepeat';
        attrValue = moment(value).unix();
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

  deleteScheduleItem() {
    const schedule = this.state.schedule;
    const i = schedule.findIndex((schd) => (schd.id === this.state.newEventData.newScheduleId));
    schedule.splice(i, 1);

    const planArray = Array.from(schedule, createPlan);
    const eventsPlan = [].concat.apply([], planArray);

    this.setState({
      schedule,
      events: eventsPlan,
      isEditModalOpen: false,
    });
  }

  excludeScheduleEvent() {
    const excludeDate = moment.unix(this.state.newEventData.eventStart);
    const schedule = this.state.schedule;
    const lessons = this.state.lessons;
    const i = schedule.findIndex((schd) => (schd.id === this.state.newEventData.newScheduleId));
    const scheduleItem = schedule[i];
    const newExclude = scheduleItem.exclude;
    newExclude.push(excludeDate.unix());
    schedule[i].exclude = newExclude;

    this.updateEvents(schedule, lessons);

    this.setState({
      isEditModalOpen: false,
    });
  }

  conductLesson = () => {
    // const conductDate = moment.unix(this.state.newEventData.eventStart);
    const schedule = this.state.schedule;
    const lessons = this.state.lessons;
    const i = schedule.findIndex((schd) => (schd.id === this.state.newEventData.newScheduleId));
    const scheduleItem = schedule[i];
    // const scheduleLessons = scheduleItem.lessons;

    const newLesson = {
      id: `${uuidv4()}`,
      scheduleId: scheduleItem.id,
      groupId: this.state.newEventData.newGroupId,
      title: groups.find((grp) => (grp.groupId === this.state.newEventData.newGroupId)).name,
      allDay: false,
      start: new Date(this.state.newEventData.eventStart * 1000),
      end: new Date(this.state.newEventData.eventEnd * 1000),
      resourceId: 1,
      repeat: '',
      status: 1,
    };

    lessons.push(newLesson);
    schedule[i].lessons.push(newLesson.id);

    const planArray = Array.from(schedule, createPlan);
    const eventsPlan = [].concat.apply([], planArray);
    const events = eventsPlan.concat(lessons);

    this.setState({
      newEventData: {
        id: newLesson.id,
        newScheduleId: newLesson.scheduleId,
        newGroupId: newLesson.groupId,
        newResourceId: newLesson.resourceId,
        newStart: newLesson.start.getTime() / 1000,
        newEnd: newLesson.end.getTime() / 1000,
      },
      schedule,
      lessons,
      events,
      isEditModalOpen: false,
      isLessonModalOpen: true,
    });
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
            // onDoubleClickEvent={event => event.isPlanned = !event.isPlanned}
            onSelectSlot={this.handleSelect}
            eventPropGetter={this.eventStyleGetter}
            resources={resourceMap}
            resourceIdAccessor="resourceId"
            resourceTitleAccessor="resourceTitle"
          />
          <ModalScheduleAdd
            isAddModalOpen={this.state.isAddModalOpen}
            handleGroupChange={this.handleGroupChange}
            scheduleItemData={this.state.newEventData}
            selectGroupOptions={groupOptions}
            handleInputChange={this.handleInputChange}
            addEvent={this.addEvent}
            closeModal={this.closeModal}
          />
          <ModalScheduleEdit
            isOpen={this.state.isEditModalOpen}
            handleGroupChange={this.handleGroupChange}
            scheduleItemData={this.state.newEventData}
            selectGroupOptions={groupOptions}
            students={students.filter((student) =>
              (student.groups.indexOf(this.state.newEventData.newGroupId) !== -1))}
            handleInputChange={this.handleInputChange}
            editEvent={this.editEvent}
            conductLesson={this.conductLesson}
            deleteScheduleItem={this.deleteScheduleItem}
            excludeScheduleEvent={this.excludeScheduleEvent}
            closeModal={this.closeModal}
          />
          <ModalLesson
            isOpen={this.state.isLessonModalOpen}
            lessonData={this.state.newEventData}
            group={groups.find((grp) =>
              (grp.groupId === this.state.newEventData.newGroupId))}
            students={students.filter((student) =>
              (student.groups.indexOf(this.state.newEventData.newGroupId) !== -1))}
            handleInputChange={this.handleInputChange}
            editLesson={this.editLesson}
            // conductLesson={this.conductLesson}
            // deleteScheduleItem={this.deleteScheduleItem}
            // excludeScheduleEvent={this.excludeScheduleEvent}
            closeModal={this.closeModal}
          />
        </div>
      </div>
    );
  }
}

//Schedule.propTypes = propTypes

export default Schedule;
