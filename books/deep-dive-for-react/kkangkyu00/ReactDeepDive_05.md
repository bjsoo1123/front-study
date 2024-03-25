# Chapter .05
리액트와 상태 관리 라이브러리

## 5.1 상태 관리는 왜 필요한가?
- - - - -
##### * tearing: 상태 변화가 일어남에 따라 즉각적으로 모든 요소들이 변경되어 애플리케이션이 찢어지는 현상.

### Flux 패턴의 등장
대규모 애플리케이션에서 데이터 흐름을 일관성 있게 관리함으로써 프로그램의 예측가능성(Predictability)을 높이기 위함

##### MVC: Modal, View, Controller

데이터가 양방향으로 흐르며, 애플리케이션의 규모가 커지고 커져서 다음과 같은 구조를 가짐

<img src="https://velog.velcdn.com/images/andy0011/post/4a1f159f-6972-4028-8a18-9a383cf5e44d/image.png" />

View가 상호작용을 위해  Model을 업데이트하고 Model 역시 View에 데이터를 전달하는 상황.

여러개의 Modal, View가 업데이트가 되며 복잡한 구조를 가짐

* flux의 기본적인 단방향 데이터의 흐름

<img src="https://velog.velcdn.com/images/andy0011/post/ac84337d-b747-4dcb-8430-7175a7c4f1d8/image.png" />

### action
어떠한 작업을 처리할 때 dispatcher로 전달되는 데이터

### dispatcher
콜백 형태로 action에서 정의한 타입과 테이터를 store로 보내는 역할

### store
상태 저장소로서 상태와 상태를 변경할 수 있는 메서드를 가짐

### view
데이터를 가져와 화면을 렌더링하는 역할, 새로운 데이터를 받은 View는 화면을 리렌더함

사용자가 View에 어떠한 조작을 하면 그에 해당하는 Action 생성

<img src="https://velog.velcdn.com/images/andy0011/post/6044ce69-7c76-4266-b95e-c8eea01e4f6e/image.png" />

## 시장 지배자 리덕스의 등장

최초에는 flux 구조를 구현하기 위한 라이브러리, 여기에 elm 아키텍쳐를 도입

#### elm : 웹페이지를 선행언적으로 작성하기 위한 언어

### 리덕스 동작원리

하나의 객체를 store에 저장하고 이 객체를 업데이트하는 작업을 디스패치해 업데이트를 수행

이 작업은 reducer   함수로 발생가능, 이는 웹 애플리케이션에 대한 새로운 복사본을 반환

애플리케이션은 이 상태를 전파 

### context API와 useContext

props를 가지고 있는 부모에서 이를 필요한 자식까지 전달하는 불편함

### ReactQuery와 SWR

두 라이브러리는 외부의 데이터를 불러오는 fetch에 특화되있지만, API호출에 대한 상태관리하고 있기 때문에 HTTP 요청에 특화된 상태 관리 라이브러리임

SWR는 fetch와 상용방식은 비슷

### Recoil, Zustand, Jotai, Valtio에 이르기까지

reactQuery와 SWR가 http 요청이 특화된 라이브러리인 것과 달리, 이는 훅과의 호환성이 높고, 상태를 가져와 관리하 수 있는 라이브러리

## 5.2 리액트 훅으로 시작하는 상태 관리
useState, useReducer

### useState의 상태를 바깥으로 분리하기

```tsx
export type store = { counter: number };
type Initializer<T> = T extends any ? T | ((prev: T) => T): never;
type Store<State> = {
  ge: () => State;	  
  set: (action: Initializer<State>) => State;	  
  subscribe: (callback: () => void) => void; 
}

const createStore = <State extends unknown>(initialState: Initializer<State>): State<State> => {	  
  let state = typeof initialState !== 'function' ? initialState : initialState();
		  
  const callBacks = new Set<() => void>();

  const get = () => state;	  
  const set = (nextState: State | ((prev: State) => State)) => {	    
    state = typeof nextState === 'function' ? (nextState as (prev: State) => State)(state) : nextState
	
    callBacks.forEach((callback) => callback());
	
    return state;
  };
	
  const subscribe = (callback: () => void) => {	    
    callBacks.add(callback);
		
    return () => {
      callBack.delete(callback)
    }
  };
  return { get, set, subscribe };
}
```

```tsx
const useStore = <State extends unknown>(store: Store<State>) => {
  const [state, setState] = useState<State>(() => store.get());
	
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.get())
    })
    return unsubscribe
  }, [store])
	
  return [state, store.set] as const
}

const store = createStore({ count: 0 });

const Counter1 = () => {
  const [state, setState] = useStore(store);
  const handleClcik = () => {	    
    setState((prev) => ({ count: prev.count + 1 }))
  }
	
  return (
    <>
      <h3>Counter 1: {state.count}</h3>
      <button onClick={handleClcik}>+</button>
    </>
  );
}

const Counter2 = () => {
  const [state, setState] = useStore(store);	  
  const handleClcik = () => {
    setState((prev) => ({ count: prev.count + 1 }))
  }
	
  return (
    <>
      <h3>Counter 2: {state.count}</h3>
      <button onClick={handleClcik}>+</button>
    </>
  );
}
```

1 훅을 인수로 사용할 store를 받음

2 스토어의 값을 초기값으하는 sueState 만듬, useState가 컴포넌트 렌더링 유도

3 useEffect는 store 현재값을 가져와 setState를 수행하는 함수 store의 subscribe로 등록함 <br />
useStore 내부에서는 store의 값이 변경될 때마다 state의 값이 변경되는 것을 보장 받음

