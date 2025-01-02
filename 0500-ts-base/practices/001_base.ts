// 下記指定の通りそれぞれの関数を実装してください。
//
// ※1 any 型を使用せずに具体的な型を用いて実装して下さい。
// ※2 関数はテストコードのために必ず export して下さい。

/* 1.1 以下の関数を実装して下さい
   関数名: add
   引数: number, number
   返り値: number
   振る舞い: 引数で渡された2つの数値を足し算して返す
*/

export const add = (num1: number, num2: number): number => {
  return num1 + num2;
};

/* 1.2 以下の関数を実装して下さい
   関数名: sum
   引数: number[]
   返り値: number
   振る舞い: 配列の中身の数を全て足し算して返す
*/

export const sum = (nums: number[]): number => {
  return nums.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
};

/* 1.3 以下の関数を実装して下さい
   関数名: format
   引数: Date
   返り値: string
   振る舞い: 引数で渡されたDate型の日付をYYYY/MM/DDの形式にして返す
*/

export const format = (date: Date) => {
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1; //月は0始まりのため1を足す
  const day: number = date.getDate();

  const formattedDate: string = `${year}/${month < 10 ? "0" : ""}${month}/${day < 10 ? "0" : ""}${day}`;
  return formattedDate;
};

/* 1.4 以下の関数を実装して下さい
   関数名: merge
   引数: Record<string, number>, Record<string, number>
   返り値: Record<string, number>
   振る舞い: 引数で渡された2つのオブジェクトのキーと値をマージして返す。
             (同じキーがある場合は足し算する)

   例:
   merge({a: 1}, {b: 2}) => {a: 1, b: 2}
   merge({a: 1}, {a: 1, b: 2}) => {a: 2, b: 2}
   merge({a: 1, c: 1}, {a: 1, b: 2}) => {a: 2, b: 2, c: 1}
   merge({a: 1, c: 1}, {a: 1, b: 2}) => {a: 2, b: 2, c: 1}
   merge({}, {}) => {}
*/

export const merge = (
  obj1: Record<string, number>,
  obj2: Record<string, number>
): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const key1 in obj1) {
    for (const key2 in obj2) {
      if (key1 === key2) {
        result[key1] = obj1[key1] + obj2[key2];
      }
    }
    // resultにkey1が追加されていない場合、追加する。
    if (!result.hasOwnProperty(key1)) {
      result[key1] = obj1[key1];
    }
  }
  // resultにkey2が追加されていない場合、追加する。
  for (const key2 in obj2) {
    if (!result.hasOwnProperty(key2)) {
      result[key2] = obj2[key2];
    }
  }
  return result;
};

/* 1.5 以下の関数を実装して下さい
   関数名: stringify
   引数: string | number | boolean | null | undefined
   返り値: string
   振る舞い: 引数で渡された値を文字列にして返す
             (引数は引数の欄にリストされた型が入る可能性があります)

   例:
   stringify("a") => "a"
   stringify(1) => "1"
   striingify(true) => "true"
   stringify(null) => "null"
   stringify(undefined) => "undefined"
*/

export const stringify = (
  value: string | number | boolean | null | undefined
): string => {
  if (value === null) {
    return "null";
  } else if (value === undefined) {
    return "undefined";
  } else {
    return String(value);
  }
};
