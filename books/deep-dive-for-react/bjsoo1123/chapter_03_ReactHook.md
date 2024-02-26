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

  1. 의존성으로 `[]`가 필요하다면 최초에 함수형 컴포넌트가 마우트됐을 시점에만 콜백 함수 실행이 필요한지를 다시 한번 되물어봐야 한다.
     만약 정말 '그렇다'라고 하면 useEffect 내 부수 효과가 실행될 위치가 잘못됐을 가능성이 크다. (?????)

  2. useEffect의 첫 번째 인수에 함수명을 부여하라

     ```
     useEffect(
       function logActiveUser() {
         logging(user.id)
       },
       [user.id],
     )
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

  ```javascript
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
    3. init(optional): useState의 인수로 함수를 넘겨줄 때처럼 초깃값을 지영해서 생성시키고 싶을 때 사용하는 함수
  - 반환값
    1. state: 현재 useReducer가 가지고 있는 값.
    2. dispatcher: state를 업데이트하는 함수. setState는 값을 넘겨주지면 dispatcher는 state를 변경할 수 있는 action을 넘겨준다.

## 클래스는 작아야 한다.

- 함수와 마찬가지로, '작게'가 기본 규칙이다. 다만 얼마나 작아야 하는가?
- 클래스가 맡은 책임을 척도로 작성
- processor, manager, super와 같은 모호한 단어가 있으면 안 된다.
- 클래스에 대한 설명은 if, and, or, but을 사용하지 않고 25단어 내외로 가능해야 한다.
