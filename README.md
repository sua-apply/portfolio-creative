# portfolio-creative

박영희(PARK Younghee)의 CREATIVE 포트폴리오입니다. Design · Marketing · PR

- `index.html`: 소개 (INFO · SKILL · CAREER)
- `projects.html`: 프로젝트 (Selected Work)

## 직무별로 따로 보이기

이 사이트는 한 번에 한 직무만 보여줍니다 (design, marketing, pr).
주소 뒤의 `?v=코드`로 어떤 직무를 보여줄지 정하고, 방문자 화면에는 직무를 바꾸는 버튼이 없습니다.
코드는 `assets/js/data.js`의 `roles`에 있는 `code` 값입니다.

직무별 링크 복사와 관리자 모드는 따로 연결되지 않은 관리 페이지에서 비밀번호를 넣고 사용합니다.

## 내용 고치기

모든 내용은 `assets/js/data.js` 한 파일에 있습니다. `[ ]`로 표시된 곳을 채우면 됩니다.

- `profile`: 이름, 연락처, 학력, 링크, 프로필 사진 경로
- `skills`: 직무별 할 수 있는 일과 툴
- `career`: 경력, 학력, 자격증 · 수상
- `projects`: 프로젝트와 직무별 상세 내용. `roles`에 적힌 직무에서만 보입니다.

이미지는 `assets/img/` 폴더를 만들어 넣고 경로를 적으면 됩니다.

## 구조

```
index.html
projects.html
assets/css/style.css
assets/js/data.js      ← 내용
assets/js/common.js    ← 직무 전환, 공통 효과
assets/js/home.js      ← 소개 페이지
assets/js/projects.js  ← 프로젝트 페이지
assets/js/admin-bar.js, manage.js ← 관리자 기능
```

빌드 과정 없이 HTML, CSS, JavaScript만으로 동작합니다.

## 배포 (GitHub Pages)

Settings → Pages → Build and deployment에서 Source를 **Deploy from a branch**, Branch를 **main / (root)**로 저장합니다.
