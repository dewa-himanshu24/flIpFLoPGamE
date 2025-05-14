import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

export default function App() {
  const [gridData, setGridData] = useState<{ key: string; isSeen: boolean; value: number; }[]>([]);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [lockGrid, setLockGrid] = useState(false);
  const [countClick, setCountClick] = useState(0);

  function createGrid(m: number) {
    if (m % 2 !== 0)
      alert("You can only Create Grid of Even Row and Even Columns");

    let numbers = [];
    const tillNumbers = m * (m / 2);
    for (let i = 1; i <= tillNumbers; i++) {
      numbers.push(
        {
          key: uuidv4(),
          isSeen: false,
          value: i,
        },
        {
          key: uuidv4(),
          isSeen: false,
          value: i,
        }
      );
    }

    for (let i = numbers.length - 1; i >= 0; i--) {
      let j = Math.floor(Math.random() * i + 1);
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    console.log(numbers);
    return numbers;
  }

  useEffect(() => {
    setGridData(createGrid(4));
  }, []);

  function handleCheckCell(cell) {
    setCountClick((prev) => prev + 1);
    if (lockGrid || cell?.isSeen) return true;

    const copyGridData = JSON.parse(JSON.stringify(gridData));
    console.log(copyGridData);

    for (let num of copyGridData) {
      if (num?.key === cell?.key) {
        console.log(num);
        num.isSeen = true;
      }
    }
    setGridData(copyGridData);

    if (!first) {
      setFirst(cell);
    } else if (!second) {
      setSecond(cell);
      setLockGrid(true);

      if (first?.value === cell?.value) {
        setFirst(null);
        setSecond(null);
        setLockGrid(false);
      } else {
        setTimeout(() => {
          setGridData((prev) =>
            prev?.map((item) =>
              item.key === first.key || item.key === cell.key
                ? { ...item, isSeen: false }
                : item
            )
          );
          setFirst(null);
          setSecond(null);
          setLockGrid(false);
        }, 1000);
      }
    }
  }

  return (
    <div className="App">
      <div className="grid">
        {gridData &&
          Array.from({ length: 4 }, (_, row) => (
            <div key={row} className="row">
              {Array.from({ length: 4 }, (_, col) => {
                const index = row * 4 + col;
                return (
                  <div
                    key={col}
                    className="cell"
                    onClick={() => {
                      handleCheckCell(gridData[index]);
                    }}
                  >
                    {gridData[index]?.isSeen ? gridData[index].value : "?"}
                  </div>
                );
              })}
            </div>
          ))}
      </div>
      <div>{countClick}</div>
    </div>
  );
}
