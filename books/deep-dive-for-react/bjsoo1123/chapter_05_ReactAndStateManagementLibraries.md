# Chapter.5 React and State Management Libraries

### 상태 관리의 필요성

- 상태란?

  - 어떠한 의미를 지닌 값.
  - 애플리케이션의 시나리오에 따라 지속적으로 변경될 수 있는 값.

- 웹 애플리케이션의 상태값

  - UI 상태값: 다크/라이트 모드, 각종 input, 알림창 노출 여부 등
  - URL: 브라우저에서 관리되고 있는 상태값. (query string 등)
  - Form: loading, submit, disabled, validation 등
  - Server: API 요청 등

- 관리해야할 상태의 증가
  - 전역 변수로 둘 것? vs 별도의 클로저를 만들 것?
  - 그 상태가 유효한 범위는?
  - 상태의 변화에 따라 변경돼야 하는 자식 요소들은 어떻게 변화를 감지할 것?
  - 상태 변화가 일어남으로 즉각적으로 모든 요소들이 변경되어 애플리케이션이 찢어지는 `Tearing` 현상을 어떻게 방지할 것?

## React 상태 관리의 역사

- Reducer: 줄이기 위해 고쳐나간다. (reducer(preValue) => newValue)

- 애플리케이션이 비대해짐 & 상태(데이터)도 많아짐 & 어디서 어떤 일이 발생하는지 추적 및 이해가 어려움.  
  => 해당 문제의 원인을 "양방향 데이터 바인딩"으로 생각.

