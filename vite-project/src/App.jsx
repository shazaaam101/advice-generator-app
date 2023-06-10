import "./App.css";
import svgDividerDesktop from "./images/pattern-divider-desktop.svg";
import svgDividerMobile from "./images/pattern-divider-mobile.svg";
import svgDice from "./images/icon-dice.svg";
import { useEffect, useState } from "react";
function App() {
  const [data, setData] = useState({});
  const [timeSecond, setTimeSecond] = useState(0);
  let isMount = true;

  const delayRandomAdvice = () => {
    const second = setInterval(() => {
      setTimeSecond((prev) => prev - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(second);
    }, 2000);
  };

  const fetchAdvice = async () => {
    setTimeSecond(2);
    //Note: Advice is cached for 2 seconds. Any repeat-request within 2 seconds will return the same piece of advice.
    const res = await fetch("https://api.adviceslip.com/advice");
    const { slip } = await res.json();
    setData(slip);
    delayRandomAdvice();
  };

  useEffect(() => {
    if (isMount) {
      fetchAdvice();
    }
    return () => {
      isMount = false;
    };
  }, []);

  useEffect(() => {
    function handleResizeWindow() {
      const dividerImg = document.querySelector(".divider-img");
      if (window.innerWidth < 375) {
        dividerImg.src = svgDividerMobile;
      } else {
        dividerImg.src = svgDividerDesktop;
      }
    }
    window.addEventListener("resize", handleResizeWindow);
    return () => {
      window.removeEventListener("resize", handleResizeWindow);
    };
  }, []);

  return (
    <div className="App">
      <div className="container">
        <header className="id-advice">ADVICE&emsp;#{data?.id}</header>
        <p className="advice">{data?.advice}</p>
        <div className="divider">
          <img className="divider-img" src={svgDividerDesktop} alt="divider" />
        </div>
        <div className="dice">
          {timeSecond <= 0 ? (
            <button className="dice-btn" onClick={() => fetchAdvice()}>
              <img src={svgDice} alt="dice" />
            </button>
          ) : (
            <p className="time-second">{timeSecond}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
