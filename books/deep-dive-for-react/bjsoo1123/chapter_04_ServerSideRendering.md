# Chapter.4 Server Side Rendering

### JAM 스택 등장

- 기존의 웹 개발 -> LAMP 스택 (Linux: 운영체제, Apache: 서버, MySQL: 데이터베이스, PHP/Python...: 웹 프레임워크)

  - 기술적 제한과 번거로움 때문에 서버를 확장하는게 쉽지 않았다.
  - 그렇기에 어쩔 수 없는 선택으로 LAMP 스택으로 많이 구성했다.

- 두두등장 -> JAM 스택 (JavaScript, API, Markup: HTML, CSS)

  - JS와 Markup을 미리 빌드해두고 정적으로 사용자에게 제공.
  - 이후 동작은 모두 client에서 실행.
  - 서버 확장성 문제에서 더 자유로워질 수 있게 되었다.

- MEAN 스택 (MongoDB, Express.JS, AngularJS, Node.js), MERN 스택 (MongoDB, Express.JS, React, Node.js) 처럼 API Server 자체도 JS로 구현하는 구조가 인기가 있어졌다.

- 웹 애플리케이션 개발자라면 `웹 서비스의 성능을 역행하는 추세에 책임감을 가질 필요`가 있다.

## 서버 사이드 렌더링

- 웹페이지가 점점 느려지는 상황에 대한 문제의식을 SPA의 태생적인 한계에서 찾고,
- 이를 개선하고자 Server에서 페이지를 Rendering 해 제공하는 방식이 떠오르고 있다.

### 장점

- FCP(First Contentful Paint)이 더 빨라질 수 있다.

  - 서버에서 HTTP 요청을 수행하는게 더 빠름
  - HTML을 DOM에서 그리는 것 보다 서버에서 문자열로 미리 그려서 내려주는게 더 빠름
  - 물론, 충분한 리소스가 확보되어 있다는 가정하에.

- SEO 최적화

  1. Bot이 페이지 진입
  2. 페이지는 HTML 정보를 제공. 단, JS는 실행하지 않음
  3. HTML을 전달받은 Bot은 OG, Meta tag 정보를 바탕으로 검색 엔진에 저장.

- 누적 레아이웃 이동 최소

  - 누적 레이아웃 이동 (Cummulative Layout Shift)
  - 사용자에게 페이지를 보여준 이후에 HTML 정보를 추가하거나 삭제되어 화면이 덜컥거리는 부정적인 UX.
  - ex) Text가 그려진 후 상단에 Image가 그려지면 Text가 하단으로 밀려나는 상황 등.
  - SSR은 API와 같은 요청이 완전히 종료된 후에 완성된 페이지를 제공하기 때문에 비교적 자유로움.
  - 그렇기에 최초 페이지 다운로드가 굉장히 느려질 수도 있는데 React 18에서 등장한 `스트림`으로 해결될 수도 있다.

- 사용자 디바이스 성능에 비교적 자유.

  - CSR에 비해 사용자 디바이스 성능 의존성이 낮아지는 것일 뿐.

- 보안에 안전
  - JAM 스택은 애플리케이션의 모든 활동이 브라우저에 노출된다.
  - 반면 SSR의 경우 인증 또는 민감한 작업을 서버에서 수행 가능하기 때문에 안전할 수 있다.

### 단점

- 복잡성

  - 코드를 작성할때 항상 서버를 고려해야함.
  - 브라우저 전역 객체인 `window`, `sessionStorage` 같은 객체는 Client 쪽에서만 사용하도록 작성.

- 서버 구축

  - 물리적인 가용량을 확보
  - 장애 복구 전략 필요
  - 긴급한 상황을 대비해 프로레스 매니저의 도움이 필요

- 서비스 지연에 따른 문제
  - 느린 작업이 있을 때.
  - CSR은 '로딩 중'과 같은 적절한 처리가 가능
  - SSR은 이 작업이 최초 렌더링에 발생하면 그 어떤 정보도 제공 불가.

### 정리

