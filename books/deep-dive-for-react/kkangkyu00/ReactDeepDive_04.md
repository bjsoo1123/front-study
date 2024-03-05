# Chapter .04

## 4.1 서버 사이드 렌더링이란?
- - - - -
##### * SPA (Single Page Application): 렌더링, 라우팅 기능을 브라우저의 자바스크립트에 의존하는 방식.
##### * CSR (Client Side Rendering): 렌더링에 필요한 데이터를 서버에서 받아 클라이언트인 브라우저가 화면을 그림.
##### * SSR (Server Side Rendering): 클라이언트에서 요청이 올 때마다 서버에서 화면을 그려 제공.

### CSR, SSR 동작원리

<div style="display: flex; gap: 8px">
    <img width="50.6%" height="50.6%" src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*CRiH0hUGoS3aoZaIY4H2yg.png" />
    <img width="50%" height="50%" src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*jJkEQpgZ8waQ5P-W5lhxuQ.png" />
</div>

### CSR, SSR 장단점
| | CSR                                                   | SSR                              |
|-|-------------------------------------------------------|----------------------------------|
| 장점 | - 렌더링 시 깜박임이 없음 <br /> - 초기 렌더링 이후 속도 증가 | - 초기 렌더링 빠름 <br /> - SEO에 적합 |
| 단점 | - 초기 렌더링이 비교적 느림                             | - 서버에 부하가 있음                  |

<br />

## 4.2 서버 사이드 렌더링을 위한 React api 살펴보기
- - - - -

## ReactDOMServer에서 제공하는 함수


## **- renderToString**
넘겨받은 컴포넌트를 렌더링해 HTML 문자열로 변환

> ReactDOMServer.renderToString(element);

## **- renderToStaticMarkup**
renderToString과 동일하나 DOM 속성을 생성하지 않음

> ReactDOMServer.renderToStaticMarkup(element);

## **- renderToNodeStream**
renderToString과 결과물은 동일하나, renderToNodeStream는 브라우저에서 사용불가 \
Node.js 읽기 가능한 스트림으로 렌더링 (utf-8)

> ReactDOMServer.renderToString(element);

## **- renderToStaticNodeStream**
renderToNodeStream과 제공하는 결과는 동일하나, DOM 속성을 생성하지 않음
> ReactDOMServer.renderToStaticNodeStream(element);

## **- hydrate**
renderToString과 renderToNodeStream으로 만든 HTML에 핸들러, 이벤트를 붙임

> ReactDOM.hydrate(element);

<br />

## 4.3 Next.js 톺아보기
- - - - -

### Next.js란?
React 기반의 프레임워크로, SSR 및 SSG를 지원 \
SSR기반으로 장단점은 같음

##### Next.js 시작하기 (p295 ~ p335)

## 서버 라우팅과 클라이언트 라우팅 차이
.. 서버애서 렌터링을 수행하고, 클라이언트에서 hydrate하는 과정을 볼 수 있음

## Date Fetching

### getStaticPaths
```jsx
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: false
  };
}
``` 
예를들어 이 페이지는 /post/1과 /post/2만 접근 가능함을 의미 함 \
빌드 시 데이터를 fetch하여 static 페이지를 생성


### getStaticProps
```jsx
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params;
  const post = await fetchProps(id);
  return {
    props: { post }
  };
}
```
데이터에 따라 pre-render할 페이지의 동적 경로를 지정하는 함수 \
정의한 페이지 기준으로 해당 페이지로 요청이 왔을 때 제공할 props를 반환


### getServerSideProps
```jsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query: { id = '' } } = context;
  const post = await fetchPost(id.toString());
  return {
    props: { post }
  };
}
```
getServerSideProps는 페이지 진입 전 서버에서 실행되며, 반환되는 데이터로 re-render 혹은 리다이렉트 시킬 수 있음 \
getServerSideProps는 서버에서만 실행되기 때문에 여러 제약이 있음
- window, document 같이 브라우저에서만 접근항 수 있는 객체에 접근 불가
- api 호출 시 protocol, domain 없이 fetch 불가, 완전한 주소를 제공해야 가능
- 에러 발생 시 미리 정의해 둔 에러 페이지로 리다이렉트 됨


### getInitialProps
```jsx
const Todo = ([ todo ]) => {
  return (
    <div>
      <div>{todo.title}</div>
      ...
    </div>
  );
};

Todo.getInitialProps = async (context) => {
  const { query: { id = '' } } = context;

  const post = await fetchPost(id.toString());
  const response = await fetch(/.../);
  const result = response.json();

  return { todo: result };
}
```
getInitialProps는 라우팅에 따라서 서버와 클라이언트 모두 실행 가능함 \
getStaticProps와 getServerSideProps가 나오기 이전에 사용할 수 있던 데이터 불러오기 위한 수단, \
허나 getStaticProps와 getServerSideProps를 사용하는 편이 좋음


## 스타일 적용하기

### 전역 스타일
```jsx
// 적용하고 싶은 글로벌 스타일
import '../style.css';

// 혹은 node_modules에서 바로 꺼내올 수 있음
import 'normalize.css/normalize.css';

const Todo = () => {
  return //...;
};
```
### 컴포넌트 레벨 CSS
```jsx
// style.css
/**
 * .title {
 *  font-size: '18px';
 * }
 * */

import style from './style.css';

const Todo = () => {
  return (
    <div style={style.title}>Title</div>
  );
};
```
### SCSS와 SASS
```jsx
// $primary 변수에 blue 값을 넣음
/**
* $primary: blue
* export {
*   primary: $primary
* }
* */

import styled from './Botton.module.scss';

export const Button = () => {
  return (
    <div style={{color: styled.primary}}>todo</div>
  );
};
```
### CSS-in-JS
자바스크립트 내부에 스타일시트를 삽입하는 방식
- Styled-jsx
- Styled-component
- Emotion
- Linaria
```jsx
// Styled-component
import Todo from './todo';
import styled from 'styled-component';

const StyledTodo = styled(Todo)`
  color: blue;
`;
```
