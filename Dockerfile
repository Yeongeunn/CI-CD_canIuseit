#Node.js 이미지를 기반으로 함
FROM node:18

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 애플리케이션 소스 코드 복사
COPY . .

# 이동
WORKDIR /usr/src/app/backend

# 필요한 패키지 설치
RUN npm install 

# 젠킨스에 존재하는 .env 파일을 컨테이너로 복사
COPY .env .env 

# 서버 실행 포트 공개
EXPOSE 3000

# 서버 시작 명령어
CMD ["node", "index.js"]
