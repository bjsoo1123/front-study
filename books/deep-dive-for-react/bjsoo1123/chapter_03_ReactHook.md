# Chapter.3 React Hook

- 자유롭게 작성해주시면 됩니다!
- (굳이 md가 아니어도 괜찮습니다)
- 아래는 제가 옛날에 작성했던 글 가져왔습니다!
- 지우고 작성하시면 됩니다!

## React Hook에 관하여

- useEffect

  - 애플리케이션 내 컴포넌트의 여러 값들을 활용해 동기적으로 부수 효과(**effect**)를 만드는 메커니즘.
  - 어떻게 의존성 배열이 변경된 것을 알고 실행할까?
  - 함수형 컴포넌트는 매번 함수를 실행해 렌더링을 수행한다.
  - useEffect는 값의 변화를 관찰하는 것이 아닌, 렌더링할 때마다 의존성의 값의 차이가 있으면 부수 효과를 실행하는 평범한 함수이다.

  ### 클린업 함수에 관하여

  - useEffect에서 return 되는 함수를 `클린업 함수`라고 한다.
  - useEffect는 그 콜백이 실행될 때마다 이전의 클리업 함수를 실행한 뒤, 콜백을 실행한다.
  - 즉, 언마운트 개념과 조금의 차이는 존재한다.
  - 함수형 컴포넌트가 리렌더링됐을 때 의존성 변화가 있었을 당시 이전 상태를 청소해주는 개념이다.

  ### 의존성 배열

  1. 빈 배열

     - 해당 useEffect는 비교할 의존성이 없다고 판단.
     - 최초 렌더링 직후에 실행된 다음만 실행.

  2. 아무런 값도 넘겨주지 않음

     - 렌더링할 때마다 실행이 필요하다고 판단.
     - 보통 컴포넌트가 렌더링됐는지 확인하기 위한 방법으로 사용.
     - `console.log("컴포넌트 렌더링됨")`

     > useEffect의 사용유무 차이

     1. `useEffect`는 클라이언트 사이드에서 실행되는 것을 보장.
     2. 일반적인 실행은 컴포넌트가 렌더링되는 도중에 실행, `useEffect`는 렌더링이 완료된 후에 실행.
     3. 함수형 컴포넌트의 반환을 비연시키는 행위.

  3. 사용자가 원하는 값을 넣는 경우
     - 최초 렌더링 직후 및 의존성이 변경될 때 실행.

  > 한줄 정리
  >
  > useEffect는 컴포넌트가 렌더링된 후에 어떠한 부수 효과를 언제 일으키고 싶은지 설정하는 훅

  ### 주의할 점

  1. 의존성으로 `[]`가 필요하다면 최초에 함수형 컴포넌트가 마운트됐을 시점에만 콜백 함수 실행이 필요한지를 다시 한번 되물어봐야 한다.
     만약 정말 '그렇다'라고 하면 useEffect 내 부수 효과가 실행될 위치가 잘못됐을 가능성이 크다. (?????)

  2. useEffect의 첫 번째 인수에 함수명을 부여하라

     ```js
     useEffect(
       function logActiveUser() {
         logging(user.id);
       },
       [user.id]
     );
     ```

     - useEffect의 코드가 복잡하고 많아질수록 무슨 일을 하는 useEffect 코드인지 파악하기 어렵기 때문.
     - useEffect의 목적을 명확히 하고 그 책임을 최소한으로 좁힌다는 점.

  3. 거대한 useEffect를 만들지 마라

     - 만약 부득이하게 큰 useEffect를 만들어야 한다면 적은 의존성 배열을 사용하는 여러 개의 useEffect로 분리하는 것이 좋다.
     - 의존성 배열에 불가피하게 여러 변수가 들어가야 하는 상황이라면 최대한 `useCallback`과 `useMemo` 등으로 사전에 정제된 내용들만 useEffect에 담아두는 것이 좋다.

  4. 불필요한 외부 함수를 만들지 마라
     - useEffect 내에서 사용할 부수 효과라마녀 내부에서 정의해서 사용하는 편이 도움이 된다.

  > ### 왜 useEffect의 콜백 인수로 비동기 함수를 바로 넣을 수 없을까?
  >
  > 비동기 함수의 응답 속도가 차례로 5초, 1초가 걸렸다고 하면 이전 state를 기반으로 결과가 나오는 문제, `경쟁 상태(race condition)`이 발생할 수 있다.
  > 기술적인 문제가 있는 것은 아니기 때문에 useEffect 내부에 비동기 함수를 선언하거나 외부에서 선언된 비동기 함수를 사용하는 것은 가능하다.
  > 다만 이렇게 할 경우, 클린업 함수에서 이전 비동기 함수에 대한 처리를 통해 비동기 함수의 반복적인 생성 및 실행을 제어하는 것이 좋다.

