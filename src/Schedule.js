import React from 'react'
import {Calendar, Views, momentLocalizer} from 'react-big-calendar'
import {Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Input, Label} from 'reactstrap'
//import ExampleControlSlot from '../ExampleControlSlot'
import moment from 'moment'
import 'moment/locale/ru'

//const propTypes = {}

let schedule = [
  {
    day: 1,
    start: "15:45",
    end: "17:15",
    startDate: "2020-01-26",
    endDate: "2020-03-26",
    resourceId: 1
  },
  {
    day: 3,
    start: "16:30",
    end: "18:00",
    startDate: "2020-01-26",
    endDate: "2020-03-26",
    resourceId: 1
  }
]

function createPlan(scheduleItem) {
  let localPlanArray = []
  let startTime = moment(scheduleItem.start, 'HH:mm')
  let endTime = moment(scheduleItem.end, 'HH:mm')
  for (let d = moment(scheduleItem.startDate); d.isBefore(scheduleItem.endDate); d.add(1, 'days')) {
    if (d.day() === scheduleItem.day) {
      let s = moment(d, 'YYYY-MM-DD HH:mm')
      s = s.set({
        'hour': startTime.get('hour'),
        'minute': startTime.get('minute')
      })
      let e = moment(d, 'YYYY-MM-DD HH:mm')
      e = e.set({
        'hour': endTime.get('hour'),
        'minute': endTime.get('minute')
      })
      let planItem = {
        title: 'test',
        allDay: false,
        start: s.toDate(),
        end: e.toDate(),
        resourceId: 2,
        isPlanned: true
      }
      localPlanArray.push(planItem)
    }
  }
  return localPlanArray
}

let planArray = Array.from(schedule, createPlan)
//console.log(planArray)

let eventsPlan = [].concat.apply([], planArray)
//console.log(eventsPlan)

let events = [
  {
    id: 0,
    title: 'Board meeting',
    start: new Date(2018, 0, 29, 9, 0, 0),
    end: new Date(2018, 0, 29, 13, 0, 0),
    resourceId: 1,
    isPlanned: false
  },
  {
    id: 1,
    title: 'MS training',
    allDay: true,
    start: new Date(2018, 0, 29, 14, 0, 0),
    end: new Date(2018, 0, 29, 16, 30, 0),
    resourceId: 2,
    isPlanned: true
  },
  {
    id: 2,
    title: 'Team lead meeting',
    start: new Date(2018, 0, 29, 8, 30, 0),
    end: new Date(2018, 0, 29, 12, 30, 0),
    resourceId: 3,
    isPlanned: false
  },
  {
    id: 11,
    title: 'Birthday Party',
    start: new Date(2018, 0, 30, 7, 0, 0),
    end: new Date(2018, 0, 30, 10, 30, 0),
    resourceId: 4,
    isPlanned: true
  },
]

const resourceMap = [
  { resourceId: 1, resourceTitle: 'Board room' },
  { resourceId: 2, resourceTitle: 'Training room' },
  { resourceId: 3, resourceTitle: 'Meeting room 1' },
  { resourceId: 4, resourceTitle: 'Meeting room 2' },
]

class Schedule extends React.Component {
  constructor(...args) {
    super(...args)

    this.state = {
      events: eventsPlan,
      isAddModalOpen: false,
      isEditModalOpen: false,
      newEventData: {
        newTitle: '',
        newStart: '',
        newEnd: '',
        newResourceId: '',
      },
    }
  }

  handleSelect = ({start, end, resourceId}) => {
    //const title = window.prompt('Наименование события')
    //if(title)
    this.setState({
      newEventData: {
        newStart: start,
        newEnd: end,
        newResourceId: resourceId,
      },
      isAddModalOpen: !this.state.isAddModalOpen,
    })
  }

  handleSelectEvent = (event) => {
    console.log(event.title, event.start, event.end)
  }

  eventStyleGetter = ({event, start, end, isSelected, isPlanned}) => {
    let style = {
      backgroundColor: '',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block'
    }
    if(isPlanned)
    style.backgroundColor = 'green'
    return {
      style: style
    }
  }

  addEvent = () => {
    this.setState({
      events: [
        ...this.state.events,
        {
          start: this.state.newEventData.newStart,
          end: this.state.newEventData.newEnd,
          title: this.state.newEventData.newTitle,
          resourceId: this.state.newEventData.newResourceId,
        },
      ],
      isAddModalOpen: false,
      isEditModalOpen: false,
      newEventData: null,
    })
  }

  closeModal = () => {
    this.setState({
      isAddModalOpen: false,
      isEditModalOpen: false,
      newEventData: null,
      editEventData: null
    })
  }

  changeTitleHandler = event => {
    this.setState({
      newEventData: {
        newTitle: event.target.value,
        newStart: this.state.newEventData.newStart,
        newEnd: this.state.newEventData.newEnd,
        newResourceId: this.state.newEventData.newResourceId,
      },
    })
  }

  changeEventHandler = event => {
    this.setState({
      newEventData: {
        newTitle: this.state.newEventData.newTitle,
        newStart: event.target.value,
        newEnd: this.state.newEventData.newEnd,
        newResourceId: this.state.newEventData.newResourceId,
      },
    })
  }

  render() {
    moment.locale("ru-RU")
    const localizer = momentLocalizer(moment)
    return (
      <div>
        <Calendar
          selectable
          events={this.state.events}
          localizer={localizer}
          defaultView={Views.WEEK}
          views={['day', 'work_week', 'month', 'week', 'agenda']}
          step={60}
          defaultDate={new Date()}
          onSelectEvent={this.handleSelectEvent}
          onDoubleClickEvent={event => event.isPlanned = !event.isPlanned}
          onSelectSlot={this.handleSelect}
          eventPropGetter={(this.eventStyleGetter)}
          />
        <Modal isOpen={this.state.isAddModalOpen}>
          <ModalHeader>Modal title</ModalHeader>
          <ModalBody>
            <Form>
              <Label>Title</Label>
              <Input type='text' name='Title' onChange={this.changeTitleHandler}></Input>
                <FormGroup>
                  <Label for="exampleDate">Start Date</Label>
                  <Input
                    type="date"
                    name="date"
                    id="exampleDate"

                    onChange={this.changeEventHandler}
                    />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleTime">Time</Label>
                  <Input
                    type="time"
                    name="time"
                    id="exampleTime"
                    placeholder="time placeholder"
                    />
                </FormGroup>

            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addEvent}>Добавить событие</Button>{' '}
              <Button color="secondary" onClick={this.closeModal}>Отмена</Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={this.state.isEditModalOpen}>
            <ModalHeader>Modal title</ModalHeader>
            <ModalBody>
              <Form>
                <Label>Title</Label>
                <Input type='text' name='Title'>
                </Input>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.addEvent}>Добавить событие</Button>{' '}
                <Button color="secondary" onClick={this.closeModal}>Отмена</Button>
              </ModalFooter>
            </Modal>
          </div>
        )
      }
    }

    //Schedule.propTypes = propTypes

    export default Schedule
