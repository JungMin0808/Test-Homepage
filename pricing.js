const pricingData = {
  "seasonCalendar": [
    {
      "label": "겨울 비수기",
      "start": "2025-12-01",
      "end": "2025-12-19",
      "season": "offSeason"
    },
    {
      "label": "겨울 성수기",
      "start": "2025-12-20",
      "end": "2026-03-01",
      "season": "peakSeason"
    }
  ],
  "lodgingPackages": {
    "types": [
      {
        "id": "standard_pension",
        "name": "프랜드A",
        "group": "프랜드",
        "baseGuests": 4,
        "maxGuests": 4,
        "extraGuestFee": 10000,
        "bbqPrice": 35000,
        "description": "온돌원룸 / 화장실1",
        "reservationUrl": "http://www.riverfield.co.kr/reser2.htm",
        "sharedRates": {
          "weekday": 60000,
          "friday": 60000,
          "weekend": 80000
        }
      },
      {
        "id": "premium_pension",
        "name": "프랜드B",
        "group": "프랜드",
        "baseGuests": 4,
        "maxGuests": 6,
        "extraGuestFee": 10000,
        "bbqPrice": 35000,
        "description": "온돌원룸 / 14평 / 화장실1",
        "reservationUrl": "https://booking.ddnayo.com/booking-calendar-status?accommodationId=1534",
        "sharedRates": {
          "weekday": 60000,
          "friday": 60000,
          "weekend": 100000
        }
      },
      {
        "id": "couple_suite",
        "name": "프랜드C",
        "group": "프랜드",
        "baseGuests": 4,
        "maxGuests": 6,
        "extraGuestFee": 10000,
        "bbqPrice": 0,
        "description": "투베드 / 복층 / 화장실1",
        "reservationUrl": "https://booking.ddnayo.com/booking-calendar-status?accommodationId=1503",
        "sharedRates": {
          "weekday": 70000,
          "friday": 70000,
          "weekend": 100000
        }
      },
      {
        "id": "lodging_1763222136161",
        "name": "프랜드D",
        "baseGuests": 6,
        "extraGuestFee": 10000,
        "sharedRates": {
          "weekday": 80000,
          "friday": 80000,
          "weekend": 120000
        },
        "group": "프랜드",
        "maxGuests": 8,
        "description": "온돌원룸 / 화장실1",
        "reservationUrl": "http://riverpension.net/online.htm",
        "bbqPrice": 35000
      },
      {
        "id": "lodging_1763222136329",
        "name": "프랜드E",
        "baseGuests": 6,
        "extraGuestFee": 10000,
        "sharedRates": {
          "weekday": 80000,
          "friday": 80000,
          "weekend": 140000
        },
        "group": "프랜드",
        "maxGuests": 6,
        "bbqPrice": 35000,
        "description": "온돌투룸 / 화장실1",
        "reservationUrl": "http://riverpension.net/online.htm"
      },
      {
        "id": "lodging_1763222136815",
        "name": "커플A",
        "baseGuests": 2,
        "extraGuestFee": 10000,
        "sharedRates": {
          "weekday": 50000,
          "friday": 50000,
          "weekend": 80000
        },
        "group": "커플",
        "maxGuests": 4,
        "bbqPrice": 0,
        "description": "원베드 / 복층 / 화장실1",
        "reservationUrl": "https://booking.ddnayo.com/booking-calendar-status?accommodationId=1503"
      },
      {
        "id": "lodging_1763222136981",
        "name": "커플B",
        "baseGuests": 2,
        "extraGuestFee": 10000,
        "sharedRates": {
          "weekday": 50000,
          "friday": 50000,
          "weekend": 80000
        },
        "group": "커플",
        "maxGuests": 2,
        "bbqPrice": 35000,
        "description": "침대원룸 / 화장실1",
        "reservationUrl": "http://riverpension.net/online.htm"
      },
      {
        "id": "lodging_1763222137146",
        "name": "커플C",
        "baseGuests": 2,
        "extraGuestFee": 15000,
        "sharedRates": {
          "weekday": 50000,
          "friday": 50000,
          "weekend": 80000
        },
        "group": "커플",
        "maxGuests": 4,
        "description": "매트원룸 / 화장실1",
        "reservationUrl": "https://namisumremember.co.kr/reservation"
      },
      {
        "id": "lodging_1763222137313",
        "name": "커플D",
        "baseGuests": 2,
        "extraGuestFee": 20000,
        "sharedRates": {
          "weekday": 60000,
          "friday": 60000,
          "weekend": 80000
        },
        "group": "커플",
        "maxGuests": 4,
        "description": "온돌투룸 / 10평",
        "reservationUrl": "https://booking.pension.onda.me/137685/calendar"
      },
      {
        "id": "lodging_1763222137533",
        "name": "커플E",
        "baseGuests": 2,
        "extraGuestFee": 10000,
        "sharedRates": {
          "weekday": 60000,
          "friday": 60000,
          "weekend": 90000
        },
        "group": "커플",
        "maxGuests": 3,
        "description": "자차전용 / 침대원룸 / 10평",
        "reservationUrl": "https://booking.ddnayo.com/booking-calendar-status?accommodationId=102847"
      },
      {
        "id": "lodging_1763222137833",
        "name": "투룸/복층A",
        "baseGuests": 6,
        "extraGuestFee": 10000,
        "sharedRates": {
          "weekday": 100000,
          "friday": 100000,
          "weekend": 180000
        },
        "group": "투룸",
        "maxGuests": 12,
        "bbqPrice": 35000,
        "description": "온돌투룸 / 화장실2",
        "reservationUrl": "http://www.riverfield.co.kr/reser2.htm"
      },
      {
        "id": "lodging_1763222138266",
        "name": "투룸/복층B",
        "baseGuests": 6,
        "extraGuestFee": 10000,
        "sharedRates": {
          "weekday": 100000,
          "friday": 100000,
          "weekend": 180000
        },
        "group": "투룸",
        "maxGuests": 12,
        "bbqPrice": 35000,
        "description": "독채투룸 / 화장실1",
        "reservationUrl": "http://www.riverfield.co.kr/reser2.htm"
      },
      {
        "id": "lodging_1763222138451",
        "name": "투룸/복층C",
        "baseGuests": 8,
        "extraGuestFee": 10000,
        "sharedRates": {
          "weekday": 150000,
          "friday": 150000,
          "weekend": 280000
        },
        "group": "투룸",
        "maxGuests": 15,
        "bbqPrice": 35000,
        "description": "온돌쓰리룸 / 화장실3",
        "reservationUrl": "http://www.riverfield.co.kr/reser2.htm"
      },
      {
        "id": "lodging_1763222138621",
        "name": "투룸/복층D",
        "baseGuests": 6,
        "extraGuestFee": 10000,
        "sharedRates": {
          "weekday": 110000,
          "friday": 110000,
          "weekend": 170000
        },
        "group": "투룸",
        "maxGuests": 10,
        "bbqPrice": 35000,
        "description": "온돌투룸 / 25평 / 화장실1",
        "reservationUrl": "https://booking.ddnayo.com/booking-calendar-status?accommodationId=1534"
      },
      {
        "id": "lodging_1763222138797",
        "name": "투룸/복층E",
        "baseGuests": 6,
        "extraGuestFee": 20000,
        "sharedRates": {
          "weekday": 240000,
          "friday": 290000,
          "weekend": 340000
        },
        "group": "투룸",
        "maxGuests": 12,
        "description": "거실+투룸복층 / 화장실3",
        "reservationUrl": "https://pcmap.place.naver.com/accommodation/1051501243/room?from=map&amp;from=map&amp;fromPanelNum=1&amp;additionalHeight=76&amp;timestamp=202511292053&amp;locale=ko&amp;svcName=map_pcv5&businessCategory=pension"
      }
    ]
  },
  "offSeason": {
    "label": "비수기",
    "categories": [
      {
        "name": "리프트 + 렌탈권",
        "groups": [
          {
            "name": "대인",
            "items": [
              {
                "id": "liftRental_weekday_adult_2h",
                "name": "2시간",
                "price": 41000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_adult_3h",
                "name": "3시간",
                "price": 44000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_adult_4h",
                "name": "4시간",
                "price": 46000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_adult_5h",
                "name": "5시간",
                "price": 49000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_adult_6h",
                "name": "6시간",
                "price": 51000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_adult_7h",
                "name": "7시간",
                "price": 54000,
                "unit": "매"
              }
            ]
          },
          {
            "name": "학생",
            "items": [
              {
                "id": "liftRental_weekday_student_2h",
                "name": "2시간",
                "price": 40000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_student_3h",
                "name": "3시간",
                "price": 43000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_student_4h",
                "name": "4시간",
                "price": 45000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_student_5h",
                "name": "5시간",
                "price": 48000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_student_6h",
                "name": "6시간",
                "price": 50000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_student_7h",
                "name": "7시간",
                "price": 53000,
                "unit": "매"
              }
            ]
          },
          {
            "name": "소인",
            "items": [
              {
                "id": "liftRental_weekday_child_2h",
                "name": "2시간",
                "price": 35000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_child_3h",
                "name": "3시간",
                "price": 37000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_child_4h",
                "name": "4시간",
                "price": 39000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_child_5h",
                "name": "5시간",
                "price": 41000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_child_6h",
                "name": "6시간",
                "price": 43000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_child_7h",
                "name": "7시간",
                "price": 45000,
                "unit": "매"
              }
            ]
          }
        ],
        "weekendGroups": [
          {
            "name": "대인",
            "items": [
              {
                "id": "liftRental_weekend_adult_2h",
                "name": "2시간",
                "price": 48000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_adult_3h",
                "name": "3시간",
                "price": 51000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_adult_4h",
                "name": "4시간",
                "price": 53000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_adult_5h",
                "name": "5시간",
                "price": 56000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_adult_6h",
                "name": "6시간",
                "price": 58000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_adult_7h",
                "name": "7시간",
                "price": 61000,
                "unit": "매"
              }
            ]
          },
          {
            "name": "학생",
            "items": [
              {
                "id": "liftRental_weekend_student_2h",
                "name": "2시간",
                "price": 47000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_student_3h",
                "name": "3시간",
                "price": 50000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_student_4h",
                "name": "4시간",
                "price": 52000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_student_5h",
                "name": "5시간",
                "price": 55000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_student_6h",
                "name": "6시간",
                "price": 57000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_student_7h",
                "name": "7시간",
                "price": 60000,
                "unit": "매"
              }
            ]
          },
          {
            "name": "소인",
            "items": [
              {
                "id": "liftRental_weekend_child_2h",
                "name": "2시간",
                "price": 40000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_child_3h",
                "name": "3시간",
                "price": 42000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_child_4h",
                "name": "4시간",
                "price": 44000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_child_5h",
                "name": "5시간",
                "price": 46000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_child_6h",
                "name": "6시간",
                "price": 48000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_child_7h",
                "name": "7시간",
                "price": 50000,
                "unit": "매"
              }
            ]
          }
        ]
      },
      {
        "name": "장비 · 보호장비 렌탈",
        "items": [
          {
            "id": "skiRental",
            "name": "일반의류 렌탈(2~3시간)",
            "price": 10000,
            "unit": "세트"
          },
          {
            "id": "boardRental",
            "name": "일반의류 렌탈(4~5시간)",
            "price": 10000,
            "unit": "세트"
          },
          {
            "id": "basicWearRental",
            "name": "일반의류 렌탈(6~8시간)",
            "price": 15000,
            "unit": "세트"
          },
          {
            "id": "premiumWearRental",
            "name": "고급의류 렌탈(2~3시간)",
            "price": 25000,
            "unit": "세트"
          },
          {
            "id": "helmetRental",
            "name": "고급의류 렌탈(4시간)",
            "price": 30000,
            "unit": "세트"
          },
          {
            "id": "visorHelmetRental",
            "name": "고급의류 렌탈(5~6시간)",
            "price": 35000,
            "unit": "세트"
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1763459240105",
            "name": "고급의류 렌탈(7~8시간)",
            "unit": "세트",
            "price": 40000
          },
          {
            "id": "turtleGuardRental",
            "name": "헬맷 렌탈",
            "price": 5000,
            "unit": "개"
          },
          {
            "id": "shortSkiRental",
            "name": "바이저 헬맷 렌탈",
            "price": 10000,
            "unit": "개"
          },
          {
            "id": "inlineSkiRental",
            "name": "고글 렌탈",
            "price": 5000,
            "unit": "개"
          },
          {
            "id": "hammerDeckRental",
            "name": "보호대 렌탈",
            "price": 5000,
            "unit": "개"
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1763197132736",
            "name": "거북이 보호대 렌탈",
            "unit": "개",
            "price": 15000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1763197132559",
            "name": "스키만 렌탈 (2~4시간)",
            "unit": "개",
            "price": 10000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1763197132370",
            "name": "스키만 렌탈(5~8시간)",
            "unit": "개",
            "price": 15000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764046391581",
            "name": "보드만 렌탈(2~4시간)",
            "unit": "개",
            "price": 10000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510307655",
            "name": "보드만 렌탈(5~8시간)",
            "unit": "개",
            "price": 15000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510307781",
            "name": "숏스키만 렌탈(2~4시간)",
            "unit": "개",
            "price": 20000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510307901",
            "name": "숏스키만 렌탈(5~8시간)",
            "unit": "개",
            "price": 25000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308028",
            "name": "인라인 스키만 렌탈(2~4시간)",
            "unit": "개",
            "price": 30000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308163",
            "name": "인라인 스키만 렌탈(5~8시간)",
            "unit": "개",
            "price": 35000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308281",
            "name": "해머데크만 렌탈(2~4시간)",
            "unit": "개",
            "price": 30000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308424",
            "name": "해머데크만 렌탈(5~8시간)",
            "unit": "개",
            "price": 35000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308547",
            "name": "숏스키로 변경",
            "unit": "개",
            "price": 10000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308668",
            "name": "인라인 스키로 변경",
            "unit": "개",
            "price": 20000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510309013",
            "name": "해머데크로 변경",
            "unit": "개",
            "price": 20000
          }
        ]
      },
      {
        "name": "구매 · 액세서리",
        "items": [
          {
            "id": "adultGlovesPurchase",
            "name": "장갑 구매",
            "price": 18000,
            "unit": "켤레"
          },
          {
            "id": "balaclavaPurchase",
            "name": "바라클라바 구매",
            "price": 15000,
            "unit": "개"
          },
          {
            "id": "socksPurchase",
            "name": "양말 구매",
            "price": 10000,
            "unit": "켤레"
          },
          {
            "id": "leggingsPurchase",
            "name": "레깅스 구매",
            "price": 20000,
            "unit": "벌"
          },
          {
            "id": "warmerPurchase",
            "name": "워머 구매",
            "price": 18000,
            "unit": "개"
          },
          {
            "id": "구매 · 액세서리_weekday_1763459897019",
            "name": "고급 워머 구매",
            "unit": "개",
            "price": 25000
          },
          {
            "id": "구매 · 액세서리_weekday_1763459918290",
            "name": "털 모자 구매",
            "unit": "개",
            "price": 30000
          }
        ]
      },
      {
        "name": "리프트권",
        "items": [
          {
            "id": "lift_weekday_2h",
            "name": "2시간",
            "price": 34000,
            "unit": "매"
          },
          {
            "id": "lift_weekday_3h",
            "name": "3시간",
            "price": 37000,
            "unit": "매"
          },
          {
            "id": "lift_weekday_4h",
            "name": "4시간",
            "price": 40000,
            "unit": "매"
          },
          {
            "id": "lift_weekday_5h",
            "name": "5시간",
            "price": 43000,
            "unit": "매"
          },
          {
            "id": "lift_weekday_6h",
            "name": "6시간",
            "price": 45000,
            "unit": "매"
          },
          {
            "id": "lift_weekday_7h",
            "name": "7시간",
            "price": 48000,
            "unit": "매"
          }
        ],
        "groups": [
          {
            "name": "대인",
            "items": [
              {
                "id": "리프트권_weekday_0_1763460240354",
                "name": "2시간",
                "unit": "매",
                "price": 34000
              },
              {
                "id": "리프트권_weekday_0_1763460240683",
                "name": "3시간",
                "unit": "매",
                "price": 37000
              },
              {
                "id": "리프트권_weekday_0_1763460240963",
                "name": "4시간",
                "unit": "매",
                "price": 40000
              },
              {
                "id": "리프트권_weekday_0_1763460241246",
                "name": "5시간",
                "unit": "매",
                "price": 43000
              },
              {
                "id": "리프트권_weekday_0_1763460241627",
                "name": "6시간",
                "unit": "매",
                "price": 45000
              },
              {
                "id": "리프트권_weekday_0_1763460242014",
                "name": "7시간",
                "unit": "매",
                "price": 48000
              }
            ]
          },
          {
            "name": "소인",
            "items": [
              {
                "id": "리프트권_weekday_1_1763460324285",
                "name": "2시간",
                "unit": "매",
                "price": 28000
              },
              {
                "id": "리프트권_weekday_1_1763460324475",
                "name": "3시간",
                "unit": "매",
                "price": 30000
              },
              {
                "id": "리프트권_weekday_1_1763460324719",
                "name": "4시간",
                "unit": "매",
                "price": 32000
              },
              {
                "id": "리프트권_weekday_1_1763460324917",
                "name": "5시간",
                "unit": "매",
                "price": 34000
              },
              {
                "id": "리프트권_weekday_1_1763460325173",
                "name": "6시간",
                "unit": "매",
                "price": 37000
              },
              {
                "id": "리프트권_weekday_1_1763460325431",
                "name": "7시간",
                "unit": "매",
                "price": 39000
              }
            ]
          }
        ],
        "weekendGroups": [
          {
            "name": "대인",
            "items": [
              {
                "id": "리프트권_weekend_0_1763460240354",
                "name": "2시간",
                "unit": "매",
                "price": 42000
              },
              {
                "id": "리프트권_weekend_0_1763460240683",
                "name": "3시간",
                "unit": "매",
                "price": 44000
              },
              {
                "id": "리프트권_weekend_0_1763460240963",
                "name": "4시간",
                "unit": "매",
                "price": 47000
              },
              {
                "id": "리프트권_weekend_0_1763460241246",
                "name": "5시간",
                "unit": "매",
                "price": 50000
              },
              {
                "id": "리프트권_weekend_0_1763460241627",
                "name": "6시간",
                "unit": "매",
                "price": 53000
              },
              {
                "id": "리프트권_weekend_0_1763460242014",
                "name": "7시간",
                "unit": "매",
                "price": 55000
              }
            ]
          },
          {
            "name": "소인",
            "items": [
              {
                "id": "리프트권_weekend_1_1763460324285",
                "name": "2시간",
                "unit": "매",
                "price": 33000
              },
              {
                "id": "리프트권_weekend_1_1763460324475",
                "name": "3시간",
                "unit": "매",
                "price": 36000
              },
              {
                "id": "리프트권_weekend_1_1763460324719",
                "name": "4시간",
                "unit": "매",
                "price": 38000
              },
              {
                "id": "리프트권_weekend_1_1763460324917",
                "name": "5시간",
                "unit": "매",
                "price": 40000
              },
              {
                "id": "리프트권_weekend_1_1763460325173",
                "name": "6시간",
                "unit": "매",
                "price": 42000
              },
              {
                "id": "리프트권_weekend_1_1763460325431",
                "name": "7시간",
                "unit": "매",
                "price": 44000
              }
            ]
          }
        ]
      },
      {
        "name": "강습",
        "equipmentFees": {
          "2시간": 35000,
          "3시간": 60000,
          "4시간": 60000
        },
        "groups": [
          {
            "name": "1:1",
            "items": [
              {
                "id": "lesson_weekday_1to1_2h",
                "name": "2시간",
                "price": 120000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekday_1to1_3h",
                "name": "3시간",
                "price": 180000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekday_1to1_4h",
                "name": "4시간",
                "price": 240000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:2",
            "items": [
              {
                "id": "lesson_weekday_1to2_2h",
                "name": "2시간",
                "price": 120000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekday_1to2_3h",
                "name": "3시간",
                "price": 180000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekday_1to2_4h",
                "name": "4시간",
                "price": 240000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:3",
            "items": [
              {
                "id": "lesson_weekday_1to3_2h",
                "name": "2시간",
                "price": 120000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekday_1to3_3h",
                "name": "3시간",
                "price": 180000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekday_1to3_4h",
                "name": "4시간",
                "price": 240000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:4",
            "items": [
              {
                "id": "강습_weekday_3_1764418527253",
                "name": "2시간",
                "unit": "회",
                "price": 140000
              },
              {
                "id": "강습_weekday_3_1764418527390",
                "name": "3시간",
                "unit": "회",
                "price": 210000
              },
              {
                "id": "강습_weekday_3_1764418527527",
                "name": "4시간",
                "unit": "회",
                "price": 280000
              }
            ]
          }
        ],
        "weekendGroups": [
          {
            "name": "1:1",
            "items": [
              {
                "id": "lesson_weekend_1to1_2h",
                "name": "2시간",
                "price": 120000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekend_1to1_3h",
                "name": "3시간",
                "price": 180000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekend_1to1_4h",
                "name": "4시간",
                "price": 240000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:2",
            "items": [
              {
                "id": "lesson_weekend_1to2_2h",
                "name": "2시간",
                "price": 120000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekend_1to2_3h",
                "name": "3시간",
                "price": 180000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekend_1to2_4h",
                "name": "4시간",
                "price": 240000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:3",
            "items": [
              {
                "id": "lesson_weekend_1to3_2h",
                "name": "2시간",
                "price": 120000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekend_1to3_3h",
                "name": "3시간",
                "price": 180000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekend_1to3_4h",
                "name": "4시간",
                "price": 240000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:4",
            "items": [
              {
                "id": "강습_weekend_3_1764418540583",
                "name": "2시간",
                "unit": "회",
                "price": 140000
              },
              {
                "id": "강습_weekend_3_1764418540724",
                "name": "3시간",
                "unit": "회",
                "price": 210000
              },
              {
                "id": "강습_weekend_3_1764418540843",
                "name": "4시간",
                "unit": "회회",
                "price": 280000
              }
            ]
          }
        ]
      },
      {
        "name": "숙박 패키지",
        "items": []
      },
      {
        "name": "강습 패키지",
        "groups": [
          {
            "name": "1:1",
            "items": [
              {
                "id": "강습 패키지_weekday_0_1763821853776",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 190000
              },
              {
                "id": "강습 패키지_weekday_0_1763821854220",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 277000
              },
              {
                "id": "강습 패키지_weekday_0_1763821854477",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 339000
              }
            ]
          },
          {
            "name": "1:2",
            "items": [
              {
                "id": "강습 패키지_weekday_1_1763821925682",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 225000
              },
              {
                "id": "강습 패키지_weekday_1_1763821925950",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 314000
              },
              {
                "id": "강습 패키지_weekday_1_1763821926155",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 378000
              }
            ]
          },
          {
            "name": "1:3",
            "items": [
              {
                "id": "강습 패키지_weekday_2_1763821946025",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 260000
              },
              {
                "id": "강습 패키지_weekday_2_1763821946181",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 351000
              },
              {
                "id": "강습 패키지_weekday_2_1763821946319",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 417000
              }
            ]
          },
          {
            "name": "1:4",
            "items": [
              {
                "id": "강습 패키지_weekday_3_1764418742603",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 315000
              },
              {
                "id": "강습 패키지_weekday_3_1764418742738",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 418000
              },
              {
                "id": "강습 패키지_weekday_3_1764418742880",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 496000
              }
            ]
          }
        ],
        "weekendGroups": [
          {
            "name": "1:1",
            "items": [
              {
                "id": "강습 패키지_weekend_0_1763821956498",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 195000
              },
              {
                "id": "강습 패키지_weekend_0_1763821956641",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 282000
              },
              {
                "id": "강습 패키지_weekend_0_1763821956769",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 344000
              }
            ]
          },
          {
            "name": "1:2",
            "items": [
              {
                "id": "강습 패키지_weekend_1_1763821962105",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 235000
              },
              {
                "id": "강습 패키지_weekend_1_1763821962265",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 324000
              },
              {
                "id": "강습 패키지_weekend_1_1763821962411",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 388000
              }
            ]
          },
          {
            "name": "1:3",
            "items": [
              {
                "id": "강습 패키지_weekend_2_1763821967838",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 275000
              },
              {
                "id": "강습 패키지_weekend_2_1763821967979",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 366000
              },
              {
                "id": "강습 패키지_weekend_2_1763821968117",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 432000
              }
            ]
          },
          {
            "name": "1:4",
            "items": [
              {
                "id": "강습 패키지_weekend_3_1764418759370",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 335000
              },
              {
                "id": "강습 패키지_weekend_3_1764418759502",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 438000
              },
              {
                "id": "강습 패키지_weekend_3_1764418759642",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 516000
              }
            ]
          }
        ]
      },
      {
        "name": "안내문자",
        "items": [],
        "messages": [
          {
            "id": "msg_1764568447065",
            "title": "숙박 안내문자",
            "content": "숙박안내문자\n\n안녕하세요 OOO 님\n월드스키 친절한 최매니저입니다.\n\n[내용1]\n\n총 금액 [내용2]이며 해당금액만 아래에 있는 계좌로 입금해주시면 됩니다.\n말씀드린 패키지는 의류 미포함 상품이며, 일반의류는 5시간까지는 10,000원, 6시간이상은 15,000원으로 추가도 가능하십니다. 또한 리프트,펜션 금액은 vat 미포함 기준입니다.\n\n숙박패키지의 경우 입금후 예약이 진행되기 때문에\n입금이 늦어지시는 경우 객실이 마감될 수도 있습니다.\n꼭!!!!\n입금 주신후 문자 양식대로 답장주시면 예약완료 됩니다 ^^\n\n국민 조승희(엘리시안강촌 월드스키 강습)\n650701-01-486003\n\n숙박패키지 이용 고객의 경우\n입실 시간은 공통으로 오후3시 이후\n퇴실은 다음날 오전 11시까지 입니다\n입금 주신후 예약금 환불은\n이용 7일이전 90% 환불 가능\n이용 5일전 50% 환불 가능\n이용 3일이내 환불 불가 입니다\n객실 or 날짜 변경 수수료 5천원입니다\n위 내용에 동의하신분만 입금 주세요~\n\n1.예약자 성함:\n2.입금금액 :\n3.이용날짜 :\n4.이용인원 :\n5.이용패키지 : (리프트 이용시간)\n6.객실타입 : \n7.교통편: (셔틀,전철,자차)"
          },
          {
            "id": "msg_1764571099366",
            "title": "강습 안내문자(강습만)",
            "content": "강습안내문자\n\n안녕하세요 OOO 님\n월드스키 친절한 최매니저입니다 \n\n[내용1]\n\n총 강습금액 [내용2]이며 해당금액만 아래에 있는 계좌로 입금해주시면 됩니다.\n리프트+장비렌탈, 의류렌탈이 필요하신 경우 당일날 현장에서 추가해주시면 되시며,\n일반의류는 5시간까지는 10,000원, 6시간이상은 15,000원으로 추가도 가능하십니다. \n\n▶강습시작 1시간 전에 방문해주셔야 시작시간에 정확히 시작 가능합니다\n▶강습받으시면 고글, 헬멧, 보호대를 서비스로 대여 해드립니다\n▶강원도 춘천시 남산면 서백길 74 월드강습센터 \n\n꼭!!!!\n입금 주신후 문자 양식대로 답장주시면 예약완료 됩니다 ^^\n\n국민 조승희(엘리시안강촌 월드스키 강습)\n650701-01-486003\n\n입금 주신후 예약금 환불은\n이용 4일전 100% 환불\n이용 3일이내 환불 불가 입니다\n위 내용에 동의하신분만 입금 주세요~ \n\n1. 예약자 성함 :\n2. 입금금액 :\n3. 이용날짜 :\n4. 강습시간 :\n5. 이용인원 :\n6. 종목 : (스키or보드)\n7. 교통편 : (전철,셔틀,자차)"
          },
          {
            "id": "msg_1764571287011",
            "title": "강습 안내문자(올인원패키지)",
            "content": "강습안내문자\n\n안녕하세요 OOO 님\n월드스키 친절한 최매니저입니다 \n\n[내용1]\n\n총 강습금액 [내용2]이며 해당금액만 아래에 있는 계좌로 입금해주시면 됩니다.\n올인원강습패키지는 강습+패찰+리프트+장비까지 포함된 금액이며,\n일반의류는 5시간까지는 10,000원, 6시간이상은 15,000원으로 추가도 가능하십니다.\n또한 리프트 금액은 vat 미포함 기준입니다.\n\n▶강습시작 1시간 전에 방문해주셔야 시작시간에 정확히 시작 가능합니다\n▶강습받으시면 고글, 헬멧, 보호대를 서비스로 대여 해드립니다\n▶강원도 춘천시 남산면 서백길 74 월드강습센터 \n\n꼭!!!!\n입금 주신후 문자 양식대로 답장주시면 예약완료 됩니다 ^^\n\n국민 조승희(엘리시안강촌 월드스키 강습)\n650701-01-486003\n\n입금 주신후 예약금 환불은\n이용 4일전 100% 환불\n이용 3일이내 환불 불가 입니다\n위 내용에 동의하신분만 입금 주세요~ \n\n1. 예약자 성함 :\n2. 입금금액 :\n3. 이용날짜 :\n4. 강습시간 :\n5. 이용인원 :\n6. 종목 : (스키or보드)\n7. 교통편 : (전철,셔틀,자차)"
          }
        ]
      },
      {
        "name": "VAT",
        "items": [
          {
            "id": "VAT_weekday_1764515916925",
            "name": "2시간 VAT",
            "unit": "개",
            "price": 3000
          },
          {
            "id": "VAT_weekday_1764515917323",
            "name": "3시간 VAT",
            "unit": "개",
            "price": 3000
          },
          {
            "id": "VAT_weekday_1764515917483",
            "name": "4시간 VAT",
            "unit": "개",
            "price": 3500
          },
          {
            "id": "VAT_weekday_1764515952154",
            "name": "5시간 VAT",
            "unit": "개",
            "price": 3500
          },
          {
            "id": "VAT_weekday_1764515952443",
            "name": "6시간 VAT",
            "unit": "개",
            "price": 4000
          },
          {
            "id": "VAT_weekday_1764515952601",
            "name": "7시간 VAT",
            "unit": "개",
            "price": 4000
          },
          {
            "id": "VAT_weekday_1764515984311",
            "name": "8시간 VAT",
            "unit": "개",
            "price": 4000
          }
        ],
        "weekendItems": [
          {
            "id": "VAT_weekend_1764515921403",
            "name": "2시간 VAT",
            "unit": "개",
            "price": 3500
          },
          {
            "id": "VAT_weekend_1764515921557",
            "name": "3시간 VAT",
            "unit": "개",
            "price": 3500
          },
          {
            "id": "VAT_weekend_1764515921693",
            "name": "3시간 VAT",
            "unit": "개",
            "price": 4000
          },
          {
            "id": "VAT_weekend_1764516011112",
            "name": "4시간 VAT",
            "unit": "개",
            "price": 4000
          },
          {
            "id": "VAT_weekend_1764516011341",
            "name": "5시간 VAT",
            "unit": "개",
            "price": 4500
          },
          {
            "id": "VAT_weekend_1764516011561",
            "name": "6시간 VAT",
            "unit": "개",
            "price": 4500
          },
          {
            "id": "VAT_weekend_1764516011864",
            "name": "7시간 VAT",
            "unit": "개",
            "price": 4500
          }
        ]
      }
    ]
  },
  "peakSeason": {
    "label": "성수기",
    "categories": [
      {
        "name": "리프트 + 렌탈권",
        "groups": [
          {
            "name": "대인",
            "items": [
              {
                "id": "liftRental_weekday_adult_2h",
                "name": "2시간",
                "price": 47000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_adult_3h",
                "name": "3시간",
                "price": 50000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_adult_4h",
                "name": "4시간",
                "price": 53000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_adult_5h",
                "name": "5시간",
                "price": 56000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_adult_6h",
                "name": "6시간",
                "price": 59000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_adult_7h",
                "name": "7시간",
                "price": 65000,
                "unit": "매"
              }
            ]
          },
          {
            "name": "학생",
            "items": [
              {
                "id": "liftRental_weekday_student_2h",
                "name": "2시간",
                "price": 46000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_student_3h",
                "name": "3시간",
                "price": 49000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_student_4h",
                "name": "4시간",
                "price": 52000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_student_5h",
                "name": "5시간",
                "price": 55000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_student_6h",
                "name": "6시간",
                "price": 58000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_student_7h",
                "name": "7시간",
                "price": 64000,
                "unit": "매"
              }
            ]
          },
          {
            "name": "소인",
            "items": [
              {
                "id": "liftRental_weekday_child_2h",
                "name": "2시간",
                "price": 40000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_child_3h",
                "name": "3시간",
                "price": 42000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_child_4h",
                "name": "4시간",
                "price": 45000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_child_5h",
                "name": "5시간",
                "price": 47000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_child_6h",
                "name": "6시간",
                "price": 50000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekday_child_7h",
                "name": "7시간",
                "price": 52000,
                "unit": "매"
              }
            ]
          }
        ],
        "weekendGroups": [
          {
            "name": "대인",
            "items": [
              {
                "id": "liftRental_weekend_adult_2h",
                "name": "2시간",
                "price": 55000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_adult_3h",
                "name": "3시간",
                "price": 58000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_adult_4h",
                "name": "4시간",
                "price": 61000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_adult_5h",
                "name": "5시간",
                "price": 64000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_adult_6h",
                "name": "6시간",
                "price": 67000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_adult_7h",
                "name": "7시간",
                "price": 70000,
                "unit": "매"
              }
            ]
          },
          {
            "name": "학생",
            "items": [
              {
                "id": "liftRental_weekend_student_2h",
                "name": "2시간",
                "price": 54000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_student_3h",
                "name": "3시간",
                "price": 57000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_student_4h",
                "name": "4시간",
                "price": 60000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_student_5h",
                "name": "5시간",
                "price": 63000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_student_6h",
                "name": "6시간",
                "price": 66000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_student_7h",
                "name": "7시간",
                "price": 69000,
                "unit": "매"
              }
            ]
          },
          {
            "name": "소인",
            "items": [
              {
                "id": "liftRental_weekend_child_2h",
                "name": "2시간",
                "price": 47000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_child_3h",
                "name": "3시간",
                "price": 49000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_child_4h",
                "name": "4시간",
                "price": 51000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_child_5h",
                "name": "5시간",
                "price": 53000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_child_6h",
                "name": "6시간",
                "price": 56000,
                "unit": "매"
              },
              {
                "id": "liftRental_weekend_child_7h",
                "name": "7시간",
                "price": 58000,
                "unit": "매"
              }
            ]
          }
        ]
      },
      {
        "name": "장비 · 보호장비 렌탈",
        "items": [
          {
            "id": "skiRental",
            "name": "일반의류 렌탈(2~3시간)",
            "price": 10000,
            "unit": "세트"
          },
          {
            "id": "boardRental",
            "name": "일반의류 렌탈(4~5시간)",
            "price": 10000,
            "unit": "세트"
          },
          {
            "id": "basicWearRental",
            "name": "일반의류 렌탈(6~8시간)",
            "price": 15000,
            "unit": "세트"
          },
          {
            "id": "premiumWearRental",
            "name": "고급의류 렌탈(2~3시간)",
            "price": 25000,
            "unit": "세트"
          },
          {
            "id": "helmetRental",
            "name": "고급의류 렌탈(4시간)",
            "price": 30000,
            "unit": "세트"
          },
          {
            "id": "visorHelmetRental",
            "name": "고급의류 렌탈(5~6시간)",
            "price": 35000,
            "unit": "세트"
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1763459240105",
            "name": "고급의류 렌탈(7~8시간)",
            "unit": "세트",
            "price": 40000
          },
          {
            "id": "turtleGuardRental",
            "name": "헬맷 렌탈",
            "price": 5000,
            "unit": "개"
          },
          {
            "id": "shortSkiRental",
            "name": "바이저 헬맷 렌탈",
            "price": 10000,
            "unit": "개"
          },
          {
            "id": "inlineSkiRental",
            "name": "고글 렌탈",
            "price": 5000,
            "unit": "개"
          },
          {
            "id": "hammerDeckRental",
            "name": "보호대 렌탈",
            "price": 5000,
            "unit": "개"
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1763197132736",
            "name": "거북이 보호대 렌탈",
            "unit": "개",
            "price": 15000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1763197132559",
            "name": "스키만 렌탈 (2~4시간)",
            "unit": "개",
            "price": 10000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1763197132370",
            "name": "스키만 렌탈(5~8시간)",
            "unit": "개",
            "price": 15000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764046391581",
            "name": "보드만 렌탈(2~4시간)",
            "unit": "개",
            "price": 10000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510307655",
            "name": "보드만 렌탈(5~8시간)",
            "unit": "개",
            "price": 15000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510307781",
            "name": "숏스키만 렌탈(2~4시간)",
            "unit": "개",
            "price": 20000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510307901",
            "name": "숏스키만 렌탈(5~8시간)",
            "unit": "개",
            "price": 25000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308028",
            "name": "인라인 스키만 렌탈(2~4시간)",
            "unit": "개",
            "price": 30000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308163",
            "name": "인라인 스키만 렌탈(5~8시간)",
            "unit": "개",
            "price": 35000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308281",
            "name": "해머데크만 렌탈(2~4시간)",
            "unit": "개",
            "price": 30000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308424",
            "name": "해머데크만 렌탈(5~8시간)",
            "unit": "개",
            "price": 35000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308547",
            "name": "숏스키로 변경",
            "unit": "개",
            "price": 10000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510308668",
            "name": "인라인 스키로 변경",
            "unit": "개",
            "price": 20000
          },
          {
            "id": "장비 · 보호장비 렌탈_weekday_1764510309013",
            "name": "해머데크로 변경",
            "unit": "개",
            "price": 20000
          }
        ]
      },
      {
        "name": "구매 · 액세서리",
        "items": [
          {
            "id": "adultGlovesPurchase",
            "name": "장갑 구매",
            "price": 18000,
            "unit": "켤레"
          },
          {
            "id": "balaclavaPurchase",
            "name": "바라클라바 구매",
            "price": 15000,
            "unit": "개"
          },
          {
            "id": "socksPurchase",
            "name": "양말 구매",
            "price": 10000,
            "unit": "켤레"
          },
          {
            "id": "leggingsPurchase",
            "name": "레깅스 구매",
            "price": 20000,
            "unit": "벌"
          },
          {
            "id": "warmerPurchase",
            "name": "워머 구매",
            "price": 18000,
            "unit": "개"
          },
          {
            "id": "구매 · 액세서리_weekday_1764047597106",
            "name": "고급 워머 구매",
            "unit": "개",
            "price": 25000
          },
          {
            "id": "구매 · 액세서리_weekday_1764047670138",
            "name": "털 모자 구매",
            "unit": "개",
            "price": 30000
          }
        ]
      },
      {
        "name": "리프트권",
        "items": [
          {
            "id": "lift_weekday_2h",
            "name": "2시간",
            "price": 41000,
            "unit": "매"
          },
          {
            "id": "lift_weekday_3h",
            "name": "3시간",
            "price": 44000,
            "unit": "매"
          },
          {
            "id": "lift_weekday_4h",
            "name": "4시간",
            "price": 47000,
            "unit": "매"
          },
          {
            "id": "lift_weekday_5h",
            "name": "5시간",
            "price": 50000,
            "unit": "매"
          },
          {
            "id": "lift_weekday_6h",
            "name": "6시간",
            "price": 54000,
            "unit": "매"
          },
          {
            "id": "lift_weekday_7h",
            "name": "7시간",
            "price": 57000,
            "unit": "매"
          }
        ],
        "groups": [
          {
            "name": "대인",
            "items": [
              {
                "id": "리프트권_weekday_0_1763460240354",
                "name": "2시간",
                "unit": "매",
                "price": 41000
              },
              {
                "id": "리프트권_weekday_0_1763460240683",
                "name": "3시간",
                "unit": "매",
                "price": 44000
              },
              {
                "id": "리프트권_weekday_0_1763460240963",
                "name": "4시간",
                "unit": "매",
                "price": 47000
              },
              {
                "id": "리프트권_weekday_0_1763460241246",
                "name": "5시간",
                "unit": "매",
                "price": 50000
              },
              {
                "id": "리프트권_weekday_0_1763460241627",
                "name": "6시간",
                "unit": "매",
                "price": 54000
              },
              {
                "id": "리프트권_weekday_0_1763460242014",
                "name": "7시간",
                "unit": "매",
                "price": 57000
              }
            ]
          },
          {
            "name": "소인",
            "items": [
              {
                "id": "리프트권_weekday_1_1763460324285",
                "name": "2시간",
                "unit": "매",
                "price": 33000
              },
              {
                "id": "리프트권_weekday_1_1763460324475",
                "name": "3시간",
                "unit": "매",
                "price": 36000
              },
              {
                "id": "리프트권_weekday_1_1763460324719",
                "name": "4시간",
                "unit": "매",
                "price": 38000
              },
              {
                "id": "리프트권_weekday_1_1763460324917",
                "name": "5시간",
                "unit": "매",
                "price": 41000
              },
              {
                "id": "리프트권_weekday_1_1763460325173",
                "name": "6시간",
                "unit": "매",
                "price": 43000
              },
              {
                "id": "리프트권_weekday_1_1763460325431",
                "name": "7시간",
                "unit": "매",
                "price": 46000
              }
            ]
          }
        ],
        "weekendGroups": [
          {
            "name": "대인",
            "items": [
              {
                "id": "리프트권_weekend_0_1763460240354",
                "name": "2시간",
                "unit": "매",
                "price": 49000
              },
              {
                "id": "리프트권_weekend_0_1763460240683",
                "name": "3시간",
                "unit": "매",
                "price": 52000
              },
              {
                "id": "리프트권_weekend_0_1763460240963",
                "name": "4시간",
                "unit": "매",
                "price": 56000
              },
              {
                "id": "리프트권_weekend_0_1763460241246",
                "name": "5시간",
                "unit": "매",
                "price": 59000
              },
              {
                "id": "리프트권_weekend_0_1763460241627",
                "name": "6시간",
                "unit": "매",
                "price": 62000
              },
              {
                "id": "리프트권_weekend_0_1763460242014",
                "name": "7시간",
                "unit": "매",
                "price": 65000
              }
            ]
          },
          {
            "name": "소인",
            "items": [
              {
                "id": "리프트권_weekend_1_1763460324285",
                "name": "2시간",
                "unit": "매",
                "price": 39000
              },
              {
                "id": "리프트권_weekend_1_1763460324475",
                "name": "3시간",
                "unit": "매",
                "price": 42000
              },
              {
                "id": "리프트권_weekend_1_1763460324719",
                "name": "4시간",
                "unit": "매",
                "price": 45000
              },
              {
                "id": "리프트권_weekend_1_1763460324917",
                "name": "5시간",
                "unit": "매",
                "price": 47000
              },
              {
                "id": "리프트권_weekend_1_1763460325173",
                "name": "6시간",
                "unit": "매",
                "price": 50000
              },
              {
                "id": "리프트권_weekend_1_1763460325431",
                "name": "7시간",
                "unit": "매",
                "price": 52000
              }
            ]
          }
        ]
      },
      {
        "name": "강습",
        "equipmentFees": {
          "2시간": 35000,
          "3시간": 60000,
          "4시간": 60000
        },
        "groups": [
          {
            "name": "1:1",
            "items": [
              {
                "id": "lesson_weekday_1to1_2h",
                "name": "2시간",
                "price": 120000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekday_1to1_3h",
                "name": "3시간",
                "price": 180000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekday_1to1_4h",
                "name": "4시간",
                "price": 240000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:2",
            "items": [
              {
                "id": "lesson_weekday_1to2_2h",
                "name": "2시간",
                "price": 120000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekday_1to2_3h",
                "name": "3시간",
                "price": 180000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekday_1to2_4h",
                "name": "4시간",
                "price": 240000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:3",
            "items": [
              {
                "id": "lesson_weekday_1to3_2h",
                "name": "2시간",
                "price": 120000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekday_1to3_3h",
                "name": "3시간",
                "price": 180000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekday_1to3_4h",
                "name": "4시간",
                "price": 240000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:4",
            "items": [
              {
                "id": "강습_weekday_3_1764418502327",
                "name": "2시간",
                "unit": "회",
                "price": 140000
              },
              {
                "id": "강습_weekday_3_1764418502458",
                "name": "3시간",
                "unit": "회",
                "price": 210000
              },
              {
                "id": "강습_weekday_3_1764418502594",
                "name": "4시간",
                "unit": "회",
                "price": 280000
              }
            ]
          }
        ],
        "weekendGroups": [
          {
            "name": "1:1",
            "items": [
              {
                "id": "lesson_weekend_1to1_2h",
                "name": "2시간",
                "price": 150000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekend_1to1_3h",
                "name": "3시간",
                "price": 220000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekend_1to1_4h",
                "name": "4시간",
                "price": 300000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:2",
            "items": [
              {
                "id": "lesson_weekend_1to2_2h",
                "name": "2시간",
                "price": 150000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekend_1to2_3h",
                "name": "3시간",
                "price": 220000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekend_1to2_4h",
                "name": "4시간",
                "price": 300000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:3",
            "items": [
              {
                "id": "lesson_weekend_1to3_2h",
                "name": "2시간",
                "price": 150000,
                "unit": "회",
                "equipmentFee": 35000
              },
              {
                "id": "lesson_weekend_1to3_3h",
                "name": "3시간",
                "price": 220000,
                "unit": "회",
                "equipmentFee": 60000
              },
              {
                "id": "lesson_weekend_1to3_4h",
                "name": "4시간",
                "price": 300000,
                "unit": "회",
                "equipmentFee": 60000
              }
            ]
          },
          {
            "name": "1:4",
            "items": [
              {
                "id": "강습_weekend_3_1764418477475",
                "name": "2시간",
                "unit": "회",
                "price": 170000
              },
              {
                "id": "강습_weekend_3_1764418477601",
                "name": "3시간",
                "unit": "회",
                "price": 250000
              },
              {
                "id": "강습_weekend_3_1764418477747",
                "name": "4시간",
                "unit": "회",
                "price": 340000
              }
            ]
          }
        ]
      },
      {
        "name": "숙박 패키지",
        "items": []
      },
      {
        "name": "강습 패키지",
        "groups": [
          {
            "name": "1:1",
            "items": [
              {
                "id": "강습 패키지_weekday_0_1763921415985",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 195000
              },
              {
                "id": "강습 패키지_weekday_0_1763921416160",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 282000
              },
              {
                "id": "강습 패키지_weekday_0_1763921416335",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 345000
              }
            ]
          },
          {
            "name": "1:2",
            "items": [
              {
                "id": "강습 패키지_weekday_1_1763921426436",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 235000
              },
              {
                "id": "강습 패키지_weekday_1_1763921426586",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 324000
              },
              {
                "id": "강습 패키지_weekday_1_1763921426731",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 390000
              }
            ]
          },
          {
            "name": "1:3",
            "items": [
              {
                "id": "강습 패키지_weekday_2_1763921436128",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 275000
              },
              {
                "id": "강습 패키지_weekday_2_1763921436271",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 366000
              },
              {
                "id": "강습 패키지_weekday_2_1763921436423",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 435000
              }
            ]
          },
          {
            "name": "1:4",
            "items": [
              {
                "id": "강습 패키지_weekday_3_1764418840894",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 335000
              },
              {
                "id": "강습 패키지_weekday_3_1764418841051",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 438000
              },
              {
                "id": "강습 패키지_weekday_3_1764418841175",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 520000
              }
            ]
          }
        ],
        "weekendGroups": [
          {
            "name": "1:1",
            "items": [
              {
                "id": "강습 패키지_weekend_0_1763921444383",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 232000
              },
              {
                "id": "강습 패키지_weekend_0_1763921444510",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 329000
              },
              {
                "id": "강습 패키지_weekend_0_1763921444650",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 411000
              }
            ]
          },
          {
            "name": "1:2",
            "items": [
              {
                "id": "강습 패키지_weekend_1_1763921452582",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 279000
              },
              {
                "id": "강습 패키지_weekend_1_1763921452712",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 378000
              },
              {
                "id": "강습 패키지_weekend_1_1763921452862",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 462000
              }
            ]
          },
          {
            "name": "1:3",
            "items": [
              {
                "id": "강습 패키지_weekend_2_1763921459710",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 326000
              },
              {
                "id": "강습 패키지_weekend_2_1763921459851",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 427000
              },
              {
                "id": "강습 패키지_weekend_2_1763921459994",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 513000
              }
            ]
          },
          {
            "name": "1:4",
            "items": [
              {
                "id": "강습 패키지_weekend_3_1764418857996",
                "name": "소인 2시간 강습 패키지",
                "unit": "개",
                "price": 393000
              },
              {
                "id": "강습 패키지_weekend_3_1764418858161",
                "name": "소인 3시간 강습 패키지",
                "unit": "개",
                "price": 506000
              },
              {
                "id": "강습 패키지_weekend_3_1764418858301",
                "name": "소인 4시간 강습 패키지",
                "unit": "개",
                "price": 604000
              }
            ]
          }
        ]
      },
      {
        "name": "안내문자",
        "items": [],
        "messages": [
          {
            "id": "msg_1764571800501",
            "title": "숙박 안내문자",
            "content": "숙박안내문자\n\n안녕하세요 OOO 님\n월드스키 친절한 최매니저입니다.\n\n[내용1]\n\n총 금액 [내용2]이며 해당금액만 아래에 있는 계좌로 입금해주시면 됩니다.\n말씀드린 패키지는 의류 미포함 상품이며, 일반의류는 5시간까지는 10,000원, 6시간이상은 15,000원으로 추가도 가능하십니다. 또한 리프트,펜션 금액은 vat 미포함 기준입니다.\n\n숙박패키지의 경우 입금후 예약이 진행되기 때문에\n입금이 늦어지시는 경우 객실이 마감될 수도 있습니다.\n꼭!!!!\n입금 주신후 문자 양식대로 답장주시면 예약완료 됩니다 ^^\n\n국민 조승희(엘리시안강촌 월드스키 강습)\n650701-01-486003\n\n숙박패키지 이용 고객의 경우\n입실 시간은 공통으로 오후3시 이후\n퇴실은 다음날 오전 11시까지 입니다\n입금 주신후 예약금 환불은\n이용 7일이전 90% 환불 가능\n이용 5일전 50% 환불 가능\n이용 3일이내 환불 불가 입니다\n객실 or 날짜 변경 수수료 5천원입니다\n위 내용에 동의하신분만 입금 주세요~\n\n1.예약자 성함:\n2.입금금액 :\n3.이용날짜 :\n4.이용인원 :\n5.이용패키지 : (리프트 이용시간)\n6.객실타입 : \n7.교통편: (셔틀,전철,자차)"
          },
          {
            "id": "msg_1764571815457",
            "title": "강습 안내문자(강습만)",
            "content": "강습안내문자\n\n안녕하세요 OOO 님\n월드스키 친절한 최매니저입니다 \n\n[내용1]\n\n총 강습금액 [내용2]이며 해당금액만 아래에 있는 계좌로 입금해주시면 됩니다.\n리프트+장비렌탈, 의류렌탈이 필요하신 경우 당일날 현장에서 추가해주시면 되시며,\n일반의류는 5시간까지는 10,000원, 6시간이상은 15,000원으로 추가도 가능하십니다. \n\n▶강습시작 1시간 전에 방문해주셔야 시작시간에 정확히 시작 가능합니다\n▶강습받으시면 고글, 헬멧, 보호대를 서비스로 대여 해드립니다\n▶강원도 춘천시 남산면 서백길 74 월드강습센터 \n\n꼭!!!!\n입금 주신후 문자 양식대로 답장주시면 예약완료 됩니다 ^^\n\n국민 조승희(엘리시안강촌 월드스키 강습)\n650701-01-486003\n\n입금 주신후 예약금 환불은\n이용 4일전 100% 환불\n이용 3일이내 환불 불가 입니다\n위 내용에 동의하신분만 입금 주세요~ \n\n1. 예약자 성함 :\n2. 입금금액 :\n3. 이용날짜 :\n4. 강습시간 :\n5. 이용인원 :\n6. 종목 : (스키or보드)\n7. 교통편 : (전철,셔틀,자차)"
          },
          {
            "id": "msg_1764571832350",
            "title": "강습 안내문자(올인원패키지)",
            "content": "강습안내문자\n\n안녕하세요 OOO 님\n월드스키 친절한 최매니저입니다 \n\n[내용1]\n\n총 강습금액 [내용2]이며 해당금액만 아래에 있는 계좌로 입금해주시면 됩니다.\n올인원강습패키지는 강습+패찰+리프트+장비까지 포함된 금액이며,\n일반의류는 5시간까지는 10,000원, 6시간이상은 15,000원으로 추가도 가능하십니다.\n또한 리프트 금액은 vat 미포함 기준입니다.\n\n▶강습시작 1시간 전에 방문해주셔야 시작시간에 정확히 시작 가능합니다\n▶강습받으시면 고글, 헬멧, 보호대를 서비스로 대여 해드립니다\n▶강원도 춘천시 남산면 서백길 74 월드강습센터 \n\n꼭!!!!\n입금 주신후 문자 양식대로 답장주시면 예약완료 됩니다 ^^\n\n국민 조승희(엘리시안강촌 월드스키 강습)\n650701-01-486003\n\n입금 주신후 예약금 환불은\n이용 4일전 100% 환불\n이용 3일이내 환불 불가 입니다\n위 내용에 동의하신분만 입금 주세요~ \n\n1. 예약자 성함 :\n2. 입금금액 :\n3. 이용날짜 :\n4. 강습시간 :\n5. 이용인원 :\n6. 종목 : (스키or보드)\n7. 교통편 : (전철,셔틀,자차)"
          }
        ]
      },
      {
        "name": "VAT",
        "items": [
          {
            "id": "VAT_weekday_1764515916925",
            "name": "2시간 VAT",
            "unit": "개",
            "price": 3000
          },
          {
            "id": "VAT_weekday_1764515917323",
            "name": "3시간 VAT",
            "unit": "개",
            "price": 3000
          },
          {
            "id": "VAT_weekday_1764515917483",
            "name": "4시간 VAT",
            "unit": "개",
            "price": 3500
          },
          {
            "id": "VAT_weekday_1764515952154",
            "name": "5시간 VAT",
            "unit": "개",
            "price": 3500
          },
          {
            "id": "VAT_weekday_1764515952443",
            "name": "6시간 VAT",
            "unit": "개",
            "price": 4000
          },
          {
            "id": "VAT_weekday_1764515952601",
            "name": "7시간 VAT",
            "unit": "개",
            "price": 4000
          },
          {
            "id": "VAT_weekday_1764515984311",
            "name": "8시간 VAT",
            "unit": "개",
            "price": 4000
          }
        ],
        "weekendItems": [
          {
            "id": "VAT_weekend_1764515921403",
            "name": "2시간 VAT",
            "unit": "개",
            "price": 3500
          },
          {
            "id": "VAT_weekend_1764515921557",
            "name": "3시간 VAT",
            "unit": "개",
            "price": 3500
          },
          {
            "id": "VAT_weekend_1764515921693",
            "name": "3시간 VAT",
            "unit": "개",
            "price": 4000
          },
          {
            "id": "VAT_weekend_1764516011112",
            "name": "4시간 VAT",
            "unit": "개",
            "price": 4000
          },
          {
            "id": "VAT_weekend_1764516011341",
            "name": "5시간 VAT",
            "unit": "개",
            "price": 4500
          },
          {
            "id": "VAT_weekend_1764516011561",
            "name": "6시간 VAT",
            "unit": "개",
            "price": 4500
          },
          {
            "id": "VAT_weekend_1764516011864",
            "name": "7시간 VAT",
            "unit": "개",
            "price": 4500
          }
        ]
      }
    ]
  }
};

if (typeof module !== "undefined") {
  module.exports = pricingData;
} else {
  window.pricingData = pricingData;
}