- useMemo

  - 비용이 큰 연산에 대한 결과를 저장해 두고, 이 값을 반환하는 훅.
  - 렌더링 발생 시 의존성 배열의 값이 변경되지 않았으면 함수를 재실행하지 않고 이전에 저장해 둔 값을 반환한다.

- useCallback

  - useMemo가 값을 저장했다면, useCallback은 콜백 자체를 저장한다.
  - 즉, 특정 함수를 재사용한다, 재생성하지 않는다는 의미.
  - useMemo와 useCallback는 동일한 역할을 수행한다. 저장하는 대상이 변수인지 함수인지 차이일 뿐.

- useRef

  - useState와의 차이점
    1. 반환값 내부에 있는 current로 값에 접근 및 변경이 가능
    2. 그 값이 변하더라도 렌더링을 발생시키지 않는다.
  - 렌더링에 영향을 미치지 않는 고정된 값을 관리하기 위해 함수 외부에서 값을 넘겨주어도 되는데 왜 useRef를 사용할까?
    1. 컴포넌트가 실행되어 렌더링되지 않았음에도 value라는 값이 기본적으로 존재. -> 불필요한 메모리 할당
    2. 여러번 component가 생성될때 동일한 값으로 생성. -> 일반적인 경우 하나의 인스턴스에 하나의 값을 필요로 한다.
  - 위 상황을 고려해봤을 때, DOM에 접근하려고 할 때가 일반적인 상황이다.
  - useRef의 최초 기본값은 useRef()로 넘겨받은 인수인 `undefined`다. ueRef가 선언될 당시에는 컴포넌트가 렌더링되기 전이라 컴포넌트의 DOM이 반환되기 전이기 때문.
  - 이는 `usePrevious`와 같은 렌더링에 영향을 미치지 않고 보관해 두고 싶을 때 사용한다.

  ```js
  export function useRef(initialValue) {
    currentHook = 5;
    return useMemo(() => ({ current: initialValue }), []);
  }
  ```

  - 렌더링에 영향을 미치면 안 되기 때문에 useMemo에 빈 배열을 선언하여 간단하게 구현이 가능하다.

- useContext

  - prop 내려주기를 극복하기 위해 등장한 개념이 Context.
  - Context를 함수형 컴포넌트에서 사용할 수 있게 해주는 것이 useContect hook이다.

  ```jsx
  const Context = createContext();

  function ParentComponent() {
    return (
      <>
        <Context.Provider value={{ hello: "react" }}>
          <Context.Provider value={{ hello: "javascript" }}>
            <ChildComponent />
          </Context.Provider>
        </Context.Provider>
      </>
    );
  }

  function ChildComponent() {
    const value = useContext(Context);

    return <>{value ? value.hello : ""}</>; // 'javascript'
  }
  ```

  ### 주의할 점

  - Provider에 의존성을 가지고 있는 셈이므로 아무데서나 재활용하기에는 어렵다.
  - 그렇기에 useContext를 사용하는 컴포넌트는 최대한 작게, 혹은 재사용되지 않을 컴포넌트에서 사용해야 한다.
  - 그렇기에 모든 Context를 최상위 로트에 넣는 것은 현명한 접근법이 아니다.
  - useContext는 상태를 주입해 주는 API일 뿐, 상태 관리 라이브러리가 아니다. 이를 사용한다고 해서 렌더링이 최적화되지는 않는다.
  - 그러므로 useContext를 사용했다면 Provider의 값이 변경될 때 렌더링이 어떻게 이뤄지는지 눈여겨봐야 한다.

