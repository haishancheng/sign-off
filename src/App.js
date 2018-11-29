import React, { Component } from 'react';
import moment from 'moment'
import { Modal, DatePicker   } from 'antd';
import './App.css'
const confirm = Modal.confirm;
const { MonthPicker } = DatePicker

class App extends Component {

  state = {
    timeList: [],
    hasSignOff: "",
    currentDay: "",
    month: moment().format("YYYY-MM")
  }

  componentWillMount() {
    this.setState({
      timeList: JSON.parse(localStorage.getItem("timeList") || "[]" ),
      hasSignOff: localStorage.getItem("hasSignOff"),
      currentDay: localStorage.getItem("currentDay")
    })
  }

  signOff = () => {
    let {hasSignOff, currentDay} = this.state
    // if (hasSignOff === "yes" && moment().format("YYYY-MM-DD") === currentDay) {
    //   Modal.info({
    //     title: '当天已签退，如签退时间有误，请先删除！',
    //   }); 
    //   return
    // }
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
  
  delete = (index, date) => {
    if (moment().format("YYYY-MM-DD") !== date) {
      Modal.warning({
        title: '目前只能删除添加当天的时间哦~',
      })
      return
    }
    confirm({
      title: '确定删除本天签退记录？',
      iconType: 'close-circle',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        console.log(index);
        let {timeList} = this.state
        timeList.splice(index, 1)
        this.setState({timeList, hasSignOff: "no",})
        localStorage.setItem("timeList", JSON.stringify(timeList))
        localStorage.setItem("hasSignOff", "no")
      },
      onCancel() {
      },
    });
  }

  changeMonth = (dateM, date) => {
    console.log(dateM)
    console.log(date)
    this.setState({month: date})
  }

  render() {
    let {timeList, month} = this.state
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
    let timePointItem = timePoint.find((item) => {
      return moment(averageTime, "HH:mm:ss").valueOf() < moment(item.point, "HH:mm:ss").valueOf()
    })
    let averageTimeClass = timePointItem ? timePointItem.class : "normal"

    return (
      <div className="app">
        <h1>下班平均时间计算系统</h1>
        <p className={`average-time ${averageTimeClass}`}>
          平均下班时间:
          {
            averageTime === "NaN:NaN:NaN" ?
            <span style={{fontSize: "1em"}}>本月暂无统计</span> :
            <span>{averageTime}</span>
          }
        </p>
        <div className="month">
          <span className="title">选择查看月份：</span>
          <MonthPicker onChange={this.changeMonth} value={moment(month)} allowClear={false}/>
        </div>
        <ul>
          {
            timeList.map((item, index) =>
              <li key={index}>
                <h2>日期:</h2>
                <p className="date">{moment(item.time).format("YYYY-MM-DD")}</p>
                <h2>下班时间:</h2>
                <p className="time">{moment(item.time).format("HH:mm:ss")}</p>
                <span className="delete" onClick={this.delete.bind(this, index, moment(item.time).format("YYYY-MM-DD"))}></span>
              </li>
            )
          }
        </ul>
        <button onClick={this.signOff}>签退</button>
        <footer>copyright {moment().year()} SeaMountCity</footer>
      </div>
    );
  }
}

export default App;