- 웹페이지의 설계와 목적, 우선순위에 따라 SSR, CSR을 적절히 구성해야 의미가 있다.
- 가장 뛰어난 SPA는 가장 뛰어난 MPA보다 낫다.
- 평균적인 SPA는 평균적인 MPA보다 느리다.
- Paint Holding, Back Forward Cache, Shared Element Transitions과 같은 기법은 모두 SPA에서 구현 가능하지만 상당한 노력을 기울여야 함.

### 현대의 SSR

- 최초 웹사이트 진입 시 -> SSR으로 완성된 HTML을 제공받고.
- 이후 라우팅 -> 서버에서 내려받은 JS를 바탕으로 SPA처럼 동작.
- Next.js나 Remix와 같은 SSR Framework들도 이러한 방식으로 제공.

# NEXT.js

- React 기반 SSR Framework.

## NEXT.js의 구조

### package.json

- eslint-config-next : Next.js 기반 플젝에서 사용하도록 만들어진 ESLint 설정. 구글과 협업해 만든 Core Web Vital에 도움이 되는 규칙들이 내장되어 있음.

### [next.config.js](https://github.com/vercel/next.js/blob/canary/packages/next/src/server/config-shared.ts)

- reactStrictMode : React 애플리케이션 내부에서 잠재적인 문제를 개발자에게 알리기 위한 도구
- swcMinify : SWC를 기반으로 코드 최소화 작업을 할 것인지 여부를 설정.

> SWC 이란?  
> 번들링과 컴파일을 더욱 빠르게 수행하기 위해 만들어진 Babel의 대안  
> JS 기반인 Babel과는 다르게 Rust라는 완전히 다른 언어로 작성 & 병렬로 작업을 처리하기 때문.

### pages/\_app.tsx

- 애플리에키션의 전체 페이지의 시작점
- 에러 바운더리를 사용한 애플리케이션 전역에서 발생하는 에러 처리
- 전역 CSS 선언
- 모든 페이지에 공통으로 사용, 제공해야 하는 데이터 제공 등

### pages/\_document.tsx

- 해당 파일이 없어도 실행헤 지장이 없다.
- 애플리케이션의 HTML을 초기화하는 곳.

- <html> 이나 <body> 에 DOM 속성을 추가
- 해당 파일의 코드는 무조건 서버에서 실행
- 서버에서 사용 가능한 데이터 불러오기 함수(getServerSideProps, getStaticProps 등)는 해당 파일에서 사용 불가
- next/document 에서 제공하는 head, next/head 에서 제공하는 head 2가지가 있다. 우리가 보통 생각하는 head의 역할은 대부분 next/head에서 진행. 그럼 next/document의 head는...?
- CSS-in-JS의 스타일을 서버에서 모아 HTML로 제공

### pages/\_error.tsx

- 클라이언트에서 발생하는 에러 or 서버에서 발생하는 500 에러를 처리할 목적으로 만들어짐.
- 프로젝트 전역에서 발생하는 에러를 적절하게 처리하고 싶을때 사용.
- 개발 모드에서는 방문 불가. 프로덕션으로 빌드 후 확인 가능

### pages/404.tsx

- 만들지 않으면 NEXT.js에서 제공하는 기본 404 페이지 노출

### pages/500.tsx

- 서버에서 발생하는 에러를 핸들링
- error.tsx와 500.tsx 가 모두 존재하면 500.tsx 가 우선적으로 실행.
- error 와 500 모두 만들지 않으면 NEXT.js에서 제공하는 기본 500 페이지 노출

### pages/index.tsx

- 위 페이지들은 Next.js에서 제공하는 예약어이기 때문에 파일명 변경 불가
- /pages 디렉터리를 기초로 구성된 다른 페이지들의 경우는 자유롭게 명칭을 지정해서 생성 가능
- 각 페이지에 있는 default export로 보낸 함수가 해당 페이지의 root component.

- `localhost:3000/hello`로 접근했을때 노출되는 페이지는 `/pages/hello.tsx` or `/pages/hello/index.tsx` 모두 같은 주소를 바라본다.
- `/pages/hello/[greeting].tsx` : `[]` 사이에는 어떠한 문자도 올 수 있고 해당 문자는 `greeting` 이라는 변수에 담겨져 사용자가 접속한 주소명으로 온다.
- `/pages/hi/[...props].tsx` : `/hi` 를 제외한 `/hi` 하위의 모든 주소(`/hi/world/zoo` 등)가 해당 파일로 접근. props라는 변수에 배열로 담겨서 전달.