- useReducer

  - useState의 심화버전.
  - 입력값
    1. reducer: useReducer의 기본 action을 정의하는 함수
    2. initialState: 초깃값을 의미
    3. init(optional): useState의 인수로 함수를 넘겨줄 때처럼 초깃값을 지연해서 생성시키고 싶을 때 사용하는 함수. 함수를 넘겨준다면 게으른 초기화가 일어나며 initialState를 인수로 init 함수가 실행된다.
  - 반환값
    1. state: 현재 useReducer가 가지고 있는 값.
    2. dispatcher: state를 업데이트하는 함수. setState는 값을 넘겨주지면 dispatcher는 state를 변경할 수 있는 action을 넘겨준다.

  ```ts
  type State = { count: number }
  type Action = { type: 'up' | 'down' | 'reset'; payload?: State }

  function init(count: State): State {
    return count
  }

  const initialState: State = { count: 0 }

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'up':
        return { count: state.count + 1 }
      case 'down':
        return { count: state.count - 1 > 0 ? state.count - 1 : 0 }
      case 'reset':
        return init(action.payload || { count: 0 })
      default:
        throw new Error(`Unexpected action type ${action.type}`)
    }
  }

  export default function App() {
    const [state, dispatcher] = useReducer(reducer, initialState, init)

    function handleUpButtonClick() {
      dispatcher({ type: 'up' })
    }

    function handleResetButtonClick() {
      dispatcher({ type: 'reset', payload: { count: 1 } })
    }

    ...
  }
  ```

  - 복잡해 보이지만 useReducer의 목적은 간단하다.
    1. state 값에 대한 접근은 컴포넌트에서만 가능하게 한다.
    2. state를 업데이트하는 방법에 해단 상세 정의는 컴포넌트 밖에다 둔다.
    3. state의 업데이트를 미리 정의해 둔 dispatcher로만 제한한다.
  - state 값을 변경하는 시나리오를 제한적으로 두고 이에 대한 변경을 빠르게 확인할 수 있게끔 하는 것이다.

  ### useState 와의 차이점

  - useReducer나 useState 둘 다 세부 작동과 쓰임에만 차이가 있을 뿐, 결국 클로저를 활용해 값을 가둬서 state를 관리한다.
  - 필요에 맞게 취사선택하면 된다.

- useImperativeHandle

  ### forwardRef 부터 알아보자

  - ref를 상위 컴포넌트에서 하위 컴포넌트로 전달하고 싶을때!

  ```js
  function ChildComponent({ parentRef }) {
    useEffect(() => {
      console.log(parentRef);
      // { current: undefined }
      // { current: HTMLInputElement }
    }, [parentRef]);

    return <div>Hello</div>;
  }

  function ParentComponent() {
    const inputRef = useRef();

    return (
      <>
        <input ref={inputRef} />
        <ChildComponent parentRef={inputRef} />
      </>
    );
  }
  ```

  - 단순히 props로 전달하여 구현할 수 있다. 그러나 ref를 전달하는 데 있어 일관성을 제공해주기 위해 forwardRef가 탄생했다.
  - 어떤 props명으로 전달할지 모르고, 완전한 네이밍의 자유가 주어진 props보다는 확실하게 ref를 전달할 것임을 알려주기 위해 forwardRef를 사용한다.

  ```js
  const ChildComponent = forwardRef((props, ref) => {
    useEffect(() => {
      console.log(ref);
      // { current: undefined }
      // { current: HTMLInputElement }
    }, [ref]);

    return <div>Hello</div>;
  });

  function ParentComponent() {
    const inputRef = useRef();

    return (
      <>
        <input ref={inputRef} />
        <ChildComponent ref={inputRef} />
      </>
    );
  }
  ```

  ### useImperativeHandle 이란?

  - 부모에게서 넘겨받은 ref를 원하는 대로 수정할 수 있는 훅이다.

  ```js
  const Input = forwardRef((props, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        alert: () => alert(props.value),
      }),
      [props.value]
    );
    return <input ref={ref} {...props} />;
  });

  function App() {
    const inputRef = useRef();
    const [test, setText] = useState("");

    function handleChange(e) {
      inputRef.current.alert();
    }

    function handleChange(e) {
      setText(e.target.value);
    }

    return (
      <>
        <Input ref={inputRef} value={text} onChange={handleChange} />
        <button onClick={handleClick}>Focus</button>
      </>
    );
  }
  ```

- useLayoutEffect

  - 해당 함수의 형태나 사용 예제는 useEffec와 동일하지만, 모든 DOM의 변경 후에 동기적으로 발생한다.
    1. react가 DOM을 업데이트
    2. useLayoutEffect 실행
    3. 브라우저에 변경 사항을 반영
    4. useEffect 실행
  - 동기적으로 실행되기 때문에 useLayoutEffect가 완료될 때까지 컴포넌트가 잠시 중지되는 것과 같은 일이 발생한다.
  - 그렇기에 해당 함수는 `DOM은 계산됐지만 이것이 화변에 반영되기 전에 하고 싶은 작업이 있을 때`와 같이 반드시 필요할 때만 사용하는 것이 좋다.
  - 예를 들어, 특정 요소에 따라 DOM 요소를 기반으로 한 애니메이션, 스크롤 위치를 제어하는 등 화면에 반영되기 전에 하고 싶은 작업

- useDebugValue

  - 개발할 때에만 사용하는 훅. 필요성에 의문이 든다.

- 훅의 규칙
  1. 최상위에서만 훅을 호출해야 한다. 그래야만 컴포넌트가 렌더링될 때마다 항상 동일한 순서로 훅이 호출되는 것을 보장받을 수 있다.
  2. 훅을 호출할 수 있는 것은 "리액트 함수형 컴포넌트", "사용자 정의 훅" 이렇게 2가지 경우뿐이다.

