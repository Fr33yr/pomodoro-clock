import React,{ Fragment, useState } from 'react';
import './App.css';

function App() {

  const [displayTime, setDisplayTime] = useState(25*60);
  const [sessionTime, setSessionTime] = useState(25*60);
  const [breakTime, setBreakTime] = useState(5*60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakAudio, setBreakAudio] = useState(new Audio('./audio/breaksfx.mp3'));

  const playAudioBreakSound = () =>{
    breakAudio.currentTime = 0;
    breakAudio.play();
  }

  const formatTime = (time) =>{
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return (minutes < 10 ? "0" + minutes: minutes) + ":" + (seconds < 10 ? "0" + seconds: seconds);
  }; 

  const changeTime = (amount, type) =>{
    if(type === 'break'){
      if(breakTime <= 60 && amount < 0){
        return;
      }
      setBreakTime(prev => prev + amount)
    } else {
      if(sessionTime <= 60 && amount < 0){
        return;
      }
      setSessionTime(prev => prev + amount)
      if(!timerOn){
        setDisplayTime(sessionTime + amount);
      }
    }
  }

  const controlTime = () =>{
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBrakeVariable = onBreak;

    if(!timerOn){
      let interval = setInterval(()=>{
        date = new Date().getTime();
        if(date > nextDate){
          setDisplayTime(prev => {
              if(prev <= 0 && !onBrakeVariable){
                playAudioBreakSound();
                onBrakeVariable=true;
                setOnBreak(true);
                return breakTime;
              } else if(prev <= 0 && onBrakeVariable){
                playAudioBreakSound();
                onBrakeVariable=false;
                setOnBreak(false);
                return sessionTime;
              }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30)
      localStorage.clear();
      localStorage.setItem('interval-id', interval)
    }
    if(timerOn){
      clearInterval(localStorage.getItem('interval-id'))
    }
    setTimerOn(!timerOn);
    console.log("click");
  }

  const resetTime = () =>{
    setDisplayTime(25*60);
    setBreakTime(5*60);
    setSessionTime(25*60);
  }


  return (
    <Fragment>
      <div className="timeset-container">
        <Lenght title={"Break Lenght"} changeTime={changeTime} type={"break"} time={breakTime} formatTime={formatTime}/>
        <Lenght title={"Session Lenght"} changeTime={changeTime} type={"session"} time={sessionTime} formatTime={formatTime}/>
      </div>

      <div className="clock-container">
        <h1>Pomodoro clock</h1>
        <h2>{onBreak ? "Break" : "Session"}</h2>
        <h1>{formatTime(displayTime)}</h1>
        <div className="btns">
          <button className="start" onClick={()=>controlTime()} style={timerOn ? {background: "yellow"} : {background: "orange"}}>Play/Pause</button>
          <button className="reset" onClick={()=>resetTime()} style={{background: "lightblue"}}>Reset</button>
        </div>
      </div>
    </Fragment>
  );
}



function Lenght({title, changeTime, type, time, formatTime}){

  return(
    <Fragment>
      <div>
        <h3>{title}</h3>
        <div className="time-sets">
          <button className="up" onClick={()=> changeTime(60, type)}>Up</button>
          <h3>{formatTime(time)}</h3>
          <button className="down" onClick={()=> changeTime(-60, type)}>Down</button>
        </div>
      </div>
    </Fragment>
  );
}

export default App;