4 useEffect의 동작이 끝난 이후 callback에서 해당 함수를 제거하여 callback이 계속 쌓이는 걸 방지

### useState와 Context를 동시에 사용해 보자
하나의 스토어만 가지게되는 구조로 전역변수처럼 동작하기 때문에 여러개의 스토어를 가질수 없다 <br />
context를 활용하여 해당 스토어를 하위 컴포넌트에 주입하면, 자신이 주입된 스토어에 대해만 접근 가능 <br />
context에서 내려주는 값을 사용하기 위해서는 useContext같은 스토어 접근 가능한 훅이 필요

```tsx
const CounterStoreContext = createContext<Store<CounterStore>>(
  createStore<CounterStore>({ count: 0, text: 'hello' })
);

const useCounterContextSelector = <State extends unknown>(
  selector: (state: CounterStore) => State
) => {
  const store = useContext(CounterStoreContext);	  
  const subscription = useSubscription(
    useMemo(
      () => ({
        getCurrentValue: () => selector(store.get()),
        subscribe: store.subscribe
      }),
      [store, selector]
    )
  )	  
  return [subscription, store.set] as const;
}
```

```tsx
type PropsWithChildren<Y> = {
  initalState: T;
  children: JSX.Element;
}

const CounterStoreProvider = ({ initalState, children }: PropsWithChildren<{initalState: CounterStore}>) => {
  const storeRef = useRef<Store<CounterStore>>()
		  
  if (!storeRef.current) {	    
    storeRef.current = createStore(initalState)
  }
	
  return (	    
    <CounterStoreContext.Provider value={storeRef.current}>
      {children}
    </CounterStoreContext.Provider>
  );
}
```

```tsx
export default function App() {
  return (	    
    <div>
      <ContextCounter />
      <ContextInput />
      
      <CounterStoreProvider initalState={{ count: 10, text: 'hello' }}>
        <ContextCounter />
        <ContextInput />
				
        <CounterStoreProvider initalState={{ count: 100, text: 'bye' }}>
          <ContextCounter />
          <ContextInput />
        </CounterStoreProvider>
      </CounterStoreProvider>
    </div>
  );
}
```

최상단의 <ContextCounter />와 <ContextInput />은 Provider가 존재하지 않아도 초기값을 가져옴 <br />
**즉, Provider가 없는 상황에서는 전역으로 생성된 스토어를 바라보게 됨** <br />
두 번째와 세번째의 ContextCounter와 ContextInput의 **Context는 가장 가까운 Provider를 참조하여 각자 다른 값을 가짐** <br />
이렇게 Context와 Provider를 기반으로 각 store 값을 격리해서 관리할 수 있음.


### 5.2.4 Recoil, Jotai, Zustand 살펴보기

### Recoil

#### RecoilRoot
```tsx
import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <CharacterCounter />
    </RecoilRoot>
  );
}
```
atom
```tsx
type statement = {
  name: string;
  amount: number;
}

const InitialStatements: Array<Statement> = [
  { name: 'A', amount: 1 },
  { name: 'B', amount: 2 },
  { name: 'C', amount: 3 }
];

const statementsAtom = atom<Array<Statement>>({
  key: 'statements',
  default: InitialStatements
})
```

#### useRecoilValue
atom의 값을 읽어오는 훅
```tsx
const Statements = () => {
  const statements = useRecoilValue(statementsAtom);
  return;
};
```
### useRecoilState
useState와 비슷하게 atom의 값을 가져와 변경이 가능한 훅

### 간단한 사용법
```tsx
const counterState = atom({
  key: 'counterState',
  default: 0
});

const Counter = () => {
  const [, setCount] = useRecoilState(counterState);
  
  const handleButtonClick = () => {
    setCount((count) => count + 1);
  };
  
  return (
    <button onClick={handleButtonClick}>+</button>
  );
}

// atom을 기반으로 다른 상태도 만들 수 있음
const isBiggerThen10 = selector({
  key: 'abov10State',
  get: ({ get }) => {
    return get(counterState) >= 10
  }
});

const Counter2 = () => {
  const count = useRecoilValue(counterState);
  const biggerThan10 = useRecoilValue(isBiggerThen10);

  return (
    <>
      <h3>{count}</h3>
      <p>count is bigger than 10: {JSON.stringify(biggerThan10)}</p>
    </>
  );
};
```

#### 정리
redux-saga, redux-thunk 같은 미들웨어 없이도 비동기 작업 가능


### Jotai

### 간단한 사용법
```tsx
import { atom, uesAtom, useAtomValue } from 'jotai';
const counterState = atom(0);

const Counter = () => {
  const [, setCount] = useAtom(counterState);
  
  const handleButtonClick = () => {
    setCount((count) => count + 1);
  };
  
  return (
    <button onClick={handleButtonClick}>+</button>
  );
}

const isBiggerThen10 = atom((get) => get(counterState) > 10);

const Counter2 = () => {
  const count = useAtomValue(counterState);
  const biggerThan10 = useAtomValue(isBiggerThen10);

  return (
    <>
      <h3>{count}</h3>
      <p>count is bigger than 10: {JSON.stringify(biggerThan10)}</p>
    </>
  );
};
```

### Zustand

### 간단한 사용법
```tsx
import { createStore, useStore } from 'zustand';

const counterStore = createStore((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 }))
}));

const Counter = () => {
  const { count, inc, dec } = useStore(counterStore);
  
  const handleButtonClick = () => {
    setCount((count) => count + 1);
  };
  
  return (
    <>
      <span>{count}</span>
      <button onClick={inc}>+</button>
      <button onClick={dec}>_</button>
    </>
  );
}
```