## 사용자 정의 훅 & 고차 컴포넌트

### 사용자 정의 훅

- 리액트에서만 사용할 수 있는 방식
- 서로 다른 컴포넌트 내부에서 같은 로직을 공유하고자 할 때 주로 사용.
- 이름이 반드시 `use`로 시작하는 함수를 만들어야 한다.
- `react-hooks/rules-of-hooks`가 지적하는 바는 훅은 "함수형 컴포넌트 내부" 또는 "사용자 정의 훅 내부"에서만 사용할 수 있기 때문에 `use`라는 이름으로 짓지 않은 함수 안에서 훅을 사용하면 에러가 발생한다.

```ts
function useFetch<T>(
  url: string,
  { method, body }: { method: string; body?: XMLHttpRequestBodyInit }
) {
  const [result, setResult] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ok, setOk] = useState<boolean | undefined>();
  const [status, setStatus] = useState<number | undefined>();

  useEffect(() => {
    const abortController = new AbortController(); // Info: 비동기 처리 함수 (abort 메소드를 이용하면 signal을 함께 보낸 비동기 요청을 중지할 수 있다.)

    (async () => {
      setIsLoading(true);

      const response = await fetch(url, {
        method,
        body,
        signal: abortController.signal, // Info: signal 보내~
      });

      setOk(response.ok);
      setStatus(response.status);

      if (response.ok) {
        const apiResult = await response.json();
        setResult(apiResult);
      }

      setIsLoading(false);
    })();

    return () => {
      abortController.abort(); // Info: 그만~
    };
  }, [url, method, body]);

  return { ok, result, isLoading, status };
}
```

### 고차 컴포넌트 (Higher Order Component)

- JS의 함수 특징을 이용하기 때문에 react가 아니어도 쓰일 수 있다.
- 컴포넌트 자체의 로직을 재사용하기 위한 방법이다.
- React에서 가장 유명한 고차 컴포넌트는 `React.memo`이다.

  - 부모 컴포넌트가 새롭게 렌더링될 때, 자식 컴포넌트는 props 변경 여부에 관계없이 렌더링이 발생하지만 `React.memo`를 이용하면 렌더링을 하기 전, props를 비교하여 변경되지 않았다면 이전에 기억해 둔 컴포넌트를 반환한다.

- 고차 함수 만들기

  - 고차 함수란, `함수를 인수로 받거나 결과로 반환하는 함수`이다.
  - `map`, `forEach`, `reduce`와 같은 고차 함수들이 있다.

- 고차 컴포넌트 만들기
  - 고차 컴포넌트는 컴포넌트 전체를 감쌀 수 있다는 점에서 사용자 정의 훅보다 더 큰 영향력을 컴포넌트에 미칠 수 있다.
  - react의 고차 컴포넌트도 마찬가지로 `with`로 시작하는 이름을 사용하는 것이 일종의 관습이다.
  - 고차 컴포넌트는 반드시 컴포넌트를 인수로 받는데, 전달받은 컴포넌트의 props를 건드리는 것을 최소화해야 한다.
  - 고차 컴포넌트가 반복적으로 존재하면 복잡성이 매우 커지기 때문에 최소한으로 사용하는 것이 좋다.

```tsx
// App.js
import TestComponent from "./TestComponent";

const App = () => {
  return (
    <h1>
      기존 텍스트
      <TestComponent name="테스트 컴포넌트" />
    </h1>
  );
};

export default App;

// TestComponent.js
import React, { useEffect } from "react";
import withChildrenTestComponent from "./withChildrenTestComponent";

const TestComponent = (props) => {
  useEffect(() => {
    console.log("3. TestComponent useEffect");
  }, []);

  console.log("2. TestComponent Render");
  return <div>props.name : {props.name}</div>;
};

export default withChildrenTestComponent(TestComponent, "TestComponent");

// withChildrenTestComponent.js
import React, { useEffect } from "react";

const withChildrenTestComponent = (InComponent, InComponentName) => {
  return (props) => {
    useEffect(() => {
      console.log(`4. InComponentName : ${InComponentName} useEffect`);
    }, []);

    console.log("1. InComponent Render");
    return <InComponent {...props} />;
  };
};

export default withChildrenTestComponent;
```

- 고차 컴포넌트 관련 참고하면 좋은 [페이지](https://velog.io/@1998yuki0331/%EA%B3%A0%EC%B0%A8-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8-Higher-Order-Components)

### 사용자 정의 훅 vs 고차 컴포넌트

- 단순히 컴포넌트 전반에 걸쳐 동일한 로직으로 값을 제공하거나 특정한 훅의 작동을 취하게 하고 싶다면 `사용자 정의 훅`
- 공통화된 렌더링 로직을 처리하기 위해선 `고차 컴포넌트`
