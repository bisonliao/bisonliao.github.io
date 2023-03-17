const VARIETY_DIAMOND = 0; // 方片
const VARIETY_HEART = 1; // 红桃
const VARIETY_CLUB = 2; // 梅花
const VARIETY_SPADE = 3; // 黑桃

const COMBINATION_ROYALFLUSH = 9; // 皇家同花顺
const COMBINATION_STRAIGHT_FLUSH = 8; // 同花顺
const COMBINATION_FOUR_OF_A_KIND = 7; //四条
const COMBINATION_FULL_HOUSE = 6; // 葫芦
const COMBINATION_FLUSH = 5; // 同花
const COMBINATION_STRAIGHT = 4; // 顺子
const COMBINATION_THREE_OF_A_KIND = 3; //三条
const COMBINATION_TOW_PAIR = 2; // 两对
const COMBINATION_PAIR = 1; // 一对
const COMBINATION_HIGH_CARD = 0; // 散牌

class TexasPoker {
    getCards() {
        return this.m_cards;
    }

    shuffleList(cards)
    {
        let newCards = [];
        while (true) {
            let len = cards.length;
            if (len < 1)
            {
                break;
            }
            let i = Math.random() * len;
            i = Math.floor(i);
            newCards.push(cards[i]);

            cards.splice(i, 1);
        }
        return newCards;
    }

    InitCardsAndShuffle()
    {
        let cards = [];
        for (let i = 2; i < 15; ++i)
        {
            for (let j = 0; j < 4; ++j)
            {
                let c = new Card(i, j);
                cards.push(c);
            }
        }

        return this.shuffleList(cards);
    }
    constructor()
    {
        this.m_cards = this.InitCardsAndShuffle();
    }
    SortCards(cards)
    {
        cards.sort(function(a,b){return a.getPoint() - b.getPoint();});
        return cards;
    }
    JudgeCombination1(fiveCards)
    {
        return this.JudgeCombination(fiveCards[0], fiveCards[1],fiveCards[2],fiveCards[3],fiveCards[4]);
    }

    JudgeCombination(a, b, c, d, e)
    {
        let sameVariety = false; // 同花标志

        if (a.getVariety() == b.getVariety() &&
            b.getVariety() == c.getVariety() &&
            c.getVariety() == d.getVariety() &&
            d.getVariety() == e.getVariety()) // 同花
        {
            sameVariety = true;
        }
        let cards = [];
        cards.push(a);
        cards.push(b);
        cards.push(c);
        cards.push(d);
        cards.push(e);
        this.SortCards(cards);
        let step = cards[1].getPoint() - cards[0].getPoint();


        let ordinal = false; //顺子标志
        if (step == 1) { ordinal = true;}
        for (let i = 1; i < 4; ++i)
        {
            if (cards[i+1].getPoint() - cards[i].getPoint() != step)
            {
                ordinal = false;
                break;
            }
        }
        let fourSame = false; //四条
        if (cards[0].getPoint() == cards[1].getPoint() &&
            cards[1].getPoint() == cards[2].getPoint() &&
            cards[2].getPoint() == cards[3].getPoint() ||
            cards[1].getPoint() == cards[2].getPoint() &&
            cards[2].getPoint() == cards[3].getPoint() &&
            cards[3].getPoint() == cards[4].getPoint()
        )
        {
            fourSame = true;
        }

        if (ordinal && sameVariety)
        {
            if (cards[4].getPoint() == 14)
            {
                return COMBINATION_ROYALFLUSH;
            }
            return COMBINATION_STRAIGHT_FLUSH;
        }
        if (fourSame)
        {
            return COMBINATION_FOUR_OF_A_KIND;
        }
        // fullHouse
        if (cards[0].getPoint() == cards[1].getPoint() &&
            cards[1].getPoint() == cards[2].getPoint() &&
            cards[3].getPoint() == cards[4].getPoint() ||
            cards[0].getPoint() == cards[1].getPoint() &&
            cards[2].getPoint() == cards[3].getPoint() &&
            cards[3].getPoint() == cards[4].getPoint()
        )
        {
            return COMBINATION_FULL_HOUSE;
        }
        if (sameVariety)
        {
            return COMBINATION_FLUSH;
        }
        if (ordinal)
        {
            return COMBINATION_STRAIGHT;
        }
        // 三条
        if (cards[0].getPoint() == cards[1].getPoint() &&  cards[1].getPoint() == cards[2].getPoint() ||
            cards[3].getPoint() == cards[4].getPoint()  &&  cards[2].getPoint() == cards[3].getPoint()  ||
            cards[1].getPoint() == cards[2].getPoint()  &&  cards[2].getPoint() == cards[3].getPoint())
        {
            return COMBINATION_THREE_OF_A_KIND;
        }
        let pairNum = 0;
        for (let i = 0; i < cards.length-1; ++i)
        {
            if (cards[i].getPoint() == cards[i+1].getPoint())
            {
                pairNum++;
                i++;
            }
        }
        if (pairNum == 2)
        {
            return COMBINATION_TOW_PAIR;
        }
        if (pairNum == 1)
        {
            return COMBINATION_PAIR;
        }
        return COMBINATION_HIGH_CARD;
    }


