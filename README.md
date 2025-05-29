
# 💰 CashBook

**CashBook**는 Java(Spring Boot)와 HTML/CSS/JS로 구현된 **간단한 웹 기반 가계부 애플리케이션**입니다.  
수입과 지출을 기록하고, 카테고리별로 관리할 수 있는 기능을 제공합니다.

---

## 📁 프로젝트 구조

```
CashBook/
├── src/
│   ├── main/
│   │   ├── java/com/kwu/CashBook/
│   │   │   ├── controller/     # API 컨트롤러
│   │   │   ├── mapper/         # MyBatis 매퍼 인터페이스
│   │   │   ├── model/          # 데이터 모델 (VO/DTO)
│   │   │   └── CashBookApplication.java  # SpringBoot 시작점
│   │   └── resources/
│   │       ├── mapper/         # MyBatis XML 매퍼 파일
│   │       ├── static/
│   │       │   ├── css/
│   │       │   └── js/
│   │       │       └── app.js  # 프론트엔드 JS 로직
│   │       ├── index.html      # 메인 페이지
│   │       └── application.properties # 설정 파일
```

---

## 🚀 실행 방법

### 1. 프로젝트 클론
```bash
git clone https://github.com/clickang/CashBook.git
cd CashBook
```

### 2. Gradle 프로젝트로 실행
- Java 11+ 이상 설치 필요
- Gradle 빌드 후 실행

```bash
./gradlew bootRun
```

> 또는 `CashBookApplication.java`를 IDE(Spring Tool Suite, IntelliJ 등)에서 실행

---

## 🌐 주요 기능

- 💵 수입/지출 항목 등록
- 📂 카테고리별 분류 관리
- 📊 통계 페이지(프론트엔드로 표시)
- 🗂️ MyBatis 기반 DB 연동

---

## ⚙️ 기술 스택

- **Backend**: Java 11, Spring Boot, MyBatis
- **Frontend**: HTML, CSS, JavaScript
- **Build Tool**: Gradle
- **Database**: Oracle (또는 설정에 따라 변경 가능)

---

## 📌 기여 방법

1. 이 저장소를 포크합니다.
2. 새로운 브랜치를 생성합니다: `git checkout -b feature/기능명`
3. 커밋 후 푸시합니다: `git push origin feature/기능명`
4. Pull Request를 생성합니다.

---

## 📄 라이선스

해당 프로젝트는 MIT 라이선스를 따릅니다. 자유롭게 수정 및 배포 가능합니다.
