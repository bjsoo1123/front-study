# Chapter.3 리엑트의 모든 훅 파헤치기

## useState

- react에서 기본적으로 제공하는 상태관리 훅.

```jsx

const useState = (internalValue) => {
	let internalState = internalValue;

	const state = () => {
		return internalState;
	};

	const setState = (newValue) => {
		internalState = newValue;
	};

	return [state, setState];
};

const [value, setValue] = useState(0);
setValue(1); // 1;
```

## useEffect

- 클래스 컴포넌트의 생명주기 메서드를 함수 컴포넌트에서도 사용가능하게 도와주는 훅.
- useEffect 사용 시 주의
    - eslint-disable-next-line react-hooks/exhaustive-deps 자제 (의존성을 속이지 않는다)
    - 거대한 useEffect 금지 (useCallback or useMemo)
    - 불필요한 외부 함수 금지

- useEffect에 callback 인수로 비동기 함수를 바로 넣을 수 없는 이유
    - 비동기 함수의 응답 속도로 인한 “경쟁 상태(rece condition)”이 발생 할 수 있다.
    - 내부에 비동기 함수 선언해 사용가능하나 클린업을 통해 비동기 함수의 상태 처리해야 함.

## useMemo

- 연산에 대한 결과를 저장(메모제이션)하고, 저장된 값을 반환하는 훅.
- 의존성으로 선언된 value가 변경되지 않으면 다시 계산되지 않는다.

## useCallback

- useMemo와 비슷하나 useCallback 콜백 전체를 기억하여 함수를 재사용한다.

## useContext

- context를 함수 컴포넌트에서 사용가능하게 해주는 훅.

- 다른 상태관리 api와 구조적으로는 비슷하나 다른 개념
    - 상태관리 api는 store에 값을 저장하고
    - useContext는 provider를 통해 하위 컴포넌트에 상태를 주입

## useReducer

## useImperativeHandle

- 부모에게 받은 ref를 수정할 수 있는 훅.

기본적인 사용방법

- 사용방법은 useEffect와 비슷하다.

```jsx

const Component = forwardRef(function MyInput(props, ref) {

  useImperativeHandle(ref, () => {
    return {
      // methods
    };
  }, []);

	// ...
};
```

- useImperativeHandle와 forwardRef를 활용하여 하위 컴포넌트의 state를 가져오지 않고, 상위에서 상태 관리 가능.
- 상위 컴포넌트와 하위 컴포넌트의 의존성 분리 가능.

## useLayoutEffect

- 기본적으로 useEffect와 비슷하나 실행되는 순서?가 다름.
    - DOM 형성 후 동기적으로 실행

```jsx
const Component = () => {

	useEffect(() => {
		console.log('######## 1');
	}, []);

	useLayoutEffect(() => {
		console.log('######## 2');
	}, []);
  
	// ...
}; 

// 결과
// ######## 2
// ######## 1
```

- DOM 형성 후 화면에 표시되기전 작업할 내용이 있을 경우 적합.

## useDebugValue

- 웹서비스가 아닌 디버깅하고 싶은 정보를 훅에다 사용하면 개발자 도구창에서 볼 수 있음.

기본적인 사용법

```jsx

const useDate = () => {
	const date = new Date();

	useDebugValue(date, (date) => `현재 시간은 ${date}`);

	return date;
};

const Compoenent = () => {
	const date = useDate();
	
	// ...
};

// 결과
// 현재 시간은 Sun Feb 25 2024 21:42:04 GMT+0900 (한국 표준시)
```

- 두번째 인수로 포매팅 함수 전달 시 해당 값이 변할때만 호출되어 값 노출.
- 다른 훅 내부에서만 가능.
