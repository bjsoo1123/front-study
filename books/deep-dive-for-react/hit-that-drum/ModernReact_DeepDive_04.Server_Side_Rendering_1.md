# [모던 리액트 Deep Dive] 04장 서버 사이드 렌더링 (1)

## 4.1 서버 사이드 렌더링이란?

---

### 4.1.1 싱글 페이지 애플리케이션의 세상

- Single Page Application(SPA)
  렌더링과 라우팅에 필요한 대부분의 기능을 서버가 아닌 브라우저의 자바스크립트에 의존하는 방식을 의미한다. 최초에 첫 페이지에서 데이터를 모두 불러온 이후에는 페이지 전환을 위한 모든 작업이 자바스크립트와 브라우저의 history.pushState와 history.replaceState로 이루어지기 때문에 페이지를 불러온 이후에는 서버에서 HTML을 내려받지 않고 하나의 페이지에서 모든 작업을 처리한다.

- 이러한 작동 방식은 최초에 로딩해야 할 자바스크립트 리소스가 커지는 단점이 있지만 한 번 로딩된 이후에는 서버를 거쳐 필요한 리소스를 받아올 일이 적어지기 때문에 사용자에게 훌륭한 UI/UX를 제공한다는 장점이 있다.

- 이러한 SPA 방식은 웹페이지를 불러오는 데 필요한 부담을 일정 부분 사용자에게 전가하더라도 사용자의 기기나 인터넷 환경이 더 빠르게 발전할 것이기 때문에 괜찮을 것이라는 기대감에 의해 더욱 보편화되었다. 그러한 기대에 부응하기라도 하듯 웹 애플리케이션에서 제공하는 자바스크립트 리소스의 크기와 수가 모두 증가하기 시작하였다.

- 자바스크립트 파싱을 위해 CPU를 소비하는 시간이 눈에 띄게 증가했는데 그만큼 자바스크립트에서 처리해야 하는 코드의 양이 절대적으로 증가했음을 알 수 있다.

<br>

---

### 4.1.2 서버 사이드 렌더링이란?

- 최초에 사용자에게 보여줄 페이지를 서버에서 렌더링해 빠르게 사용자에게 화면을 제공하는 방식을 의미한다.

- 싱글 페이지 애플리케이션과 서버에서 페이지를 빌드하는 서버 사이드 렌더링의 차이는 웹페이지 렌더링의 책임을 어디에 두느냐다. 싱글 페이지 애플리케이션은 사용자에게 제공되는 자바스크립트 번들에서 렌더링을 담당하지만 서버 사이드 방식을 채택하면 렌더링에 필요한 작업을 모두 서버에서 수행한다.

<br>

- 장점

1. 최초 페이지 진입이 비교적 빠르다

일반적으로 서버에서 HTTP 요청을 수행하는 것이 더 빠르고, 또 HTML을 그리는 작업도 서버에서 해당 HTML을 문자열로 미리 그려서 내려주는 것이 클라이언트에서 기존 HTML에 삽입하는 것보다 더 빠르기 때문이다. 모든 경우에 서버 사이드 렌더링이 초기 페이지 렌더링에 비해 이점을 가진다고 볼 수 없지만 화면 렌더링이 HTTP 요청에 의존적이거나 렌더링해야 할 HTML의 크기가 커진다면 상대적으로 서버 사이드 렌더링이 더 빠를 수 있다.
물론 이것은 서버가 사용자에게 렌더링을 제공할 수 있을 정도의 충분한 리소스가 확보돼 있다는 일반적인 가정 하에 비교한 것이다. 서버가 사용자를 감당하지 못하고, 리소스를 확보하기 어렵다면 오히려 싱글 페이지 애플리케이션보다 느려질 수도 있다.

2. 검색 엔진과 SNS 공유 등 메타 데이터 제공이 쉽다

로봇은 페이지를 보는 것이 아닌 페이지의 정적인 정보를 가져오는 것이 목적이므로 자바스크립트를 다운로드하거나 실행할 필요가 없다. 싱글 페이지 애플리케이션은 대부분의 작동이 자바스크립트에 의존하는데, 이러한 메타 정보 또한 마찬가지다. 검색 엔진이 최초에 방문했을 때, 즉 페이지에 최초로 진입했을 때 이러한 메타 정보를 제공할 수 있도록 조치를 취하지 않는다면 검색 엔진이나 SNS 공유 시에 불이익이 있을 수 있다. 반면 서버 사이드 렌더링은 최초의 렌더링 작업이 서버에서 일어난다. 즉, 검색 엔진에 제공할 정보를 서버에서 가공해서 HTML 응답으로 제공할 수 있으므로 검색 엔진 최적화에 대응하기가 매우 용이하다.

