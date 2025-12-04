# -*- coding: utf-8 -*-
"""
구글 시트 연동 테스트
gspread 라이브러리를 사용하여 구글 시트에 데이터를 입력하고 읽어옵니다.

배포 시 보안을 위해 환경 변수 GOOGLE_CREDENTIALS에서 JSON 문자열을 파싱하여 인증합니다.
"""

import os
import json
import gspread
from google.oauth2.service_account import Credentials

# 인증 설정
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

def get_credentials():
    """
    환경 변수 GOOGLE_CREDENTIALS에서 JSON 문자열을 파싱하여 인증 정보를 반환합니다.
    환경 변수가 없으면 로컬의 service_account.json 파일을 사용합니다.
    """
    google_credentials_json = os.environ.get('GOOGLE_CREDENTIALS')
    
    if google_credentials_json:
        # 환경 변수에서 JSON 문자열 파싱
        print("📌 환경 변수 GOOGLE_CREDENTIALS에서 인증 정보 로드")
        credentials_info = json.loads(google_credentials_json)
        credentials = Credentials.from_service_account_info(
            credentials_info,
            scopes=SCOPES
        )
    else:
        # 로컬 파일 사용 (개발 환경)
        print("📌 로컬 service_account.json 파일에서 인증 정보 로드")
        credentials = Credentials.from_service_account_file(
            'service_account.json',
            scopes=SCOPES
        )
    
    return credentials

def main():
    try:
        # 1. 인증
        print("🔐 구글 시트 인증 중...")
        credentials = get_credentials()
        client = gspread.authorize(credentials)
        print("✅ 인증 성공!")

        # 2. 구글 시트 열기
        print("\n📊 구글 시트 연결 중...")
        spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1ZldvNQtXf51oKB3IjEuwQuaJTkZVJofjf4tSDfILUM4/edit?gid=154773805#gid=154773805'
        spreadsheet = client.open_by_url(spreadsheet_url)
        
        # gid=154773805 시트 선택
        worksheet = spreadsheet.get_worksheet_by_id(154773805)
        print(f"✅ 시트 연결 성공! (시트 이름: {worksheet.title})")

        # 3. A1 셀에 'Hello Cursor' 입력
        print("\n✏️ A1 셀에 'Hello Cursor' 입력 중...")
        worksheet.update('A1', 'Hello Cursor')
        print("✅ 입력 완료!")

        # 4. A1 셀 값 읽어오기
        print("\n📖 A1 셀 값 읽어오는 중...")
        value = worksheet.acell('A1').value
        print(f"✅ A1 셀 값: {value}")

        print("\n🎉 모든 작업이 완료되었습니다!")

    except FileNotFoundError:
        print("❌ 오류: service_account.json 파일을 찾을 수 없습니다.")
        print("   - 로컬 실행: 같은 폴더에 service_account.json 파일이 있는지 확인하세요.")
        print("   - 클라우드 배포: GOOGLE_CREDENTIALS 환경 변수를 설정하세요.")
    except json.JSONDecodeError:
        print("❌ 오류: GOOGLE_CREDENTIALS 환경 변수의 JSON 형식이 올바르지 않습니다.")
        print("   JSON 문자열이 올바른지 확인하세요.")
    except gspread.exceptions.SpreadsheetNotFound:
        print("❌ 오류: 스프레드시트를 찾을 수 없습니다.")
        print("   서비스 계정 이메일에 시트 공유 권한이 있는지 확인하세요.")
    except gspread.exceptions.WorksheetNotFound:
        print("❌ 오류: 해당 시트(gid=154773805)를 찾을 수 없습니다.")
        print("   시트 ID가 올바른지 확인하세요.")
    except Exception as e:
        print(f"❌ 오류 발생: {e}")

if __name__ == "__main__":
    main()

