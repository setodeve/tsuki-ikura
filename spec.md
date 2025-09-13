# プロダクト概要
- **目的**: 「時給 × 労働時間 × 日数」を即時計算し、
  - 月の想定収入がひと目でわかる
  - 「X時間働いたらいくら？」を瞬時に逆算できる
- **対象ユーザー**: 時給制で働く個人（アルバイト、フリーランスの時間課金など）。
- **主要価値**: 入力最小・結果即時・視認性重視。履歴の保存/比較で意思決定を支援。

---

## 成功指標（KPI）
- 初回訪問から**10秒以内**に月額が表示される割合 ≥ 95%
- 保存した条件セット（プリセット）平均 2件/ユーザー
- フォーム離脱率 < 10%

---

## スコープ
### MVP（初版）
1. 計算ロジック
   - **時給**（必須）
   - **1日の労働時間**（平日・休日・祝日ごとに設定可能）
   - **月の稼働日数**（平日数・休日数・祝日数）
   - 出力：**月額**, **日額（平日/休日/祝日別）**, **週額（任意）**, **時給**（再表示）, **年間見込（任意）**
2. 逆算機能
   - 入力：**働く合計時間（今月/任意）**
   - 出力：**見込収入**
3. UI/UX
   - 単一ページ、即時計算（入力変更で自動更新）
   - 単位とフォーマット（通貨記号、区切り）
   - 主要結果はカードで大きく表示
4. 保存・共有
   - ローカル保存（**プリセット**管理：複数条件の保存/読込/削除）
   - 共有URL（クエリパラメータで条件を埋め込む）
5. 入力バリデーション
   - 数値・最小/最大・小数点桁数
   - 未入力/0除算防止
6. 多言語（日本語/英語の切替）
7. PWA（任意）
   - オフラインで直近の計算・プリセット利用

### 次版以降（バックログ）
- **時間帯別レート**（深夜・早朝・休日割増）
- **残業割増**（125%など係数）
- **休憩時間の自動控除**
- **税・社会保険の概算**（シミュレーション）
- **目標額から必要労働時間を逆算**
- **グラフ表示**（月別推移、条件比較）
- **CSV/画像エクスポート**
- **クラウド同期/ログイン**（任意）

---

## 主要ユースケース（User Stories）
1. **月額をすぐ知りたい**
   - 作为ユーザー、時給と平日/休日/祝日の時間、日数を入れると月額が即時に出る。
   - 受入条件：入力後、1秒未満で月額カードが更新。
2. **「今月は何時間働いたらいくら？」**
   - 作为ユーザー、合計時間を入れると見込収入が出る。
   - 受入条件：小数の時間（例 7.5h）にも対応。
3. **条件を保存して比較**
   - 作为ユーザー、A店とB店の条件を保存し、ワンタップで切替比較。
   - 受入条件：名前を付けて保存/読込/削除ができる。
4. **スマホで素早く**
   - 作为ユーザー、スマホで片手操作でもストレスなく入力・結果閲覧できる。
   - 受入条件：主要操作はファーストビュー内に収まる（iPhone SE基準）。

---

## 計算仕様
### 定義
- `hourly`: 時給（円）
- `hoursWeekday`: 平日の労働時間（h）
- `hoursHoliday`: 休日の労働時間（h）
- `hoursNationalHoliday`: 祝日の労働時間（h）
- `weekdaysPerMonth`: 平日日数（日）
- `holidaysPerMonth`: 休日数（日）
- `nationalHolidaysPerMonth`: 祝日数（日）
- `totalHours`: 合計労働時間（h）

### 出力
- 月額: `monthly = hourly * (hoursWeekday * weekdaysPerMonth + hoursHoliday * holidaysPerMonth + hoursNationalHoliday * nationalHolidaysPerMonth)`
- 平日日額: `weekdayDaily = hourly * hoursWeekday`
- 休日日額: `holidayDaily = hourly * hoursHoliday`
- 祝日日額: `nationalHolidayDaily = hourly * hoursNationalHoliday`
- 週額（任意）: `weekly = weekdayDaily * 5`（デフォルト5日、設定で変更可）
- 逆算：`earningsByHours = hourly * totalHours`
- 年間（任意）：`yearly = monthly * 12`

### バリデーション
- 各労働時間 ∈ [0, 24]
- 各日数 ∈ [0, 31]
- 小数は**2桁**まで（設定で拡張）

---

## UI要件（更新）
### 画面構成（ワイヤーフレーム）
```
[ 入力カード ]
┌ 時給（円/時） [    ] ┐
├ 平日の労働時間（h） [    ] × 平日日数 [    ] ┤
├ 休日の労働時間（h） [    ] × 休日数 [    ] ┤
├ 祝日の労働時間（h） [    ] × 祝日数 [    ] ┤
└ 今月の合計時間で逆算（任意 h） [    ] ┘

[ 結果カード（大） ]
┌ 月額：¥ 240,000 ┐
├ 平日日額：¥ 12,000  ┤
├ 休日日額：¥ 10,000  ┤
├ 祝日日額：¥ 15,000  ┤
└ 逆算：¥ 36,000（合計30h） ┘
```

---

## 擬似コード（更新）
```ts
function calcMonthly({ hourly, hoursWeekday, weekdays, hoursHoliday, holidays, hoursNationalHoliday, nationalHolidays }) {
  const total = (hoursWeekday * weekdays) + (hoursHoliday * holidays) + (hoursNationalHoliday * nationalHolidays);
  return toCurrency(hourly * total);
}

function calcByTotalHours({ hourly, totalHours }) {
  return toCurrency(hourly * totalHours);
}
```

---

## リスク & 留意点
- 「平日/休日/祝日」の分類基準はユーザー入力に依存（自動判定はMVP範囲外）
- UIを複雑にしすぎない工夫が必要

