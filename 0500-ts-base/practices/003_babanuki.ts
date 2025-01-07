/* 下記に指定した仕様のばば抜きアプリを作成して下さい。
 *
 *  参加プレイヤーは4名: Alice, Bob, Charlie, David
 *
 *  1. ジョーカーを含む52+1枚のトランプを用意し、プレイヤーに2枚ずつ配る
 *  2. プレイヤーは手札から同じ数字のカードを捨てることができる
 *  3. 手札のが配られた場合、全部のプレイヤーが手札から全てのペアのカードを捨てる。
 *  4. プレイヤーはAlice => Bob => Charlie => David の順番でカードを引く
 *  5. プレイヤーはカードを引いた後に、手札にペアがあるか確認し、あれば捨てる
 *
 *  [勝利条件]
 *  1. 手札がなくなったプレイヤーが勝利。最後の1人が残るまで続ける。
 *
 *  [敗北条件]
 *  1. 自分以外のプレイヤーが全て抜けた場合。
 *  2. ジョーカーのみの手札を持っている場合。その人を負けとして即時にゲームを終了する。
 *
 *  [実行例]
 *  - ./docs/003_babanuki_example.md を参照してください。
 *
 *  [出力内容]
 *  - 実行例を参考に、ゲームの進行状況を Logger クラスを使って出力してください。
 *  - 出力はテストコードでも検証するので例にならって出力を行ってください。
 *
 *  [そのほか]
 *  - ロジックの実装の際は、IPlayer と IGameMaster のインターフェースを実装して仕様を満たす Player, GameMaster クラスを実装して下さい。
 *  - Card クラスなどすでに実装済みの部分もあるので、lib/babanuki.ts のコードも活用しながら実装してください。
 *  - GameMaster クラスの run メソッドが実行されるとゲームが実行できるようにしてください。
 */

import {
  Card,
  getRandomIndex,
  IPlayer,
  IGameMaster,
  ILogger,
  Logger,
} from "../lib/babanuki";

export class Player implements IPlayer {
  hands: Card[];
  name: string;

  constructor(name: string) {
    this.name = name;
    this.hands = [];
  }

  get done(): boolean {
    return this.hands.length === 0;
  }

  get isLose(): boolean {
    return this.hands.length === 1 && this.hands[0].isJoker;
  }

  discardCards(cards: Card[]): Card[] {
    // valueごとにグループ化
    const groups = cards.reduce<Record<number, Card[]>>((acc, card) => {
      if (!acc[card?.value]) {
        acc[card.value] = [];
      }
      acc[card.value].push(card);
      return acc;
    }, {});
    const discardCards: Card[] = [];
    for (const group of Object.values(groups)) {
      if (group.length === 2 || group.length === 4) {
        // 2枚または4枚はそのまま捨てる
        discardCards.push(...group);
      } else if (group.length === 3) {
        // 3枚の場合は先頭から2枚を捨てる
        const selected = group.slice(0, 2);
        discardCards.push(...selected);
      }
    }
    this.hands = this.hands.filter((card) => !discardCards.includes(card));
    return discardCards;
  }

  drawCard(nextPlayer: IPlayer): Card {
    // nextPlayerからカードを選ぶ
    const randomIndex = getRandomIndex(nextPlayer.hands.length);
    const drawCard = nextPlayer.hands[randomIndex];
    // nextPlayerからカードを抜く
    nextPlayer.hands.splice(randomIndex, 1);
    // 自分の手札にカードを加える
    this.hands.push(drawCard);

    return drawCard;
  }
}

export class GameMaster implements IGameMaster {
  logger: ILogger;
  cards: Card[] = Card.prepare();
  players: IPlayer[];
  rank: IPlayer[] = [];
  turn: number = 1;
  loser: IPlayer | null = null;

  constructor(logger: ILogger, players: IPlayer[]) {
    this.logger = logger;
    this.players = players;
  }

  run() {
    let flag: Record<number, boolean> = {};
    for (let i = 0; i < this.cards.length; i++) {
      const index = getRandomIndex(this.cards.length, flag);
      this.players[i % this.players.length].hands.push(this.cards[index]);
      flag[index] = true;
    }

    this.logger.firstDiscard();
    this.players.map((player) => {
      this.logger.currentState(this.turn, player);
      const discardCards: Card[] = player.discardCards(player.hands);
      this.logger.discard(player, discardCards);
      this.turn += 1;
    });

    this.logger.start();
    while (this.rank.length < this.players.length - 1 && this.loser === null) {
      for (let index = 0; index < this.players.length; index++) {
        const player = this.players[index];
        // playerがゲームに参加しているかを確認する。ゲームに参加していな場合は次のPlayerに移動する
        if (this.rank.includes(player)) {
          continue;
        }
        // 次のPlayerを探す
        let nextIndex = (index + 1) % this.players.length; // 最初の相手の候補
        let nextPlayer = this.players[nextIndex];
        while (this.rank.includes(nextPlayer)) {
          nextIndex = (nextIndex + 1) % this.players.length; // 次のプレイヤー
          nextPlayer = this.players[nextIndex];
          if (nextPlayer === player) {
            // 自分自身しか残っていない場合
            this.loser = player;
            break;
          }
        }

        if (!this.rank.includes(player)) {
          this.logger.currentState(this.turn, player);

          // draw card
          const drawCard = player.drawCard(nextPlayer);
          this.logger.draw(player, nextPlayer, drawCard);

          // discard card if match
          const discardCards: Card[] = player.discardCards(player.hands);
          this.logger.discard(player, discardCards);
          this.turn += 1;

          //playerのカードの枚数が0枚であればゲームから抜けたことを出力する
          if (player.done) {
            this.rank.push(player);
            this.logger.done(player);
            continue;
          }
          //playerのカードの枚数がjoker1枚のみとき、ゲームを終了する
          if (player.isLose) {
            this.loser = player;
            break;
          }
          //nextplayerのカードの枚数が0枚であればゲームから抜けたことを出力する
          if (nextPlayer.done) {
            this.rank.push(nextPlayer);
            this.logger.done(nextPlayer);
            continue;
          }
          //nextplayerのカードの枚数がjoker1枚のみとき、ゲームを終了する
          if (nextPlayer.isLose) {
            this.loser = nextPlayer;
            break;
          }
        }
      }
    }
    if (this.loser !== null) {
      this.logger.end(this.loser, this.rank);
    } else {
      throw new Error("Loser is null. Cannot end the game.");
    }
  }
}

// [編集不要] ターミナルでの実行用の関数。
export function run() {
  const gameMaster = new GameMaster(new Logger(), [
    new Player("Alice"),
    new Player("Bob"),
    new Player("Charlie"),
    new Player("David"),
  ]);
  gameMaster.run();
}