    removeCardFromList(a)
    {
        let i = 0;
        for (i = 0; i < this.m_cards.length; i++)
        {
            if (this.m_cards[i].getPoint() == a.getPoint() &&
                this.m_cards[i].getVariety() == a.getVariety())
            {
                this.m_cards.splice(i, 1);
                break;
            }
        }
    }
    ThreeCardOnDest(a, b, c)
    {
        this.removeCardFromList(a);
        this.removeCardFromList(b);
        this.removeCardFromList(c);

        let totalNum = 0;
        let count = []; // ten combinations
        for (let i = 0; i < 10; ++i)
        {
            count.push(0);
        }
        for (let i = 0; i < this.m_cards.length; ++i)
        {
            for (let j = 0; j < this.m_cards.length; ++j)
            {
                if (i == j)
                {
                    continue;
                }
                let d = this.m_cards[i];
                let e = this.m_cards[j];
                let combination = this.JudgeCombination(a, b, c, d, e);
                count[combination]++;
                totalNum++;
            }
        }
        if (totalNum == 0)
        {
            return;
        }
        let result = "";
        result = result + (""+a.getPoint()+","+a.getVariety());
        result = result + "\n";
        result = result + (""+b.getPoint()+","+b.getVariety());
        result = result + "\n";
        result = result + (""+c.getPoint()+","+c.getVariety());
        result = result + "\n";
        result = result + (">>>>>>>" + totalNum);
        result = result + "\n";


        result = result + ("皇家同花顺: " + (count[9]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("同花顺：" + (count[8]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("四条：" + (count[7]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("葫芦：" + (count[6]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("同花：" + (count[5]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("顺子：" + (count[4]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("三条：" + (count[3]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("两对：" + (count[2]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("一对：" + (count[1]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("散户：" + (count[0]* 1.0 / totalNum));
        result = result + "\n";
        return result;

    }

    FourCardOnDest(a, b, c, d)
    {
        this.removeCardFromList(a);
        this.removeCardFromList(b);
        this.removeCardFromList(c);
        this.removeCardFromList(d);

        let totalNum = 0;
        let count = []; // ten combinations
        for (let i = 0; i < 10; ++i)
        {
            count[i] = 0;
        }
        for (let i = 0; i < this.m_cards.length; ++i)
        {
            for (let j = 0; j < this.m_cards.length; ++j)
            {
                if (i == j)
                {
                    continue;
                }
                let f = this.m_cards[i];
                let e = this.m_cards[j];

                let maxCombination = -1;


                let  p = 0;
                for (p = 0; p < 6; ++p)
                {
                    let sixCards = [];
                    sixCards.push(a);
                    sixCards.push(b);
                    sixCards.push(c);
                    sixCards.push(d);
                    sixCards.push(e);
                    sixCards.push(f);

                    sixCards.splice(p, 1);

                    let combination = this.JudgeCombination1(sixCards);
                    if (combination > maxCombination)
                    {
                        maxCombination = combination;
                    }

                }
                count[maxCombination]++;
                totalNum++;


            }
        }
        if (totalNum == 0)
        {
            return;
        }
        let result = "";
        result = result + (""+a.getPoint()+","+a.getVariety());
        result = result + "\n";
        result = result + (""+b.getPoint()+","+b.getVariety());
        result = result + "\n";
        result = result + (""+c.getPoint()+","+c.getVariety());
        result = result + "\n";
        result = result + (""+d.getPoint()+","+d.getVariety());
        result = result + "\n";
        result = result + (">>>>>>>" + totalNum);
        result = result + "\n";


        result = result + ("皇家同花顺: " + (count[9]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("同花顺：" + (count[8]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("四条：" + (count[7]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("葫芦：" + (count[6]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("同花：" + (count[5]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("顺子：" + (count[4]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("三条：" + (count[3]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("两对：" + (count[2]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("一对：" + (count[1]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("散户：" + (count[0]* 1.0 / totalNum));
        result = result + "\n";
        return result;

    }
    FiveCardOnDest(a, b, c, d, e)
    {
        this.removeCardFromList(a);
        this.removeCardFromList(b);
        this.removeCardFromList(c);
        this.removeCardFromList(d);
        this.removeCardFromList(e);

        let totalNum = 0;
        let count = []; // ten combinations
        for (let i = 0; i < 10; ++i)
        {
            count[i] = 0;
        }

        for (let i = 0; i < this.m_cards.length; ++i)
        {
            for (let j = 0; j < this.m_cards.length; ++j)
            {
                if (i == j)
                {
                    continue;
                }
                let f = this.m_cards[i];
                let g = this.m_cards[j];

                let maxCombination = -1;


                let p = 0;
                let q = 0;
                for (p = 0; p < 7; ++p)
                {
                    let sevenCards = [];
                    sevenCards.push(a);
                    sevenCards.push(b);
                    sevenCards.push(c);
                    sevenCards.push(d);
                    sevenCards.push(e);
                    sevenCards.push(f);
                    sevenCards.push(g);

                    sevenCards.splice(p, 1);
                    for (q = 0; q < sevenCards.length;++q)
                    {
                        let sixCards = [];
                        sixCards.push(sevenCards[0]);
                        sixCards.push(sevenCards[1]);
                        sixCards.push(sevenCards[2]);
                        sixCards.push(sevenCards[3]);
                        sixCards.push(sevenCards[4]);
                        sixCards.push(sevenCards[5]);

                        sixCards.splice(q, 1);
                        let combination = this.JudgeCombination1(sixCards);
                        if (combination > maxCombination)
                        {
                            maxCombination = combination;
                        }



                    }

                }
                count[maxCombination]++;
                totalNum++;
            }
        }
        if (totalNum == 0)
        {
            return;
        }

        let result = "";
        result = result + (""+a.getPoint()+","+a.getVariety());
        result = result + "\n";
        result = result + (""+b.getPoint()+","+b.getVariety());
        result = result + "\n";
        result = result + (""+c.getPoint()+","+c.getVariety());
        result = result + "\n";
        result = result + (""+d.getPoint()+","+d.getVariety());
        result = result + "\n";
        result = result + (""+e.getPoint()+","+e.getVariety());
        result = result + "\n";
        result = result + (">>>>>>>" + totalNum);
        result = result + "\n";


        result = result + ("皇家同花顺: " + (count[9]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("同花顺：" + (count[8]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("四条：" + (count[7]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("葫芦：" + (count[6]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("同花：" + (count[5]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("顺子：" + (count[4]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("三条：" + (count[3]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("两对：" + (count[2]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("一对：" + (count[1]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("散户：" + (count[0]* 1.0 / totalNum));
        result = result + "\n";
        return result;

    }

    TwoCardInHand(a, b)
    {
        this.removeCardFromList(a);
        this.removeCardFromList(b);


        let totalNum = 0;
        let count = []; // ten combinations
        for (let i = 0; i < 10; ++i)
        {
            count[i] = 0;
        }

        for (let i = 0; i < this.m_cards.length; ++i)
        {
            for (let j = 0; j < this.m_cards.length; ++j)
            {
                for (let k = 0; k < this.m_cards.length; ++k)
                {
                    if (i == j || j == k || i == k) {
                        continue;
                    }
                    let c = this.m_cards[i];
                    let d = this.m_cards[j];
                    let e = this.m_cards[k];


                    let combination = this.JudgeCombination(a,b, c, d, e);

                    count[combination]++;
                    totalNum++;
                }
            }
        }
        if (totalNum == 0)
        {
            return;
        }

        let result = "";
        result = result + (""+a.getPoint()+","+a.getVariety());
        result = result + "\n";
        result = result + (""+b.getPoint()+","+b.getVariety());
        result = result + "\n";

        result = result + (">>>>>>>" + totalNum);
        result = result + "\n";


        result = result + ("皇家同花顺: " + (count[9]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("同花顺：" + (count[8]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("四条：" + (count[7]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("葫芦：" + (count[6]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("同花：" + (count[5]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("顺子：" + (count[4]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("三条：" + (count[3]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("两对：" + (count[2]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("一对：" + (count[1]* 1.0 / totalNum));
        result = result + "\n";
        result = result + ("散户：" + (count[0]* 1.0 / totalNum));
        result = result + "\n";
        return result;

    }

}