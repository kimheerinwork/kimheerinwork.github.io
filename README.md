# KIM HEERIN — VISUAL ARCHIVE

김희린 디자이너의 GitHub Pages용 인터랙티브 포트폴리오입니다. 별도 설치나 빌드 없이 `index.html`을 열면 실행됩니다.

## 사이트 구성

- 첫 방문: 작품 대표 이미지가 차례로 떨어져 쌓이는 인트로
- 클릭: 작품이 지정된 위치로 펼쳐지며 Infinite Canvas 완성
- 데스크톱: 드래그·스크롤 이동, `Ctrl/Cmd + 휠` 확대/축소, `+` `-` `0` 단축키
- 모바일: 세로형 Editorial Archive
- ARCHIVE: 전체 작품 목록과 카테고리 필터
- ABOUT: 작가 소개 및 연락처
- 작품 클릭: 기존 한국어·영어 설명, 이미지, 영상 상세 화면

## 새 프로젝트 추가

1. `images/project06`처럼 새 폴더를 만듭니다.
2. 대표 이미지 `cover.jpg`와 상세 이미지 `01.jpg`, `02.jpg` 등을 넣습니다.
3. `projects.js`에서 기존 객체 하나를 복사합니다.
4. 제목, 연도, 카테고리, 설명, 도구, 이미지 경로를 바꿉니다.

```js
{
  id: "new-project",
  title: "한국어 제목",
  subtitle: "English Title",
  year: "2026",
  date: "2026.01.01",
  tools: ["Adobe Illustrator"],
  category: "Graphic Design / Editorial",
  cover: "images/project06/cover.jpg",
  coverAlt: "대표 이미지 설명",
  canvas: { x: 2100, y: 1200, size: "large", rotation: -1 },
  images: ["images/project06/01.jpg"],
  descriptionKo: "한국어 설명",
  descriptionEn: "English description",
  video: null
}
```

프로젝트 번호, 인트로 이미지, 캔버스 작품, 모바일 목록, 아카이브 필터와 상세페이지는 배열 순서대로 자동 생성됩니다.

## Canvas 위치와 크기

- `canvas.x`, `canvas.y`: 4000 × 2800 작업판 안에서의 위치
- `canvas.size`: `hero`, `wide`, `large`, `medium`, `portrait`
- `canvas.rotation`: 작품의 기울기 각도

배열의 위치를 옮기면 프로젝트 번호와 다음 작품 순서가 함께 바뀝니다. 객체를 삭제하면 모든 화면에서 자동으로 제거됩니다.

## 이미지와 영상

- 대표 이미지 교체: 기존 `cover.jpg`를 같은 이름으로 교체
- 상세 이미지 추가: `images` 배열에 경로 추가
- 영상 추가: `video: "videos/project06.mp4"`
- 영상이 없을 때: `video: null`

## GitHub Pages 배포

저장소 최상단에 이 폴더의 파일과 `images`, `videos` 폴더를 업로드한 뒤 GitHub의 **Settings → Pages**에서 `main` 브랜치의 `/root`를 선택합니다.

## 디자인 수정

색상과 글꼴은 `style.css` 상단의 `:root` 변수에서 바꿀 수 있습니다. 현재 배경은 `#F4F4F1`, 기본 글자는 `#111111`, 포인트는 muted mint `#AEC5C0`이며 Inter, Pretendard, Cormorant Garamond를 사용합니다.
