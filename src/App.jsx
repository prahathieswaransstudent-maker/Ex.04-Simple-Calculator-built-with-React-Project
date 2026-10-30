import { useMemo, useState } from 'react';
import './App.css';

const buttonLayout = [
  ['C', 'DEL', '%', '/'],
  ['7', '8', '9', '*'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

function App() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');

  const isOperator = (value) => ['+', '-', '*', '/', '%'].includes(value);

  const appendValue = (value) => {
    if (value === 'C') {
      setExpression('');
      setResult('0');
      return;
    }

    if (value === 'DEL') {
      const nextExpression = expression.slice(0, -1);
      setExpression(nextExpression);
      setResult(nextExpression ? '0' : '0');
      return;
    }

    if (value === '=') {
      if (!expression) return;
      try {
        const sanitized = expression.replace(/÷/g, '/').replace(/×/g, '*');
        if (!/^[0-9+\-*/.()%\s]+$/.test(sanitized)) {
          setResult('Error');
          return;
        }

        const evaluated = new Function(`"use strict"; return (${sanitized});`)();
        setExpression(String(evaluated));
        setResult(String(evaluated));
      } catch {
        setExpression('');
        setResult('Error');
      }
      return;
    }

    if (isOperator(value)) {
      if (!expression) {
        if (value === '-') {
          setExpression('-');
        }
        return;
      }

      const lastChar = expression.slice(-1);
      if (isOperator(lastChar)) {
        setExpression(expression.slice(0, -1) + value);
        return;
      }

      setExpression(expression + value);
      return;
    }

    if (value === '.') {
      const lastNumber = expression.split(/[+\-*/%]/).pop();
      if (lastNumber?.includes('.')) {
        return;
      }
    }

    if (value === '0' && expression === '0') {
      return;
    }

    const nextExpression = expression + value;
    setExpression(nextExpression);
    setResult(nextExpression);
  };

  const displayValue = useMemo(() => {
    if (expression) return expression;
    return result || '0';
  }, [expression, result]);

  return (
    <main className="calculator-app">
      <section className="calculator" aria-label="Simple calculator">
        <div className="display-panel">
          <div className="expression">{displayValue}</div>
          <div className="result">{result}</div>
        </div>

        <div className="keypad">
          {buttonLayout.flat().map((key) => (
            <button
              key={key}
              type="button"
              className={`key ${key === '=' ? 'equals' : ''} ${isOperator(key) ? 'operator' : ''}`}
              onClick={() => appendValue(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
