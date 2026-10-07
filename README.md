# portfolio-creative

박영희(PARK Younghee)의 CREATIVE 포트폴리오입니다. Design · Marketing · PR

- `index.html`: 소개 (INFO · SKILL · CAREER)
- `projects.html`: 프로젝트 (Selected Work)

## 직무별 링크

주소 뒤에 `?role=`을 붙이면 소개 문구, 스킬, 프로젝트 순서와 상세 화면 형태가 그 직무에 맞게 바뀝니다. 메인에서 프로젝트 페이지로 넘어가도 직무가 유지됩니다.

| 직무 | 링크 |
|---|---|
| Design | `https://[아이디].github.io/portfolio-creative/?role=design` |
| Marketing | `https://[아이디].github.io/portfolio-creative/?role=marketing` |
| PR | `https://[아이디].github.io/portfolio-creative/?role=pr` |

직무별 상세 화면

- **design**: 큰 메인 비주얼, 디테일 이미지, 컬러 팔레트
- **marketing**: 큰 성과 숫자 3개, 목표 · 전략 · 결과
- **pr**: 기사 · 보도자료 캡처, 보도 건수와 노출 수치

## 내용 고치기

모든 내용은 `assets/js/data.js` 한 파일에 있습니다. `[ ]`로 표시된 곳을 채우면 됩니다.

- `profile`: 이름, 연락처, 학력, 링크, 프로필 사진 경로
- `skills`: 직무별 할 수 있는 일과 툴
- `career`: 경력, 학력, 자격증 · 수상
- `projects`: 프로젝트와 직무별 상세 내용

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
```

빌드 과정 없이 HTML, CSS, JavaScript만으로 동작합니다.

## 배포 (GitHub Pages)

Settings → Pages → Build and deployment에서 Source를 **Deploy from a branch**, Branch를 **main / (root)**로 저장합니다.
