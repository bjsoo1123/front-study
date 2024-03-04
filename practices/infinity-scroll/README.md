This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### 개발환경
- Node `v18.19.0`
- Typescript `v5.3.3`
- [React](https://ko.legacy.reactjs.org/docs/hooks-intro.html) `v18.2.0`
- [Next](https://nextjs.org/docs) `v14.0.3`
- [Lodash](https://lodash.com/docs/4.17.15) `v4.17.21`
- [Tailwindcss](https://tailwindcss.com/docs/installation) `v3.4.1`


> 자신의 닉네임으로 브런치 생성 후 해당 브런치에서 개발 및 push. <span style="color: red">main 브런치로 push X</span>
> ``````
> # 브런치 생성 및 이동
> git checkout -b [nickname]
>
> # 개발 완료 후 push
> git push origin [nickname]
> ``````

### 서버 실행
```bash
# 경로 확인
pwd # ~~~/front-study/practices/infinity-scroll

# 패키지 설치
yarn

# 서버 실행
yarn dev 
```

- 서버 실행 후 [http://localhost:3000](http://localhost:3000)로 접근

### 파일 구성
- `app/layout.tsx` : 전체적인 프로젝트 틀 담당 (작업할 필요 x)
- `app/page.tsx` : 프로젝트 base(index) page (modal open 상태값 관리)
- `app/components/modal.tsx` : modal 구성하는 페이지 (<span style="color: green">작업 필요</span>)
- `app/components/infiniteScroll.tsx` : infinity scroll 컴포넌트 파일 (<span style="color: green">작업 필요</span>)
- `app/components/events/modalTouchEvents.ts` : modal touch event 관련 파일 (작업할 필요 x)
---
- `app/constants/202004.ts` : 지역구 리스트 (2020.04 기준)
- `tailwind.config.ts` : 커스텀한 tailwind style 확인 가능 (작업할 필요 x) 

### 결과물

<img src="https://github.com/bjsoo1123/infinity_scroll_example_pub/assets/48274638/bef257ab-9353-4fad-96c1-76149251b02b" width="50%" />

### 이슈

1. webstorm으로 작업 중 아래와 같은 에러가 발생한다면 [여기](https://velog.io/@h_jinny/ESlint-SyntaxError-Failed-to-load-parser-typescript-eslintparser-declared-in-.eslintrc.json-%EC%97%90%EB%9F%AC) 참고
<img src="https://github.com/bjsoo1123/infinity_scroll_example_pub/assets/48274638/54f75c95-8b8a-4f42-a2c6-28a39208a5d2" width="60%" />

