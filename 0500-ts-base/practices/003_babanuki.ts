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

  pairCards(cards: Card[]): Card[] {
    // valueごとにグループ化
    const groups = cards.reduce<Record<number, Card[]>>((acc, card) => {
      if (!acc[card.value]) {
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

  drawCard(card: Card): void {
    this.hands.push(card);
  }
  giveCardToOpponent(card: Card): void {
    this.hands = this.hands.filter((hand) => hand !== card);
  }
}

export class GameMaster implements IGameMaster {
  logger: ILogger;
  cards: Card[];
  players: IPlayer[];
  rank: IPlayer[];
  turn: number;
  loser: IPlayer | null;

  // Fisher-Yates Shuffleアルゴリズムを使い、deckをランダムにシャッフル
  shuffleDeck(cards: Card[]): Card[] {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }
  distributeCards(shuffledDeck: Card[], indices: number[], player: IPlayer) {
    indices.forEach((index) => {
      player.hands.push(shuffledDeck[index]);
    });
  }

  constructor(logger: ILogger, players: IPlayer[]) {
    this.logger = logger;
    this.players = players;
    this.turn = 1;
    this.cards = Card.prepare();
    this.rank = [];
    this.loser = null;
  }

  run() {
    const shuffledDeck = this.shuffleDeck(this.cards);
    const distributionIndices = [
      [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49], // Player 0
      [2, 3, 10, 11, 18, 19, 26, 27, 34, 35, 42, 43, 50, 51], // Player 1
      [4, 5, 12, 13, 20, 21, 28, 29, 36, 37, 44, 45, 52], // Player 2
      [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47], // Player 3
    ];
    this.players.forEach((player, index) => {
      const indices = distributionIndices[index];
      this.distributeCards(shuffledDeck, indices, player);
    });

    this.logger.firstDiscard();
    this.players.map((player) => {
      this.logger.currentState(this.turn, player);
      const discardCards: Card[] = player.pairCards(player.hands);
      this.logger.discard(player, discardCards);
      this.turn += 1;
    });

    this.logger.start();
    while (this.rank.length < 3 || this.loser === null) {
      for (let index = 0; index < this.players.length; index++) {
        const player = this.players[index];
        const opponentPlayer = this.players[(index + 1) % this.players.length];

        if (player === opponentPlayer) {
          this.loser = player;
          break; // ループを終了
        }

        // 前のターンで手札を引かれて0になった場合勝利する
        if (player.hands.length === 0) {
          this.rank.push(player);
          this.logger.done(player);
          if (this.players.length === 2) {
            this.loser = opponentPlayer;
            break;
          }
        }
        //カードの枚数がjoker1枚のみとき、ゲームを終了する
        if (player.hands.length === 1 && player.hands[0].isJoker) {
          this.loser = player;
          break;
        }

        if (!this.rank.includes(player)) {
          console.log(`${this.turn} ===========`);
          this.logger.currentState(this.turn, player);

          const randomIndex = getRandomIndex(opponentPlayer.hands.length);
          const drawCard = opponentPlayer.hands[randomIndex];
          this.logger.draw(player, opponentPlayer, drawCard);

          player.drawCard(drawCard);
          opponentPlayer.giveCardToOpponent(drawCard);

          const discardCards: Card[] = player.pairCards(player.hands);
          this.logger.discard(player, discardCards);
          this.turn += 1;

          //カードの枚数が0枚であればゲームから抜けたことを出力する
          if (player.hands.length === 0) {
            this.rank.push(player);
            this.logger.done(player);
            if (this.players.length === 2) {
              this.loser = opponentPlayer;
              break;
            }
          }
          //カードの枚数がjoker1枚のみとき、ゲームを終了する
          if (player.hands.length === 1 && player.hands[0].isJoker) {
            this.loser = player;
            break;
          }
        }
      }
      // 1じゅんした場合、参加しているplayerの中からゲームから抜けたplayerを除外する
      this.players = this.players.filter(
        (player) => !this.rank.includes(player)
      );
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