> Server Routing 과 Client Routing의 차이  
> `<a>` 태그로 이동하게 되면 페이지를 만드는 데 필요한 모든 리소스(webpack, framework, main 등)를 모두 가져온다.  
> `<Link>` 태그로 이동하게 되면 Client에서 필요한 JS만 불러온 뒤 라우팅을 진행한다.  
> 즉, 애플리케이션을 처음부터 서버에서 다시 불러와야 하는 드문 케이스 외에는 Next.js가 제공하는 라우터를 이용해 페이지를 이동하는 것이 좋다.

- getServerSideProps의 유무에 따라서 ServerSide에서 렌더링을 할지, ClientSide에서 렌더링을 할지 간주해 버린다.

### pages/api/hello.ts

- 서버의 api를 정의하는 폴더
- `/pages/api/hello.ts` 는 `/api/hello` 로 호출 가능.
- 해당 주소는 HTML 요청을 하는 것이 아닌 단순히 서버 요청만 주고받는다.
- 서버에서 내려주는 데이터를 조합해 Backend-for-frontend 형태로 활용
- 완전한 풀스택 애플리케이션을 구축하고 싶을 때
- CORS 문제를 우회하기 위해 사용 가능.

## Data Fetching

- SSR 지원을 위한 몇 가지 데이터 불러오기 전략이 존재.
- `pages/` 폴더에 있는 라우팅이 되는 파일에서만 사용 가능.
- 예약어로 지정되며 반드시 정해진 함수명으로 export를 사용해 함수를 파일 외부로 보내야 함.
- 이를 활용하면 서버에서 미리 필요한 페이지를 만들어서 제공 가능.
- 해당 페이지 요청이 있을 때마다 서버에서 데이터를 조회해서 미리 페이지를 만들어 제공 가능.

### getStaticPaths & getStaticProps

- 정적으로 결정된 페이지를 보여주고자 할때 사용.
- 위 2개 함수는 반드시 함께 있어야 사용 가능.
- `getStaticPaths` 는 해당 페이지에서 허용 가능한 params를 지정할 수 있으며
- `getStaticProps` 은 해당 params를 이용하여 데이터를 props로 반환한 다음
- default function이 이 결과를 바탕으로 페이지를 렌더링한다.
- 즉, 빌드 시점에 미리 데이터를 불러온 다음에 정적인 HTML 페이지를 만들 수 있다.
- 위 두 함수를 적절히 설정하고 빌드하면 사용자는 굳이 페이지가 렝더링되는 것을 기다릴 필요 없이 이미 완성된 페이지를 받기만 하면 된다.

- `getStaticPaths` 의 반환값 중 하나인 `fallback` 옵션은 미리 빌드해야 할 페이지가 너무 많을 경우 사용 가능하다. 정해진 리스트만 미리 빌드해두고 나머지 페이지는 아래 경우에 따라 처리된다.
- true: 빌드되기 전까지는 fallback 컴포넌트 노출. 빌드가 완료되면 해당 페이지 노출
- "blocking": 별도의 로딩 처리 없이 ServerSide에서 렌더링할 때까지 대기한 다음 페이지 제공.

### getServerSideProps

- 해당 함수가 있다면 무조건 페이지 진입 전, 해당 함수를 실행.
- 그렇기에 무조건 Server에서 실행해야 하는 페이지로 분류.
- Next.js의 SSR은 getServerSideProps의 실행과 함께 이뤄진다.
- getServerSideProps의 정보인 props 뿐 아닌 다양한 정보가 script 형태로 삽입되어 있다.
- 이는 fetch 시점에 따른 데이터 불일치가 발생할 수 있기 때문에 마지막에 재요청을 하는 대신, script를 읽어도 첫번째 호출한 데이터를 동일하게 가져올 수 있다? (316p)
- `getServerSideProps` 로 내려줄 수 있는 값은 `JSON`으로 제공할 수 있는 값으로 제한되어 있다. 즉, class 나 Date 등은 불가.

