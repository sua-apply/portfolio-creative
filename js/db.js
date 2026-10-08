/* =========================================
   Supabase 연결 (모든 페이지 공통)
   - 아래 키는 '방문자용 공개 키'라 사이트에 보여도 괜찮아요.
     이 키로는 테이블을 직접 읽을 수 없고, 공개해 둔 함수 두 개만 부를 수 있어요.
       get_portfolio(트랙, 코드)  → 그 직무 내용만
       admin_role_links(비밀번호) → 직무별 링크 (비밀번호가 맞을 때만, 15분에 10번 틀리면 잠김)
   - 절대 넣으면 안 되는 것: service_role 키, sb_secret_ 로 시작하는 키, DB 비밀번호
   ========================================= */
(function () {
  "use strict";
  const SUPABASE_URL = "https://yuzardhmvsexygmknfcc.supabase.co";
  const SUPABASE_KEY = "sb_publishable_-CKlqet6TjLm-jlqJ003DQ_y95Rjx99";

  window.rpc = function (name, args) {
    return fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(args || {}),
    }).then((r) => {
      if (!r.ok) throw new Error(`DB ${r.status}`);
      return r.json();
    });
  };
})();