3. 누적 레이아웃 이동이 적다

싱글 페이지 애플리케이션에서는 페이지 콘텐츠가 API 요청에 의존하고, API 요청의 응답 속도가 제각각이며, 이를 적절히 처리해두지 않는다면 이러한 누적 레이아웃 이동 문제가 발생할 수 있다. 반면 서버 사이드 렌더링의 경우에는 이러한 요청이 완전히 완료된 이후에 완성된 페이지를 제공하므로 이러한 문제에서 비교적 자유롭다.

4. 사용자의 디바이스 성능에 비교적 자유롭다

자바스크립트 리소스 실행은 사용자의 디바이스에서만 실행되므로 절대적으로 사용자 디바이스 성능에 의존적이다. 그러나 서버 사이드 렌더링을 수행하면 이러한 부담을 서버에 나눌 수 있으므로 사용자의 디바이스 성능으로부터 조금 더 자유로워질 수 있다.

5. 보안에 좀 더 안전하다

인증 혹은 민감한 작업을 서버에서 수행하고 그 결과만 브라우저에 제공해 이러한 보안 위협을 피할 수 있다는 장점이 있다.

<br>

- 단점

1. 소스코드를 작성할 때 항상 서버를 고려해야 한다

소스코드 전반에 걸쳐 서버 환경에 대한 고려가 필요하다. 그 중 가장 큰 문제가 바로 브라우저 전역 객체인 window 또는 sessionStorage와 같이 브라우저에만 있는 전역 객체 등이다. 소스코드나 사용 라이브러리에서 window를 사용하고 있고, 이 코드가 만약 서버에서 실행된다면 'window is not defined'라는 에러를 마주하게 된다. 그러므로 서버에서도 실행될 가능성이 있는 코드라면 window에 대한 접근을 최소화해야 하고, window 사용이 불가피하다면 해당 코드가 서버 사이드에서 실행되지 않도록 처리해야 한다. 이러한 서버에 대한 고려는 작성한 코드분만 아니라 외부에서 의존하고 있는 라이브러리도 마찬가지다.

2. 적절한 서버가 구축돼 있어야 한다

서버를 구축하는 것은 절대 쉬운 일이 아니다. 사용자의 요청에 따라 적절하게 대응할 수 있는 물리적인 가용량을 확보해야 하고, 때로는 예기치 않은 장애 상황에 대응할 수 있도록 복구 전략도 필요하다. 또한 요청을 분산시키고, 프로세스가 예기치 못하게 다운될 때를 대비해 PM2와 같은 프로세스 매니저의 도움도 필요하다.

3. 서비스 지연에 따른 문제

싱글 페이지 애플리케이션은 그래도 최초에 어떤 화면이라도 보여준 상태에서 무언가 느린 작업이 수행되기 때문에 '로딩 중'과 같이 작업이 진행 중임을 적절히 안내한다면 충분히 사용자가 기다릴 여지가 있다.
그러나 서버 사이드 렌더링에서, 특히 이 지연 작업이 최초 렌더링에 발생한다면 큰 문제가 된다. 서버 사이드 렌더링은 서버에서 사용자에게 보여줄 페이지에 대한 렌더링 작업이 끝나기까지는 사용자에게 그 어떤 정보도 제공할 수 없다.

<br>

---

### 4.1.3 SPA와 SSR을 모두 알아야 하는 이유

- 서버 사이드 렌더링 역시 만능은 아니다.
  클라이언트에서 발생하는 모든 무거운 작업을 서버에 미루고, 작업이 모두 서버에서 이뤄진다고 해서 모든 성능 문제가 해결되는 것은 아니다.
  웹페이지에서 사용자에게 제공하고 싶은 내용이 무엇인지, 또 어떤 우선순위에 따라 페이지의 내용을 보여줄지를 잘 설계하는 것이 중요하다.

<br>

최근에는 멀티 페이지 애플리케이션에서 발생하는 라우팅으로 인한 문제를 해결하기 위한 다양한 API가 브라우저에 추가되고 있다.