- window와 같이 브라우저에서만 접근할 수 있는 객체에는 접근 불가.
- `/api/some/path`와 같이 protocol과 domain 없이 fetch 요청 불가. 서버는 자신의 host를 유추할 수 없기 때문.
- 에러가 발생하면 500.tsx와 같이 미리 정의해 둔 에러 페이지로 리다이렉트.

- 매 페이지를 호출할 때마다 실행
- 실행이 끝나기 전까지는 사용자에게 어떠한 HTML도 제공 불가.
- 그렇기에 꼭 중요한 역할을 하는 데이터만 가져오는 것이 좋다.

- 사용자가 페이지에 접근했을 때 조건에 따라 다른 페이지로 보내고 싶다면 redirect를 사용하면 가능.

### getInitialProps

- `getStaticProps` 이나 `getServerSideProps`가 나오기 전에 사용할 수 있었던 유일한 페이지 데이터 불러오기 수단.
- 해당 함수는 굉장히 제한적인 예시에서만 사용됨.
- 서버와 클라이언트 모두에서 실행 가능한 메서드. 그렇기에 이러한 특징을 감안해서 코드를 작성해야 함.
- context 객체를 통해 어디서 실행되는지 확인 가능

  - pathnanme: 페이지상 경로 ("todo/[id]")
  - asPath: 브라우저에 표시되는 실제 경로 ("todo/1")
  - query: URL에 존재하는 쿼리
  - req (const isServer = context.req)
  - res

- 사용하기 까다롭고 주의할 점이 있기 때문에 app.tsx나 error.tsx와 같이 사용이 제한돼 있는 페이지에서만 사용하는 것이 좋다.

## 스타일 적용하기

### 전역 스타일

- \_app.tsx에 필요한 스타일을 직접 import로 불러오면 애플리케이션 전체에 영향을 미칠 수 있다.
- 전역 스타일은 충돌 방지를 위해 꼭 \_app.tsx에서만 제한적으로 작성.

### 컴포넌트 레벨 CSS

- `[name].module.css`와 같은 명명 규칙만 준수.
- 충돌이 일어나지 않도록 Next.js에서 고유한 클래스명을 제공.
- 페이지와 다르게 어느 파일에서건 추가 가능.

### SCSS & SASS

- 사용 가능 :)

### CSS-in-JS

- JS 내부에 stylesheet를 삽입하는 방식.
- styled-jsx, styled-components, Emotion, Linaria 등 여러 라이브러리 존재.

1. styled-components의 스타일을 모두 모은다.
2. 이 각각의 스타일에 유니크한 클래스명을 부여해 충돌하지 않게 클래스명과 스타일을 정리.
3. \_document.tsx가 Server에서 렌더링할 때 React.Context 형태로 재공

- 이렇게 Server에서 스타일을 미리 모아서 SSR에서 한꺼번에 제공하지 않으면 스타일이 입혀지지 않은 날것의 HTML을 잠시간 사용자에게 노출하게 된다.

## \_app.tsx 응용하기

- 웺서비스를 최초에 접근했을 때만 실행하고 싶은 내용을 담아둘 수도 있다.
- userAgent 확인이나 사용자 정보와 같이 애플리케이션 전역에서 걸쳐 사용해야 하는 정보 등을 호출하는 작업을 수행할 수 있다.

## next.config.js

- basePath : 해당 설정이 있다면 클라이언트 렌더링을 트리거하는 모든 주소에 알아서 해당 path가 붙어서 작동.
- powerdByHeader : 응답 헤더에 `X-Power-by: Next.js` 정보를 제공. `false`로 설정하면 해당 정보가 사라지며 해당 정보는 취약점으로 분류하기 때문에 `false`로 설정하는 것이 좋다.
- redirects : 특정 주소를 다른 주소로 보내고 싶을 때 사용.
- reactStrictMode : React에서 제공하는 엄격 모드를 설정할지 여부
- assetPrefix : 해당 설정이 활성화되면 static 리소스들은 해당 주소에 있다고 가정하고 해당 주소로 요청하게 됨.
