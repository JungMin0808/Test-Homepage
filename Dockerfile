# Node.js 20 LTS 이미지 사용
FROM node:20-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 포트 설정 (Cloud Run은 PORT 환경변수 사용)
ENV PORT=8080
EXPOSE 8080

# 서버 실행
CMD ["node", "server.js"]


