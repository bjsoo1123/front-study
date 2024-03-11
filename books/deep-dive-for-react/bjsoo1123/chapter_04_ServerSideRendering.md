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

# SSR을 위한 React API 살펴보기