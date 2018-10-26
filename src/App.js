import React, { Component } from 'react';
import './App.css'
import moment from 'moment'

class App extends Component {

  state = {
    timeList: [
      {date: moment().format("YYYY.MM.DD"), time: moment().format("HH:mm:SS")},
      {date: moment().format("YYYY.MM.DD"), time: moment().format("HH:mm:SS")},
      {date: moment().format("YYYY.MM.DD"), time: moment().format("HH:mm:SS")},
      {date: moment().format("YYYY.MM.DD"), time: moment().format("HH:mm:SS")}
    ]
  }

  render() {
    let {timeList} = this.state
    return (
      <div className="app">
        <h1>下班平均时间计算系统</h1>
        <p className="average-time">平均下班时间:<span>{moment().format("HH:mm:SS")}</span></p>
        <ul>
          {
            timeList.map(item =>
              <li>
                <h2>日期:</h2>
                <p className="date">{item.date}</p>
                <h2>当天下班时间:</h2>
                <p className="time">{item.time}</p>
              </li>
            )
          }
        </ul>
        <button>签退</button>
      </div>
    );
  }
}

export default App;