- 페인트 홀딩(Paint Holding): 같은 출처(origin)에서 라우팅이 일어날 경우 화면을 잠깐 하얗게 띄우는 대신 이전 페이지의 모습을 잠깐 보여주는 기법

- back forward cache(brcache): 브라우저 앞으로 가기, 뒤로가기 실행 시 캐시된 페이지를 보여주는 기법

- Shared Element Transitions: 페이지 라우팅이 일어났을 때 두 페이지에 동일 요소가 있다면 해당 콘텍스트를 유지해 부드럽게 전환되게 하는 기법

<br>

- 결국 우리는 앞의 두 방법론이 모두 상황에 따라 유효한 방법이라는 것을 먼저 이해해야 한다. 두 가지 모두 장단점이 있으며 어느 하나가 완벽하다고 볼 수 없다. 싱글 페이지 애플리케이션이 제공하는 보일러플레이트나 라이브러리가 점차 완벽해지면서 잠재적인 모든 위험을 제거할 수도 있고, 멀티 페이지 애플리케이션이 브라우저 API의 도움을 받아 싱글 페이지 애플리케이션과 같은 끊김 없는 사용자 경험을 제공할 수도 있다.

<br>

---

## 4.2 서버 사이드 렌더링을 위한 리액트 API 살펴보기

---

### 4.2.1 renderToString

- 함수 이름에서도 알 수 있듯이 인수로 넘겨받은 리액트 컴포넌트를 렌더링해 HTML 문자열로 반환하는 함수돠. 서버 사이드 렌더링을 구현하는 데 가장 기초적인 API로, 최초의 페이지를 HTML로 먼저 렌더링한다고 언급했는데 그 역할은 하는 함수이다.

- 이는 인수로 주어진 리액트 컴포넌트를 기준으로 빠르게 브라우저가 렌더링할 수 있는 HTML을 제공하는 데 목적이 있는 함수일 뿐이다. 즉, 클라이언트에서 실행되는 자바스크립트 코드를 포함시키거나 렌더링하는 역할까지 해주지는 않는다. 필요한 자바스크립트 코드는 여기에서 생성된 HTML과는 별도로 제공해 브라우저에 제공돼야 한다.

- 클라이언트에서 실행되지 않고 일단 먼저 완성된 HTML을 서버에서 제공할 수 있으므로 초기 렌더링에서 뛰어난 성능을 보일 것이다. 또한 검색 엔진이나 SNS 공유를 위한 메타 정보도 renderToString에서 미리 준비한 채로 제공할 수 있으므로 싱글 페이지 애플리케이션 구조보다 손쉽게 완성할 수 있을 것이다.

- 리액트의 서버 사이드 렌더링은 단순히 '최초 HTML 페이지를 빠르게 그려주는 데'에 목적이 있다는 것이다. 사용자는 완성된 HTML을 빠르게 볼 수는 있지만 useEffect나 이벤트 핸들러가 없는 것을 확인할 수 있듯이 실제로 웹페이지가 사용자와 인터랙션할 준비가 되기 위해서는 이와 관련된 별도의 자바스크립트 코드를 모두 다운로드, 파싱, 실행하는 과정을 거쳐야 한다.

<br>

### 4.2.2 renderToStaticMarkup

- renderToString과 매우 유사한 함수다. 두 함수 모두 리액트 컴포넌트를 기준으로 HTML 문자열을 만든다는 점에서 동일하다. 한 가지 유의미한 차이점은 앞서 루트 요소에 추가한 data-reactroot와 같은 리액트에서만 사용하는 추가적인 DOM 속성을 만들지 않는다는 점이다. 이처럼 리액트에서만 사용하는 속성을 제거하면 결과물인 HTML의 크기를 아주 약간이라도 줄일 수 있다는 장점이 있다.

- 리액트의 이벤트 리스너가 필요 없는 완전히 순수한 HTML을 만들 때만 사용된다. 블로그 글이나 상품의 약관 정보와 같이 아무런 브라우저 액션이 없는 정적인 내용만 필요한 경우에 유용하다.

<br>

### 4.2.3 renderToNodeStream

- renderToString과 결과물이 완전히 동일하지만 두 가지 차이점이 있다.

