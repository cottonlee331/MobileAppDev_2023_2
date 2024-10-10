readme_icmd_tc.txt

필요 install 커맨드:
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-dropdown-picker
npm install @react-native-async-storage/async-storage
npm i react-native-calendars

테스트케이스:
인터파크 티켓 예매페이지의 정보 중 일부 이용
- 공연명: 네이처 오브 포겟팅, 스모크, 마리 퀴리, 노트르담 드 파리, 미드나잇:액터뮤지션

- <네이처 오브 포겟팅> 샘플 TC 정보:
 {"title":"네이처 오브 포겟팅",
"place":"대학로 아트원씨어터 2관",
"image":"https://ticketimage.interpark.com/Play/image/large/23/23015267_p.gif","https://pbs.twimg.com/media/F-8Ac0GbcAAJntr?format=jpg&name=large","https://pbs.twimg.com/media/F-8A6hgboAAjfuh?format=jpg&name=large"],
"runningTime":"70",
"cost":[{"seat":"R","cost":"60000"},{"seat":"S","cost":"45000"}],
"discount":[{"name":"다시 만난 NOF 할인","num":"15000","type":{"label":"원","value":"won"}},{"name":"재관람  할인","num":"20","type":{"label":"%","value":"percentage"}}],
"character":[{"charac":"톰","cast":["김지철","전성우"]},{"charac":"이자벨라/소피","cast":["김주연","전혜주"]}]}