import React, { Component } from 'react';
import './App.css'
import moment from 'moment'
import { Modal } from 'antd';
const confirm = Modal.confirm;

class App extends Component {

  state = {
    timeList: [],
    hasSignOff: "",
    currentDay: ""
  }

  signOff = () => {
    let {hasSignOff, currentDay} = this.state
    if (hasSignOff === "yes" && moment().format("YYYY-MM-DD") === currentDay) {alert("当天已签退，如签退时间有误，请先删除！"); return}
    this.setState((prevState) => {
      let newTimeList = [...prevState.timeList, {time: moment().format('YYYY-MM-DD HH:mm:ss')}]
      localStorage.setItem("timeList", JSON.stringify(newTimeList))
      localStorage.setItem("hasSignOff", "yes")
      localStorage.setItem("currentDay", moment().format("YYYY-MM-DD"))
      return {
        timeList: newTimeList,
        hasSignOff: "yes",
        currentDay: moment().format("YYYY-MM-DD")
      }
    })
  }
  
  delete = () => {
    confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  componentWillMount() {
    this.setState({
      timeList: JSON.parse(localStorage.getItem("timeList")) || [],
      hasSignOff: localStorage.getItem("hasSignOff"),
      currentDay: localStorage.getItem("currentDay")
    })
  }

  render() {
    let {timeList} = this.state
    console.log('timeList', timeList)
    let totalHour = 0, totalMin = 0, totalSec = 0
    timeList.forEach((item) => {
      let arr = moment(item.time).format("HH:mm:ss").split(":")
      totalHour += parseInt(arr[0], 10)
      totalMin += parseInt(arr[1], 10)
      totalSec += parseInt(arr[2], 10)
    })
    let averageTime = Math.floor(totalHour / timeList.length) + ":" + Math.floor(totalMin / timeList.length) + ":" + Math.floor(totalSec / timeList.length)
    let timePoint = [
                      {point: "20:00:00", class: "warning"},
                      {point: "21:00:00", class: "normal"},
                      {point: "22:00:00", class: "excellent"},
                      {point: "23:00:00", class: "amazing"},
                      {point: "24:00:00", class: "dying"},
                    ]
    let averageTimeClass = timePoint.find((item) => {
      return moment(averageTime, "HH:mm:ss").valueOf() < moment(item.point, "HH:mm:ss").valueOf()
    }).class

    return (
      <div className="app">
        <h1>下班平均时间计算系统</h1>
        <p className={`average-time ${averageTimeClass}`}>平均下班时间:<span>{averageTime === "NaN:NaN:NaN" ? "本月暂无统计" : averageTime}</span></p>
        <ul>
          {
            timeList.map((item, index) =>
              <li key={index}>
                <h2>日期:</h2>
                <p className="date">{moment(item.time).format("YYYY-MM-DD")}</p>
                <h2>下班时间:</h2>
                <p className="time">{moment(item.time).format("HH:mm:ss")}</p>
                <span className="delete" onClick={this.delete}></span>
              </li>
            )
          }
        </ul>
        <button onClick={this.signOff}>签退</button>
      </div>
    );
  }
}

export default App;
