# 밥 방해요소 차단기

급식 사이트 밥.net(`xn--rh3b.net`)의 광고를 전부 숨기는 Chrome 확장 프로그램 (Manifest V3).

> 비공식 도구. 밥.net 및 그 운영자와 관련 없음.

## 설치

1. `chrome://extensions` 열기
2. 우측 상단 **개발자 모드** 켜기
3. **압축해제된 확장 프로그램을 로드** → 이 폴더 선택

## 차단 방식

| 층 | 파일 | 대상 |
|---|---|---|
| 네트워크 | `rules.json` | 카카오 애드핏(`t1.daumcdn.net/kas`), 애드센스 등 광고 도메인, 제휴 배너 이미지(`/c/…`, `/ads/…`), 노출/클릭 집계(`api.밥.net/c/hit`), 외부 iframe |
| CSS | `content.css` | 광고 칸 `<aside>`(애드핏 `ins.kakao_ad_area`, 제휴 `a[data-creative]`, 안내 문구, 320×100 / 728×90 프레임) |
| JS | `content.js` | 위가 놓친 것: 표준 배너 크기(320×100, 728×90, 300×250 …)의 iframe/이미지/링크를 감지해 칸째 숨김 |

사이트가 클래스·경로를 바꿔도 크기 기반 JS가 잡도록 3중으로 둠.

## 팝업

툴바 아이콘 클릭 → 보호 상태, **보호 일시 중지/재개** 버튼, 이 페이지에서 차단한 광고 칸 수, 누적 차단 수.
일시 중지하면 네트워크 규칙 끄고(`updateEnabledRulesets`) 페이지에 `html.bap-off` 붙여 CSS·JS 차단 해제, 탭 새로고침.

아이콘 원본은 `icons/icon.svg`.

## 스토어 제출

등록 정보·권한 사유·개인정보 답변: [`store/STORE.md`](store/STORE.md). 스크린샷: `store/screenshot-1.jpg`.

```bash
zip -r store/bap-blocker.zip manifest.json rules.json content.css content.js popup.html popup.css popup.js background.js icons/icon-16.png icons/icon-32.png icons/icon-48.png icons/icon-128.png
```
