---
title: "React 시작하기 - 완전 초보자 가이드"
description: "React의 기본 개념부터 첫 번째 컴포넌트 만들기까지, 단계별로 배우는 React 입문 가이드"
category: "React"
difficulty: "Beginner"
duration: 45
tags: ["react", "javascript", "frontend", "components", "jsx"]
---

# React 시작하기 - 완전 초보자 가이드

React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리입니다. Facebook에서 개발했으며, 현재 가장 인기 있는 프론트엔드 프레임워크 중 하나입니다.

## 🎯 학습 목표

이 튜토리얼을 완료하면 다음을 할 수 있게 됩니다:
- React의 기본 개념 이해
- JSX 문법 사용
- 컴포넌트 생성 및 사용
- Props와 State 활용
- 이벤트 핸들링

## 📋 사전 요구사항

- HTML, CSS, JavaScript 기본 지식
- Node.js 설치 (최신 LTS 버전 권장)
- 코드 에디터 (VS Code 권장)

## 🚀 React란 무엇인가?

React는 **컴포넌트 기반**의 라이브러리입니다. 복잡한 UI를 작은 컴포넌트들로 나누어 관리할 수 있게 해줍니다.

### React의 주요 특징

1. **컴포넌트 기반**: 재사용 가능한 UI 조각들
2. **Virtual DOM**: 효율적인 렌더링
3. **단방향 데이터 흐름**: 예측 가능한 상태 관리
4. **JSX**: JavaScript 안에서 HTML 작성

## 🛠️ 개발 환경 설정

### 1. Create React App으로 프로젝트 생성

```bash
npx create-react-app my-first-react-app
cd my-first-react-app
npm start
```

### 2. 프로젝트 구조 이해

```
my-first-react-app/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── App.js
│   ├── index.js
│   └── ...
└── package.json
```

## 📝 첫 번째 컴포넌트 만들기

### 함수형 컴포넌트

```jsx
// src/components/Welcome.js
import React from 'react';

function Welcome(props) {
  return <h1>안녕하세요, {props.name}님!</h1>;
}

export default Welcome;
```

### 컴포넌트 사용하기

```jsx
// src/App.js
import React from 'react';
import Welcome from './components/Welcome';

function App() {
  return (
    <div className="App">
      <Welcome name="리액트 초보자" />
      <Welcome name="개발자" />
    </div>
  );
}

export default App;
```

## 🎨 JSX 문법 이해하기

JSX는 JavaScript XML의 줄임말로, JavaScript 안에서 HTML과 유사한 문법을 사용할 수 있게 해줍니다.

### JSX 규칙

1. **하나의 부모 요소**: 여러 요소는 하나의 부모로 감싸야 함
2. **className 사용**: `class` 대신 `className` 사용
3. **camelCase 속성**: `onClick`, `onChange` 등
4. **자체 닫는 태그**: `<img />`, `<br />` 등

```jsx
function MyComponent() {
  return (
    <div className="container">
      <h1>제목</h1>
      <img src="image.jpg" alt="설명" />
      <button onClick={handleClick}>클릭하세요</button>
    </div>
  );
}
```

## 📦 Props 사용하기

Props는 컴포넌트에 데이터를 전달하는 방법입니다.

```jsx
// 부모 컴포넌트
function App() {
  return (
    <div>
      <UserCard 
        name="김개발" 
        age={25} 
        job="프론트엔드 개발자" 
      />
    </div>
  );
}

// 자식 컴포넌트
function UserCard({ name, age, job }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>나이: {age}세</p>
      <p>직업: {job}</p>
    </div>
  );
}
```

## 🔄 State 사용하기

State는 컴포넌트의 상태를 관리하는 방법입니다.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <h2>카운터: {count}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
    </div>
  );
}
```

## 🎯 실습 프로젝트: 할 일 목록 만들기

간단한 Todo 앱을 만들어보겠습니다.

```jsx
import React, { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-app">
      <h1>할 일 목록</h1>
      
      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="할 일을 입력하세요"
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>추가</button>
      </div>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo.id)}>
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
```

## 🎨 스타일링 추가하기

```css
/* src/TodoApp.css */
.todo-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.input-section {
  display: flex;
  margin-bottom: 20px;
}

.input-section input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
}

.input-section button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #eee;
  margin-bottom: 5px;
  border-radius: 4px;
}

.todo-list li.completed span {
  text-decoration: line-through;
  color: #888;
}

.todo-list button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}
```

## 🔍 다음 단계

이 튜토리얼을 완료했다면, 다음 주제들을 학습해보세요:

1. **React Hooks**: useEffect, useContext, useMemo 등
2. **컴포넌트 라이프사이클**: 컴포넌트의 생명주기 이해
3. **상태 관리**: Context API, Redux 등
4. **라우팅**: React Router로 페이지 네비게이션
5. **API 연동**: fetch, axios를 이용한 데이터 통신
6. **테스팅**: Jest, React Testing Library

## 📚 추가 학습 자료

- [React 공식 문서](https://reactjs.org/)
- [React 한국어 문서](https://ko.reactjs.org/)
- [Create React App 문서](https://create-react-app.dev/)
- [MDN JavaScript 가이드](https://developer.mozilla.org/ko/docs/Web/JavaScript)

## 💡 팁과 베스트 프랙티스

1. **컴포넌트는 작고 재사용 가능하게** 만드세요
2. **Props는 읽기 전용**입니다 - 직접 수정하지 마세요
3. **State 업데이트는 비동기**입니다
4. **Key prop**을 리스트 아이템에 항상 제공하세요
5. **개발자 도구**를 활용하여 디버깅하세요

---

🎉 **축하합니다!** React의 기본기를 모두 익혔습니다. 이제 더 복잡한 애플리케이션을 만들어보세요!