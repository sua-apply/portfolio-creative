/* =========================================
   이력 데이터 (About Me · Credentials)
   - 여기에 한 줄씩 추가만 하면 됩니다. 순서는 상관없어요 → 최신순 자동 정렬
   - 날짜는 "YYYY.MM" 형식 (예: "2024.03")
   - end를 "" 로 두면 "현재"로 표시 (재직 중 / 수강 중)
   - 경력·교육은 4개, 자격증은 3개 연도까지 보이고 나머지는 "더보기"로 접힘
     → 숫자는 js/main.js 상단 LIMITS 에서 변경
   ========================================= */
const RESUME = {

  /* 학력 (고정) */
  education: [
    { start: "2018.03", end: "2024.02", school: "OO대학교", major: "컴퓨터공학부, 정보통신학부(복수전공)", status: "졸업" },
    { start: "2015.03", end: "2018.01", school: "OO고등학교", major: "", status: "졸업" }
  ],

  /* 경력 */
  experience: [
    { start: "2024.03", end: "", company: "ABC 스튜디오", role: "프로덕트 디자이너", desc: "B2C 앱 리디자인, 디자인 시스템 운영" },
    { start: "2022.03", end: "2024.02", company: "XYZ 에이전시", role: "브랜드 디자이너", desc: "F&B·리테일 브랜드 BI/BX 12건" }
  ],

  /* 교육 · 수료 */
  training: [
    { start: "2026.03", end: "2026.12", title: "경기도기술학교 디자인 과정", org: "경기도일자리재단", desc: "480시간 · 사용자 리서치, 프로토타이핑" },
    { start: "2022.09", end: "2022.10", title: "Figma 디자인 시스템 워크숍", org: "OO디자인랩", desc: "컴포넌트 · 토큰 설계" },
    { start: "2021.01", end: "2021.02", title: "브랜드 아이덴티티 디자인 과정", org: "OO디자인센터", desc: "BI 개발 프로세스" }
  ],

  /* 수상 (1개면 크게, 여러 개면 2열 카드) */
  awards: [
    { date: "2024.10", title: "OO 디자인 어워드 브랜드 부문 입선", org: "OO디자인진흥원", desc: "Aurora Coffee 브랜드 아이덴티티 프로젝트로 수상" }
  ],

  /* 자격증 (연도별로 자동 묶음) */
  certificates: [
    { date: "2026.10", name: "전자출판기능사", org: "한국산업인력공단" },
    { date: "2022.08", name: "ACP InDesign", org: "Adobe" },
    { date: "2022.04", name: "ACP Photoshop", org: "Adobe" },
    { date: "2022.04", name: "ACP Illustrator", org: "Adobe" },
    { date: "2022.01", name: "OPIc IM2", org: "ACTFL" },
    { date: "2021.11", name: "시각디자인산업기사", org: "한국산업인력공단" },
    { date: "2021.06", name: "컬러리스트산업기사", org: "한국산업인력공단" },
    { date: "2020.09", name: "GTQi 일러스트 1급", org: "한국생산성본부" },
    { date: "2020.06", name: "GTQ 포토샵 1급", org: "한국생산성본부" },
    { date: "2019.12", name: "웹디자인개발기능사", org: "한국산업인력공단" },
    { date: "2019.08", name: "컴퓨터그래픽스운용기능사", org: "한국산업인력공단" },
    { date: "2018.07", name: "컴퓨터활용능력 2급", org: "대한상공회의소" }
  ]
};
