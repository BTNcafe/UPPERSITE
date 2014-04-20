VERSIONS
========
1.3.1 (2014. 4. 20)
- 안드로이드 4.4 미만 버젼의 기본 웹 브라우저에서 통신 연결 오류 해결
- 멀티코어 지원 일시적으로 중단
- CONFIG.flashPolicyServerPort 기본 값 CONFIG.port + 1955로 설정
- INFO.getBrowserInfo, bowser( https://github.com/ded/bowser )에 의존하도록 변경

1.3 (2014. 4. 17)
- LOOP를 다시 COMMON으로 회귀, 성능 개선
- COMMON/INTEGER, COMMON/REAL 추가
- REQUEST의 callback에 넘어가는 파라미터가 method, params, paramStr, headers, response로, REQUEST_JSON의 callback에 넘어가는 파라미터가 method, params, data, headers, response로 변경
- PUT, PUT_JSON, DELETE, DELETE_JSON이 추가
- UPPERSITE 부팅 후 명령어를 입력받을 수 있게 REPL(Read-Eval-Print-Loop)기능 추가(SERVER_CONFIG.isNotUsingREPL을 true로 두어 끌 수 있음)
- BOX 이름에 점(.)이 들어가도 인식되도록 개선
- REFRESH 기능 추가
- 실시간 처리 Redis 연동
- 멀티코어 CPU 지원으로 인한 성능 개선
- iOS/Mac Safari에서 캐시되지 않는 버그 해결
- 기본 BOX 폴더 내에 ERROR.html 파일을 만들면 서버에서 오류가 발생하거나 없는 리소스일 경우 해당 페이지가 출력되는 기능 추가
- Flash Policy File을 제공하는 Server의 포트를 지정하는 CONFIG.flashPolicyServerPort 설정 추가
- isNotUsingREPL -> isUsingREPL로 변경

1.2.13.2 (2014. 3. 20)
- SERVER_CONFIG.isDBLogMode가 true일 때 DB Log 출력하도록 변경

1.2.13.1 (2014. 3. 18)
- 부팅 오류 버그 해결

1.2.13 (2014. 3. 17)
- isDevMode가 true일 때 DB 로그 출력
- createData와 createDataSafely가 createData로, updateData와 updateDataSafely가 updateData로, removeData와 removeDataSafely가 removeData로 통합

1.2.12 (2014. 3. 14)
- 1.2.11에서 업그레이드 시 반드시 MongoDB Shell에서 모든 컬렉션에 대해 다음 명령을 실행해 주시기 바랍니다. 컬렉션.update({\_isEnable : true}, { $set : {\__IS_ENABLED : true} }, false, true)
- IE5.5 iepngfix_tilebg 버그 제거
- createValid, updateValid 없을 경우 발생하는 MODEL에서의 오류 해결

1.2.11 (2014. 3. 11)
- 다른 언어 지원 (MULTI_LANG_SUPPORT)

1.2.10 (2014. 3. 4)
- DELAY func에 delay를 pass
- MODEL getName
- datas -> dataSet으로 모두 변경
- CHECK_IS_EMPTY_DATA 추가

1.2.9 (2014. 3. 2)
- BTNcafe에서 UPPERCASE를 fork 하여 웹 사이트 개발 전용으로 발전시킨 UPPERSITE를 외부에 공개