- renderToString과 renderToStaticMarkup은 브라우저에서도 실행할 수 있지만 renderToNodeStream은 브라우저에서 사용하는 것이 완전히 불가능하다. 이는 완전히 Node.js 환경에 의존하고 있기 때문이다.

- renderToString은 이름에서도 알 수 있듯 결과물이 string인 문자열이지만, renderToNodeStream의 결과물은 Node.js의 ReadableStream이다. 이는 utf-8로 인코딩된 바이트 스트림으로, Node.js 환경에서만 사용할 수 있다. 궁극적으로 브라우저가 원하는 결과물, 즉, string을 얻기 위해서는 추가적인 처리가 필요하다.

- 스트림은 큰 데이터를 다룰 때 데이터를 청크(chunk, 작은 단위)로 분할해 조금씩 가져오는 방식을 의미한다.

- renderToString으로 생성해야 하는 HTML의 크기가 매우 크면 어떻게 될까? 이렇게 크기가 큰 문자열을 한 번에 메모리에 올려두고 응답을 수행해야 해서 Node.js가 실행되는 서버에 큰 부담이 될 수 있다. 대신 스트림을 활용하면 이러한 큰 크기의 데이터를 청크 단위로 분리해 순차적으로 처리할 수 있다는 장점이 있다.

- 만약 스트림 대신 renderToString을 사용한다면 HTTP 응답은 거대한 HTML 파일이 완성될 때까지 기다려야 할 것이다. 그러나 스트림을 활용한다면 브라우저에 제공해야 할 큰 HTML을 작은 단위로 쪼개 연속적으로 작성함으로써 리액트 애플리케이션을 렌더링하는 Node.js 서버의 부담을 덜 수 있다. 대부분의 널리 알려진 리액트 서버 사이드 렌더링 프레임워크는 모두 renderToString 대신 renderToNodeStream을 채택하고 있다.

<br>

### 4.2.4 renderToStaticNodeStream

- renderToNodeStream과 제공하는 결과물은 동일하나, renderToStaticMarkup과 마찬가지로 리액트 자바스크립트에 필요한 리액트 속성이 제공되지 않는다. 마찬가지로 hydrate를 할 필요가 없는 순수 HTML 결과물이 필요할 때 사용되는 메서드다.

<br>

### 4.2.5 hydrate

- 정적으로 생성된 HTML에 이벤트와 핸들러를 붙여 완전한 웹페이지 결과물을 만든다.

- hydrate와 비슷한 브라우저에서만 사용되는 메서드는 render이다.

- render 함수는 컴포넌트와 HTML 요소를 인수로 받는다. 이렇게 인수로 받은 두 정보를 바탕으로 HTML의 요소에 해당 컴포넌트를 렌더링하며, 여기에 이벤트 핸들러를 붙이는 작업까지 모두 한 번에 수행한다. render는 클라이언트에서만 실행되는, 렌더링과 이벤트 핸들러 추가 등 리액트를 기반으로 한 온전한 웹페이지를 만드는 데 필요한 모든 작업을 수행한다.

- render와의 차이점은 hydrate는 기본적으로 이미 렌더링된 HTML이 있다는 가정하에 작업이 수행되고, 이 렌더링된 HTML을 기준으로 이벤트를 붙이는 작업만 실행한다는 것이다. 따라서 hydrate에 넘겨준 두번째 인수에는 이미 renderToString 등으로 렌더링된 정적인 HTML 정보가 반드시 담겨 있어야 한다. 아무것도 없는 빈 HTML에 이 정보를 렌더링하는 render와의 차이점이 바로 이것이다.

<br>

### 4.2.7 정리

- 서버 사이드 렌더링의 장점, 즉 사용자에게 더 빠른 웹페이지 결과물을 제공할 수 있다는 장점 이면에는 서버가 있으며, 이 서버라는 존재 자체가 개발자에게 더욱 부담이 된다. 또한 서버에서 HTML을 제공하는 것 분만 아니라 번들링된 자바스크립트 소스도 제공해야 하며, 적절하게 캐시도 사용해야 하는 등 많은 것들을 고려해야 한다. 더욱이 리액트 18에서는 suspense나 concurrent, 그리고 서버 사이드 렌더링과는 약간 다른 ServerComponent 등의 새로운 개념도 추가되면서 서버에서 렌더링하는 것이 더욱 복잡해졌다. 서버 사이드 렌더링 자체만으로 개발자에게는 큰 도전이다.