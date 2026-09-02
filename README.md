# KIM HEERIN 포트폴리오

김희린 디자이너의 GitHub Pages용 정적 포트폴리오입니다. 별도의 설치나 빌드 없이 `index.html`을 열면 실행됩니다.

## GitHub Pages에 올리는 방법

1. GitHub에서 `kimheerin.github.io` 저장소를 만듭니다.
2. 이 폴더 안의 파일과 `images` 폴더를 저장소 최상단에 업로드합니다.
3. **Commit changes**를 누릅니다.
4. 저장소의 **Settings → Pages**에서 `Deploy from a branch`, `main`, `/root`를 선택합니다.

## 새 프로젝트 추가 방법

1. `images`에 `project04` 폴더를 만듭니다.
2. `cover.jpg`를 업로드합니다.
3. 상세 이미지(`01.jpg`, `02.jpg` 등)를 업로드합니다.
4. `projects.js` 배열에 아래와 같은 객체를 추가합니다.
5. GitHub에서 **Upload files**를 선택해 변경 파일을 올립니다.
6. **Commit changes**를 누릅니다.

```js
{
  id: "new-project",
  title: "NEW PROJECT",
  year: "2026",
  category: "Graphic Design",
  cover: "images/project04/cover.jpg",
  images: [
    "images/project04/01.jpg",
    "images/project04/02.jpg"
  ],
  description: "Project description.",
  video: null
}
```

새 프로젝트를 사이트 상단에 보여주려면 `projects.js` 배열의 가장 위에 추가하세요. 프로젝트 번호는 배열 순서에 따라 자동으로 생성됩니다.

기존 이미지를 같은 파일명으로 교체하면 코드 수정 없이 사이트 이미지가 변경됩니다. 영상이 있을 때는 `video: "videos/project04.mp4"`처럼 경로를 입력하고, 없을 때는 `video: null`을 유지하세요.

## 디자인 수정

색상, 글꼴, 여백은 `style.css` 맨 위의 `:root` 변수에서 한 번에 바꿀 수 있습니다. 본문은 Nanum Gothic, 큰 제목은 Archivo Black을 사용하며 웹폰트가 로드되지 않아도 시스템 대체 글꼴로 표시됩니다.