- [Flux 패턴](https://haruair.github.io/flux/docs/overview.html)의 등장

  - Action: 작업을 처리할 액션 & 액션 발생 시 함께 포함시킬 데이터  
    => 액션 타입과 데이터를 정의해 dispatcher로 전송

  - Dispatcher: 콜백 함수 형태로 action이 정의한 Type과 Data를 Store로 전송

  - Store: 실제 상태 & 상태를 변경할 수 있는 메서드. 타입에 따라 어떻게 변경할지 정의

  - View: Store에서 만들어진 Data를 가져와 화면을 렌더링  
    => View에서 Action을 호출하여 위와 같은 프로세스가 동일하게 동작 가능.

  - But,
    - 사용자의 액션에 따라 데이터를 갱신하고 화면을 어떻게 업데이트해야 하는지 코드 작성 필요.

- Redux의 등장

  - Flux 구조 + [Elm 아키텍처](https://kyunooh.gitbooks.io/elm/content/architecture/)

    - Model: 애플리케이션의 상태
    - View: Model을 표현하는 HTML
    - Update: Model을 수정하는 방식

  - Elm은 Flux와 동일하게 데이터 흐름을 세 가지로 분류 & 단방향으로 강제하여 상태를 안정적으로 관리하고자 노력.

  - 리덕스는...

    - 하나의 상태 객체를 Store에 저장.
    - Update 작업을 Dispatch(어떤 메서드를 호출할 것인지를 결정하여, 그것을 실행)하여 수행.
    - 이러한 작업은 Reducer 함수로 발생.
    - 이 함수의 실행은 웹 애플리케이션 상태에 대한 완전히 새로운 복사본을 반환 & 애플리케이션에 해당 상태를 전파

  - 이러한 작업으로 인해...

    - 글로벌 상태 객체를 통해 하위 컴포넌트에 전파 가능  
      -> Prop 내려주기 문제 해결
    - Store가 필요한 컴포넌트라면 connect만 사용하여 접근 가능.

  - 그러나...

    - 하나의 상태를 변경하고 싶어도 해야할 일이 많았다.

      1. 어떠한 Action인지 Type 선언
      2. 해당 Action을 수행할 Creator(함수) 필요
      3. dispatcher & selector 필요
      4. 새로운 상태가 어떻게, 어떤 식으로 변경돼야 할지 or 새로 만들어야 할지 정의

    - (지금은 많이 간소해졌다.)

- Context API & useContext

  - 기존 Prop 내려주기의 불편함 & Redux의 부담스러운 보일러 플레이트(별 수정 없이 반복적으로 사용되는 코드)
  - 이를 해결하기 위해 React 16.3에서 전역 상태를 하위 컴포넌트에 주입할 수 있는 새로운 Context API를 출시.
  - 이전에도 context라는 개념은 있었지만 컴포넌트와 결합도가 높아지는 단점 등이 존재하여 보완한 버전을 새롭게 출시.
  - props를 넘겨주지 않더라도 원하는 곳에서 "Context Provider가 주입하는 상태"를 사용할 수 있게 됨.

  - But, 이는 상태 관리가 아닌, 주입을 도와주기 기능이기 때문에 렌더링을 막아주는 기능은 존재하지 않는다.

### 훅의 탄생, React Query & SWR

- React 16.8 버전에서는 함수형 컴포넌트에 사용할 수 있는 다양한 훅 API(useState 등)를 추가하면서  
  이전에는 볼 수 없었던 방식의 상태 관리(React Query & SWR)가 등장한다.
- 두 라이브러리 모두 외부에서 데이터를 불러오는 fetch를 관리하는 데 특화된 라이브러리지만  
  API 호출에 대한 상태를 관리하고 있기 때문에 HTTP 요청에 특화된 상태 관리 라이브러리이다.

### Recoil, Zustand, Jotai, Valtio 등

- HTTP 요청에 대해서만 쓸 수 있는 React Query, SWR와 다르게 범용적으로 사용할 수 있는 상태 관리 라이브러리의 변화를 살펴보자.'
- 이들은 Redux와느 다르게 `훅을 활용해` 작은 크기의 상태를 효율적으로 관리한다.
- 물론 Redux와 MobX도 추가적인 라이브러리를 설치하면 훅으로 상태를 가져올 수 있다.

### 정리

- 익숙한 것을 선택하는 것도 나쁘지 않지만  
  다양한 옵션을 살펴보고 비교하면서 어떤 식으로 구현하고 있는지 살펴보는 것도 많은 도움이 될 것.

## React Hook으로 시작하는 상태 관리

> React 16.8에서 등장한 Hook과 함수형 컴포넌트의 패러다임에서  
> 애플리케이션 내부 상태 관리는 어떻게 할 수 있고,  
> 이러한 새로운 방법을 채택한 라이브러리의 종류 및 사용법을 알아봅시다 :)

### useState & useReducer

- useState를 활용하면  
  훅 내부에서 관리해야 하는 상태가 복잡하거나 상태를 변경할 수 있는 시나리오가 다양해진다면  
  훅으로 코드를 격리해 제공할 수 있다는 장점이 더욱 크게 드러날 것.

- React Hook을 기반으로 만든 사용자 정의 훅은 함수형 컴포넌트라면 어디서든 손쉽게 재사용 가능하다.

- But, 이들의 한계는 명확하다.

  - 훅을 사용할 때마다 컴포넌트별로 초기화되므로 컴포넌트에 따라 서로 다른 상태를 가질 수밖에 없다.
  - 이렇게 기본적인 Hook을 기반으로 한 상태를 `local state`라고 하며, 이는 해당 컴포넌트 내에서만 유효하다는 한계.

- 그치만!
  - 해당 훅을 한 단계 끌어 사용하면 여러 컴포넌트가 동일한 상태를 바라볼 수 있게 구성도 가능하다.
  - 그렇지만 필요한 컴포넌트에 props 형태로 제공해야 하는 점은 여전히 불편하다.

### local state의 한계 극복하기

- 현재 React의 useState는 React가 만든 클로저 내부에서 관리되어 local state로 생성된다.
- 이를 React Closer가 아닌 다른 완전히 다른 곳에서 초기화돼서 관리되면 어떨까?

- 결론적으로,

  - 값을 업데이트 한다고 하더라도 리렌더링을 일으키는 장치가 필요하기 때문.

- 그렇기에
  1. 컴포넌틔 외부에 상태를 두고 여러 컴포넌트가 같이 쓸 수 있어야 함.
  2. 해당 상태를 사용하는 컴포넌트는 상태의 변화를 감지할 수 있어야 함.
  3. 변화가 일어나면 리렌더링이 발생하여 최신 상태값을 기준으로 렌더링을 해야함.
  4. 상태가 객체일때 감지하지 않는 값이 변경되면 리렌더링이 발생하면 안됨.

이러한 방식으로 구현된 훅이 바로 `useSubscription`이다.

> ToDo: useState로 구현한 useStore 및 useSubscription 코드 비교 및 이해

## useState와 Context의 조화

- 위에서 언급한 `useStore`와 `useSubscription`은 동일한 형태의 여러 개의 Store를 가질 수 없게 된다.
- 그럼 서로 다른 스코프에서는 Store의 구조는 동일하되, 여러 개의 서로 다른 데이터를 공유하고 싶다면...?

```js
const ContextCounter = () => {
  const id = useId()
  const [counter, useStore] = useCounterContextSelector(
    useCallback((state: CounterStore) => state.count. []),
  )

  function handleClick() {
    setStore((prev) => ({...prev, count: prev.count + 1}))
  }

  useEffect(() =>  {
    console.log(`${id} counter rendered`)
  })

  return (
    <div>
      {counter} <button onClick={handleClick}>+</button>
    </div>
  )
}

const ContextInput = () => {
  const id = useId()
  const [counter, useStore] = useCounterContextSelector(
    useCallback((state: CounterStore) => state.count. []),
  )

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setStore((prev) => ({...prev, count: e.target.value}))
  }

  useEffect(() =>  {
    console.log(`${id} counter rendered`)
  })

  return (
    <div>
      <input value={text} onChange={handleChange} />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ContextCounter />
      <ContextInput />

      <CounterStoreProvider initialState={{count: 10, text: 'hello'}}>
        <ContextCounter />
        <ContextInput />

        <CounterStoreProvider initialState={{count: 20, text: 'welcome'}}>
          <ContextCounter />
          <ContextInput />
        </CounterStoreProvider>
      </CounterStoreProvider>
    </>
  )
}
```

- Context와 Provider를 기반으로 각 Store 값을 격리해서 관리함.
- Store를 사용하는 컴포넌트는 해당 상태가 어느 Store에서 온 상태인지 신경쓰지 않아도 됨.
- Context와 Provider를 관리하는 부모 컴포넌트의 입장에서는 자식 컴포넌트에 다라 보여주고 싶은 데이터를 Context로 잘 격리하면 된다.

- 현재 많은 상태 관리 라이브러리가 있지만 작동하는 방식은 다음과 같다.
  - local state의 한계를 극복하기 위해 외부 어딘가에 상태를 정의.
  - 이 외부의 상태 변경을 각자의 방식으로 감지 & 렌더링 진행.

## Recoil, Jotai, Zustand

- Recoil, Jotai: Context, Provider, Hook을 기반으로 "가능한 작은 상태를 효율적으로 관리"하는 데 초점
- Zustand: 하나의 큰 Store를 기반으로 상태를 관리. 이는 Context가 아닌 Store가 가지는 클로저를 기반으로 생성.

### Recoil (with facebook)

- 작동 방식

  1. RecoilRoot

  - 최상단에 배치
  - Recoil에서 생성되는 상태값을 저장하기 위한 Store를 생성.
  - Store의 상태값에 접근할 수 있는 함수들(`getNextStoreID`, `getState`, `replaceState` 등) 존재.
  - 값의 변경되면 이를 참조하고 있는 하위 컴포넌트에게 알림 (`notifyComponents`)

  2. Atom

  - 상태를 나타내는 Recoil의 최소 상태 단위
  - key: 필수 & 다른 atom과 구별하는 식별자

  3. useRecoilValue

  - atom의 값을 읽어오는 Hook
  - 이전값과 비교해 렌더링이 필요한지 확인하기 위해 렌더링을 일으키지 않으면서 값을 저장할 수 있는 ref에 매번 저장.
  - useEffect를 통해 recoilValue가 변경되었을 때 forceUpdate를 호출해 렌더링을 강제로 발생/

  4. useRecoilState

  - 값을 가져오고, 변경할 수 있는 Hook.

- 정리

  1. 애플리케이션 최상단에 <RocoilRoot />를 선언하여 Store 생성.
  2. Atom이란 상태 단위를 이전에서 생성한 Store에 등록.
  3. 컴포넌트는 Recoil에서 제공하는 Hook을 통해 atom의 상태 변화를 Subscribe.
  4. 값이 변경되면 forceUpdate 같은 기법을 통해 리렌더링 실행

- 추가
  - selector는 1개 이상의 atom 값을 바탕으로 새로운 값을 조립할 수 있는 API
  - atom에 비동기 작업도 추가 가능 (useRecoilStateLoadable, waitForAll, waitForAny, waitForAllSettled 등)

### Jotai (유연한 Rocoil ver)

- Botton-up 접근법을 취함: 작은 단위의 상태를 위로 전파할 수 있는 구조.
- 불필요한 리렌더링의 문제점 해결.
- 메모이제이션이나 최적화를 거치지 않아도 리렌더링이 발생하지 않도록 설계.

- 작동 방식
  1. Atom
  - Recoil과 동일하지만 파생된 상태를 만들 수 있다는 점에서 차이.
  - 별도의 key를 넘겨주지 않아도 괜찮.
  - 상태를 저장하지 않음.
  2. useAtomValue
  - Recoil과는 다르게 루트 컴포넌트 레벨에서 Context가 존재하지 않아도 괜찮.
  - Context가 없다면 기본 Store를 루트에 생성하고 이를 활용해 값을 저장하기 때문.
  - 물론 Provider를 사용한다면 각 Provider 별로 다른 atom 값을 관리할 수도 있다.
  - 이 atom이 객체 그 자체를 key로 활용하여 Store에 저장.
  - 리렌더링을 일으키는 rerenderIfChanged
    1. 넘겨받은 atom이 Reducer를 통해 Store에 있는 atom과 달라질 경우.
    2. subscribe를 수행하고 있다가 어디선가 해당 값이 달라지는 경우 리렌더링 실행.
  3. useAtom
  - setAtom의 내부에서 사용중인 write 함수는 Store에서 해당 atom을 찾아 직접 update.
  - 그리고 Store에서 새로운 값을 작성한 후 Listner 함수를 실행하여 변화가 있음을 전파.
  - 리렌더링 수행.
- 특징
  1. API가 간결
  2. atom 값에서 도 다른 파생된 상태를 만들 수 있기 때문에 selector가 필요하지 않음.

### Zustand

- Redux의 영향을 받음.
- 최소 단위로 상태를 관리하는 것이 아닌, 하나의 Store를 중앙 집중형으로 활용해 Store 내부에서 상태를 관리함.
- 리액트 컴포넌트 외부에 Store 생성 가능.

```js
import { createStore, useStore } from "zustand";

const counterStore = createStore((set) => ({
  count: 1,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
}));

function Counter() {
  const { count, inc, dec } = useState(counterStore);

  return (
    <div>
      <span>{count}</span>
      <button onClick={inc}>up</button>
      <button onClick={dec}>down</button>
    </div>
  );
}
```

- 특징
  - 적은 코드로 Store를 만들고 사용 가능.
  - 워낙 작은 라이브러리 크기.
  - 미들웨어 지원. 기본적인 상태 관리 작동 외 추가적인 작업(sessionStorage 저장 등) 정의 가능

## 정리

- 상태를 관리하는 방식에는 조금씩 차이가 있지만  
  React에서 리렌더링을 일으키는 방법은 제한적이기 때문에  
  어떤 방식으로 상태를 관리하든 리렌더링 방식은 거의 동일.
- 그러나, 장기적인 유지보수 및 개선을 위해선 메인터이너가 많고 다운로드가 활발한 라이브러리를 선택하는 것이 좋다.
