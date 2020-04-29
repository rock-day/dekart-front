import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Input, Label } from 'reactstrap';

let students = [];

class Student extends React.Component {
  constructor(...props) {
    super(...props);
    this.state = {
      students,
    };
  }

  componentDidMount() {
    // console.log('props', this.props)
    // const { handle } = this.props.match.params;
    // const { studentId } = this.props.location.state;
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
        name: 'Пётр Васечкинffffffffffff Васечкинffffffffffff',
      },
      {
        id: '4',
        groups: ['123', '234'],
        name: 'Элла Памфилова',
      },
    ];

    this.setState({
      students,
    })
  }

  render() {
    const i = this.state.students.findIndex((st) => (st.id === this.props.location.state.studentId));
    const student = this.state.students[i];
    let name = '';
    if (student) {
      name = student.name
    }

    return (
      <div>
        <p>{name}</p>
      </div>
    );
  }
}

export default Student;
