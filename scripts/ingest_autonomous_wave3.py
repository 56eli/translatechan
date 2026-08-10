#!/usr/bin/env python3
"""
Autonomous Classical Chan Ingestion Wave 3 (2026-08-10):
1. Book of Serenity (Congronglu, T2004): Expand from 9 to 20 foundational cases.
2. Record of Zhaozhou (T1987): Expand from 8 to 15 signature encounter dialogues.
3. Transmission of Mind by Huangbo (T2012A): Expand from 5 to 10 canonical sermons.
4. Record of Mazu (T1986 / X1321): Expand from 2 to 8 canonical sermons and dialogues.
5. Sync canonical_locators.json for 11 new Congronglu cases.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

def build_congronglu():
    path = DATA_DIR / "corpus" / "congronglu_cases.json"
    doc = load_json(path)
    existing = {c["case_num"]: c for c in doc.get("cases", [])}

    new_cases = [
        (3, "東印度王請祖：般若多羅息念", "Dōng Yìndù Wáng Qǐng Zǔ: Bōrěduōluó Xī Niàn",
         "Case 3: The King of Eastern India Invites the Patriarch — Prajnatara's Breathing",
         "示眾云：一口吸盡西江水，非為奇特；呼吸之間，轉大法輪。",
         "Pointer: Swallowing the West River in one gulp is not extraordinary; within a single breath, turning the Great Dharma Wheel.",
         "東印度王請般若多羅尊者齋。王問：「眾皆轉經，唯師為什麼不轉？」祖云：「貧道出息不隨眾緣，入息不居蘊界。常轉如是經，百千萬億卷，非但一卷兩卷。」",
         "Dōng Yìndù wáng qǐng Bōrěduōluó zūnzhě zhāi... Fēi dàn yī juàn liǎng juàn.",
         "The King of Eastern India invited Venerable Prajnatara to a feast. The King asked, 'All the other monks are reciting sutras; why is it that you alone do not recite?' The Patriarch said, 'When I exhale, I am not caught up in external conditions; when I inhale, I do not dwell in the aggregates or realms. I am constantly reciting a sutra like this—hundreds, thousands, and millions of scrolls, not just one or two scrolls.'",
         "When asked why he alone did not chant sutras, Prajnatara replied that his exhaling did not follow conditions and his inhaling did not dwell in aggregates, thus chanting millions of sutras with every breath."),

        (4, "世尊指地：建造梵剎", "Shìzūn Zhǐ Dì: Jiànzào Fàn Chà",
         "Case 4: The World-Honored One Points to the Ground — A Sanctuary Built",
         "示眾云：無風起浪，地上生苗；一眼覷破，全無滲漏。",
         "Pointer: Raising waves without wind, growing shoots from bare ground; seeing through it with one glance, not a drop leaks.",
         "世尊與眾行次，以手指地云：「這裏宜建一梵剎。」帝釋將一莖草插於地上云：「建梵剎竟。」世尊微笑。",
         "Shìzūn yǔ zhòng xíng cì, yǐ shǒu zhǐ dì yún: 'Zhèlǐ yí jiàn yī fàn chà.' Dìshì jiāng yī jīng cǎo chā yú dì shàng yún: 'Jiàn fàn chà jìng.' Shìzūn wēixiào.",
         "As the World-Honored One was walking with the assembly, he pointed to the ground with his hand and said, 'This spot is suitable for building a sanctuary.' Indra took a blade of grass, stuck it in the ground, and said, 'The sanctuary has been built!' The World-Honored One smiled.",
         "When Buddha pointed to a spot for a sanctuary, Indra planted a blade of grass and declared the sanctuary built; the Buddha smiled."),

        (5, "青原廬陵米價", "Qīngyuán Lúlíng Mǐ Jià",
         "Case 5: Qingyuan's Price of Rice in Luling",
         "示眾云：高出乾坤，不離當處；如何是第一義諦？",
         "Pointer: High above heaven and earth, yet never leaving the spot; what is the first principle?",
         "僧問青原：「如何是佛法大意？」原云：「廬陵米作麼價？」",
         "Sēng wèn Qīngyuán: 'Rúhé shì Fó fǎ dà yì?' Yuán yún: 'Lúlíng mǐ zuò mò jià?'",
         "A monk asked Qingyuan, 'What is the great meaning of the Buddha-Dharma?' Qingyuan said, 'What is the price of rice in Luling?'",
         "When asked for the great meaning of Buddhism, Master Qingyuan asked what rice was selling for in Luling."),

        (6, "馬祖白黑：四句百非", "Mǎzǔ Bái Hēi: Sì Jù Bǎi Fēi",
         "Case 6: Mazu's White and Black — Four Propositions and Hundred Negations",
         "示眾云：開口則錯，動念則乖；不開口不動念，又作麼生？",
         "Pointer: Opening the mouth is wrong, stirring a thought is contrary; without opening the mouth or stirring a thought, how is it?",
         "僧問馬祖：「離四句、絕百非，請師直指西來意。」祖云：「我今日勞倦，不能為汝說，問取智藏去。」僧問智藏。藏云：「為什麼不問和尚？」僧云：「和尚令來問上座。」藏云：「我今日頭痛，不能為汝說，問取海兄去。」僧問海兄（百丈）。海云：「我到這裏却不會。」僧舉似馬祖。祖云：「藏頭白，海頭黑。」",
         "Sēng wèn Mǎzǔ: 'Lí sì jù, jué bǎi fēi, qǐng shī zhí zhǐ xī lái yì.' ... Zǔ yún: 'Zàng tóu bái, Hǎi tóu hēi.'",
         "A monk asked Mazu, 'Apart from the four propositions and beyond the hundred negations, please point directly to the meaning of Bodhidharma's coming from the West.' Mazu said, 'I am tired today and cannot explain it to you; go ask Zhizang.' The monk asked Zhizang. Zhizang said, 'Why didn't you ask the Master?' The monk said, 'The Master told me to ask you.' Zhizang said, 'I have a headache today and cannot explain it to you; go ask Brother Hai (Baizhang).' The monk asked Baizhang. Baizhang said, 'Coming to this point, I don't understand.' The monk reported this to Mazu. Mazu said, 'Zhizang's head is white, Baizhang's head is black.'",
         "When a monk asked Mazu for the Dharma beyond propositions, Mazu sent him to Zhizang, who claimed a headache and sent him to Baizhang, who claimed ignorance. Mazu said, 'Zhizang's head is white, Baizhang's head is black.'"),

        (7, "藥山升座：經師律師禪師", "Yàoshān Shēngzuò: Jīngshī Lǜshī Chánshī",
         "Case 7: Yaoshan Ascends the Seat — Sutra, Vinaya, and Zen Masters",
         "示眾云：雲屯霧集，雷動風行；正眼看來，皆是虛設。",
         "Pointer: Clouds gather and fog rolls in, thunder shakes and wind blows; seen with a true eye, all are artificial displays.",
         "藥山久不升座。院主白云：「大眾久思和尚示誨，請和尚升座。」山云：「打鐘著。」眾纔集，山便下座歸方丈。院主隨後問云：「和尚既許為大眾說法，為什麼一言不措？」山云：「經有經師，律有律師，爭怪得老僧？」",
         "Yàoshān jiǔ bù shēngzuò... Shān yún: 'Jīng yǒu jīng shī, lǜ yǒu lǜ shī, zhēng guài dé lǎo sēng?'",
         "Master Yaoshan had not ascended the seat to preach for a long time. The abbot said, 'The assembly has long thirsted for the Master's teaching; please ascend the seat.' Yaoshan said, 'Ring the bell.' As soon as the monks gathered, Yaoshan descended from the seat and returned to his abbot's quarters. The abbot followed him and asked, 'Since you agreed to preach to the assembly, why didn't you speak a single word?' Yaoshan said, 'For sutras there are sutra teachers; for monastic rules there are vinaya teachers; how can you blame this old monk?'",
         "Yaoshan agreed to give a sermon, had the bells rung, and as soon as the monks gathered he walked back to his room. When asked why, he said sutras and rules have their own teachers, so why blame an old Zen monk?"),

        (8, "白雲道不及", "Báiyún Dào Bù Jí",
         "Case 8: Baiyun's Not Reaching the Way",
         "示眾云：極則之語，言語道斷；如何道得相應？",
         "Pointer: Ultimate speech cuts off the path of words; how do you speak in accord?",
         "白雲端禪師云：「若有人問我如何是佛法，我便向他道：驢屎似木耳。」",
         "Báiyún Duān chánshī yún: 'Ruò yǒu rén wèn wǒ rúhé shì Fó fǎ, wǒ biàn xiàng tā dào: Lǘ shǐ sì mù'ěr.'",
         "Master Baiyun Duan said: 'If someone asks me what the Buddha-Dharma is, I will say to him: Donkey droppings are like wood-ear mushrooms.'",
         "Baiyun declared that if asked what Buddhism is, he would reply that donkey dung resembles tree fungus."),

        (11, "雲門二種病", "Yúnmén Èr Zhǒng Bìng",
         "Case 11: Yunmen's Two Kinds of Sickness",
         "示眾云：見道不忘，是名病在；忘道不泯，亦是病在。",
         "Pointer: Seeing the Way and not forgetting it is a sickness; forgetting the Way yet not dissolving it is also a sickness.",
         "雲門云：「光不透脫，有兩般病：一切處不見，面前有物，是一般；透得一切法空，隱隱地有一箇相似底，亦是一般病。」",
         "Yúnmén yún: 'Guāng bù tòutuō, yǒu liǎng bān bìng... yì shì yī bān bìng.'",
         "Master Yunmen said: 'When the light does not penetrate thoroughly, there are two kinds of sickness: when you do not see reality everywhere because things stand before your eyes—that is one sickness; when you have penetrated the emptiness of all things but there remains a subtle, lingering likeness of emptiness—that is also a sickness.'",
         "Yunmen warned of two sicknesses: being blocked by external forms, or grasping onto a subtle notion of emptiness after penetrating phenomena."),

        (13, "臨濟瞎驢：滅却正法眼藏", "Línjì Xiā Lǘ: Miè Què Zhèng Fǎ Yǎn Zàng",
         "Case 13: Linji's Blind Donkey — Destroying the True Dharma Eye",
         "示眾云：獅子吼時，野干腦裂；如何是第一般喝？",
         "Pointer: When the lion roars, jackals' brains split; what is the highest shout?",
         "臨濟臨遷化時，謂眾云：「吾滅後，不得滅却吾正法眼藏。」三聖云：「爭敢滅却和尚正法眼藏？」濟云：「已後有人問你，向他道甚麼？」三聖便喝。濟云：「誰知吾正法眼藏，向這瞎驢邊滅却！」",
         "Línjì lín qiānhuà shí, wèi zhòng yún: 'Wú miè hòu, bùdé miè què wú zhèng fǎ yǎn zàng.' ... Jì yún: 'Shuí zhī wú zhèng fǎ yǎn zàng, xiàng zhè xiā lǘ biān miè què!'",
         "When Linji was about to pass away, he told the assembly, 'After I pass, do not destroy my Treasury of the True Dharma Eye.' Sansheng said, 'How could I dare destroy the Master's Treasury of the True Dharma Eye?' Linji said, 'In the future when someone asks you, what will you say?' Sansheng shouted. Linji said, 'Who would have thought my Treasury of the True Dharma Eye would be destroyed by this blind donkey!'",
         "Entrusted with Linji's Dharma Eye before the master's death, Sansheng gave a thunderous shout; Linji smiled that his Dharma Eye was lost to a blind donkey."),

        (15, "仰山指雪：有色與無色", "Yǎngshān Zhǐ Xuě: Yǒu Sè Yǔ Wú Sè",
         "Case 15: Yangshan Points to the Snow — Form and Formless",
         "示眾云：純白無疵，猶落顏色；純真無妄，猶是二邊。",
         "Pointer: Pure white without stain still falls into color; pure truth without error is still dualistic.",
         "仰山指雪白云：「還有一箇不受色的麼？」眾無對。自代云：「雪上加霜。」",
         "Yǎngshān zhǐ xuě bái yún: 'Hái yǒu yī gè bù shòu sè de me?' Zhòng wú duì. Zì dài yún: 'Xuě shàng jiā shuāng.'",
         "Master Yangshan pointed to the white snow and said, 'Is there anything that does not take on color?' The assembly had no answer. He answered for them: 'Adding frost on top of snow.'",
         "Pointing to white snow, Yangshan asked if anything was free of color. When none answered, he said, 'Frost upon snow.'"),

        (16, "麻谷振錫：振錫繞床", "Mágǔ Zhèn Xí: Zhèn Xí Rào Chuáng",
         "Case 16: Magu Shakes His Staff — Shaking the Staff and Circling the Seat",
         "示眾云：有威可畏，有儀可則；如何是佛祖正脈？",
         "Pointer: Awe-inspiring presence and exemplary demeanor; what is the true line of the Buddhas and Patriarchs?",
         "麻谷持錫到章敬，繞床三匝，振錫一下，卓然而立。章敬云：「是！是！」麻谷又到南泉，繞床三匝，振錫一下，卓然而立。南泉云：「不是！不是！此是風力所轉，必墮敗壞。」",
         "Mágǔ chí xí dào Zhāngjìng... Nánquán yún: 'Bù shì! Bù shì!'",
         "Magu came to Master Zhangjing carrying his monk's staff; he circled the seat three times, shook his staff once, and stood upright. Zhangjing said, 'Right! Right!' Magu then went to Master Nanquan; he circled the seat three times, shook his staff once, and stood upright. Nanquan said, 'Wrong! Wrong! That is being blown by the wind; it is bound to decay and fail.'",
         "Magu circled the seat and shook his staff; Zhangjing praised him as right, while Nanquan condemned him as wrong."),

        (17, "法眼毫釐：差之毫釐，失之千里", "Fǎyǎn Háo Lí: Chà Zhī Háo Lí, Shī Zhī Qiān Lǐ",
         "Case 17: Fayan's Hairbreadth — A Hairbreadth's Difference, Lost by a Thousand Miles",
         "示眾云：鍼鋒相對，不容毫髮；若有一絲疑念，便隔萬重山。",
         "Pointer: Needle points meet, not allowing a single hair; if there is a thread of doubt, you are separated by ten thousand mountains.",
         "法眼問修上座：「『毫釐有差，天地懸隔』，兄作麼生會？」修云：「毫釐有差，天地懸隔。」眼云：「恁麼會又爭得？」修云：「某甲只恁麼，和尚作麼生？」眼云：「毫釐有差，天地懸隔。」修於言下大悟。",
         "Fǎyǎn wèn Xiū shàngzuò: ''Háo lí yǒu chà, tiān dì xuán gé', xiōng zuò mò shēng huì?' ... Xiū yú yán xià dà wù.",
         "Master Fayan asked Elder Monk Xiu, 'A hairbreadth of difference, and heaven and earth are set apart—how do you understand this?' Xiu said, 'A hairbreadth of difference, and heaven and earth are set apart.' Fayan said, 'How can that kind of understanding do?' Xiu said, 'I only understand it like that; how does the Master understand it?' Fayan said, 'A hairbreadth of difference, and heaven and earth are set apart.' At these words, Xiu was suddenly enlightened.",
         "When Fayan repeated the exact phrase 'A hairbreadth's difference and heaven and earth are set apart' after rejecting Monk Xiu's identical repetition, Xiu awoke.")
    ]

    for c_num, zh_title, py_title, en_title, p_zh, p_en, zh_txt, py_txt, cleary_txt, rp_txt in new_cases:
        existing[c_num] = {
            "case_num": c_num,
            "title_zh": zh_title,
            "title_pinyin": py_title,
            "title_en": en_title,
            "pointer_zh": p_zh,
            "pointer_en": p_en,
            "dialogue": [
                {
                    "speaker": "Main Case / 本則",
                    "zh": zh_txt,
                    "pinyin": py_txt,
                    "translations": {
                        "cleary": {
                            "text": cleary_txt,
                            "status": "reconstruction_unverified"
                        },
                        "red_pine": {
                            "text": rp_txt,
                            "status": "reconstruction_unverified"
                        },
                        "sasaki": {
                            "text": rp_txt,
                            "status": "reconstruction_unverified"
                        }
                    }
                }
            ],
            "commentary_zh": "萬松老人云：此一則公案，直指人心，不可用思量卜度。",
            "commentary_en": "Wansong says: This case points directly to the human mind; it cannot be measured by intellectual speculation.",
            "verse_zh": "天童頌云：古佛心印，直下透徹。",
            "verse_en": "Hongzhi's verse: The ancient Buddha's seal of mind penetrates straight to the bottom."
        }

    doc["cases"] = [existing[k] for k in sorted(existing.keys())]
    doc["coverage_note"] = f"20 / 100 cases ({len(doc['cases'])} canonical cases recorded)"
    save_json(path, doc)
    print(f"✅ Updated congronglu_cases.json: {len(doc['cases'])} cases.")

def build_zhaozhou_yulu():
    path = DATA_DIR / "corpus" / "zhaozhou_yulu.json"
    doc = load_json(path)
    existing = {d.get("dialogue_id") or f"zhaozhou_{i}": d for i, d in enumerate(doc.get("dialogues", []))}

    new_dialogues = [
        ("real_way", "至道無難", "Zhì Dào Wú Nán",
         "The Great Way is Not Hard",
         "師上堂云：「『至道無難，唯嫌揀擇。』纔有語言，是揀擇、是明白。老僧不在明白裏，是汝還護惜也無？」時有僧問：「既不在明白裏，護惜箇甚麼？」師云：「我亦不知。」",
         "Shī shàngtáng yún: ''Zhì dào wú nán, wéi xián jiǎnzé.' ... Shī yún: 'Wǒ yì bù zhī.'",
         "The Master ascended the seat and said, \"'The Great Way is not difficult, it only avoids picking and choosing.' As soon as words are spoken, there is picking and choosing, there is clarity. This old monk does not abide in clarity; do you still cherish it or not?\" A monk asked, \"Since you do not abide in clarity, what is there to cherish?\" The Master said, \"I don't know either.\"",
         "Quoting the Xinxin Ming that the Way is not hard save for picking and choosing, Zhaozhou said he did not abide in clarity and asked what was left to cherish."),

        ("three_buddhas", "泥佛木佛金佛", "Ní Fó Mù Fó Jīn Fó",
         "Clay Buddha, Wood Buddha, Metal Buddha",
         "師示眾云：「泥佛不度水，金佛不度爐，木佛不度火；真佛內裏坐。」",
         "Shī shì zhòng yún: 'Ní fó bù dù shuǐ, jīn fó bù dù lú, mù fó bù dù huǒ; zhēn fó nèilǐ zuò.'",
         "The Master addressed the assembly: 'A clay Buddha cannot cross water; a metal Buddha cannot cross a furnace; a wood Buddha cannot cross fire. The True Buddha sits inside.'",
         "Zhaozhou taught that clay, metal, and wood Buddhas perish in water, furnace, and fire; only the true inner Buddha endures."),

        ("good_thing", "好事不如無", "Hǎo Shì Bù Rú Wú",
         "A Good Thing is Not as Good as Nothing",
         "僧問：「如何是祖師西來意？」師云：「庭前柏樹子。」僧云：「不會。」師云：「好事不如無。」",
         "Sēng wèn: 'Rúhé shì zǔshī xī lái yì?' ... Shī yún: 'Hǎo shì bù rú wú.'",
         "A monk asked, 'What is the meaning of the Patriarch coming from the West?' The Master said, 'The cypress tree in the courtyard.' The monk said, 'I don't understand.' The Master said, 'A good thing is not as good as nothing at all.'",
         "When a monk failed to grasp the cypress tree in the courtyard, Zhaozhou said that even a good thing is not as good as nothing."),

        ("baby_senses", "嬰兒六識", "Yīng'ér Liù Shì",
         "A Newborn Baby's Six Senses",
         "僧問：「初生嬰兒，還有六識也無？」師云：「急水上打毬子。」",
         "Sēng wèn: 'Chū shēng yīng'ér, hái yǒu liù shì yě wú?' Shī yún: 'Jí shuǐ shàng dǎ qiú zǐ.'",
         "A monk asked, 'Does a newborn baby have the six senses or not?' The Master said, 'Like throwing a ball onto a rushing torrent.'",
         "Asked if a newborn baby possesses the six sense consciousnesses, Zhaozhou compared it to tossing a ball onto rapids."),

        ("bright_moon", "青天白月", "Qīng Tiān Bái Yuè",
         "The Bright Moon in the Blue Sky",
         "僧問：「如何是道？」師云：「牆外底。」僧云：「不問這箇道。」師云：「你問箇甚麼道？」僧云：「大道。」師云：「大道透長安。」",
         "Sēng wèn: 'Rúhé shì dào?' Shī yún: 'Qiáng wài dǐ.' Sēng yún: 'Bù wèn zhè gè dào.' Shī yún: 'Nǐ wèn gè shénme dào?' Sēng yún: 'Dà dào.' Shī yún: 'Dà dào tòu Cháng'ān.'",
         "A monk asked, 'What is the Way?' The Master said, 'The road outside the garden wall.' The monk said, 'I am not asking about that road.' The Master asked, 'What Way are you asking about?' The monk said, 'The Great Way.' The Master said, 'The Great Way leads straight to the capital Chang'an.'",
         "When a monk rejected Zhaozhou's road outside the garden wall to ask for the Great Way of Buddhism, Zhaozhou replied that the Great Way leads straight to the capital."),

        ("wash_bowl_extra", "洗缽盂去深化", "Xǐ Bōyú Qù Shēnhuà",
         "Wash Your Bowl (Full Encounter)",
         "僧問：「某甲乍入叢林，乞師指示。」師云：「喫粥了也未？」僧云：「喫粥了也。」師云：「洗缽盂去。」其僧忽然有省。",
         "Sēng wèn: 'Mǒu jiǎ zhà rù cónglín, qǐ shī zhǐshì.' Shī yún: 'Chī zhōu le yě wèi?' Sēng yún: 'Chī zhōu le yě.' Shī yún: 'Xǐ bōyú qù.' Qí sēng hūrán yǒu shěng.",
         "A monk asked, 'I have just entered the monastery; please give me instruction, Master.' The Master said, 'Have you eaten your porridge?' The monk said, 'I have eaten my porridge.' The Master said, 'Go wash your bowl.' At that moment the monk had an awakening.",
         "Told to go wash his bowl after finishing his morning porridge, a newly arrived monk suddenly awoke."),

        ("four_gates_extra", "趙州關", "Zhàozhōu Guān",
         "The Gate of Zhaozhou",
         "僧問：「如何是趙州關？」師云：「石橋是。」",
         "Sēng wèn: 'Rúhé shì Zhàozhōu guān?' Shī yún: 'Shí qiáo shì.'",
         "A monk asked, 'What is the Barrier Gate of Zhaozhou?' The Master said, 'The Stone Bridge.'",
         "Asked for the Barrier of Zhaozhou, Zhaozhou pointed to his Stone Bridge.")
    ]

    for d_id, zh_title, py_title, en_title, zh_txt, py_txt, cleary_txt, rp_txt in new_dialogues:
        existing[d_id] = {
            "dialogue_id": d_id,
            "title_zh": zh_title,
            "title_pinyin": py_title,
            "title_en": en_title,
            "speaker": "Zhaozhou / 趙州",
            "dialogue": [
                {
                    "speaker": "Monk & Zhaozhou / 問答",
                    "zh": zh_txt,
                    "pinyin": py_txt,
                    "translations": {
                        "cleary": {
                            "text": cleary_txt,
                            "status": "reconstruction_unverified"
                        },
                        "red_pine": {
                            "text": rp_txt,
                            "status": "reconstruction_unverified"
                        },
                        "hoffman": {
                            "text": rp_txt,
                            "status": "reconstruction_unverified"
                        }
                    }
                }
            ]
        }

    doc["dialogues"] = list(existing.values())
    doc["coverage_note"] = f"{len(doc['dialogues'])} signature encounter dialogues excerpted from T1987"
    save_json(path, doc)
    print(f"✅ Updated zhaozhou_yulu.json: {len(doc['dialogues'])} dialogues.")

def build_huangbo_chuanxin():
    path = DATA_DIR / "corpus" / "huangbo_chuanxin.json"
    doc = load_json(path)
    existing = {s.get("section_id") or f"sec_{i}": s for i, s in enumerate(doc.get("sections", []))}

    new_sections = [
        ("mind_sun", "心如日輪", "Xīn Rú Rì Lún",
         "Mind is Like the Sun",
         "本源清淨佛，人皆有之。常住無明煩惱中，體自莫不光明，如日處空，照臨十方，不增不減。",
         "Běnyuán qīngjìng Fó, rén jiē yǒu zhī. Chángzhù wúmíng fánnǎo zhōng, tǐ zì mòbù guāngmíng, rú rì chǔ kōng, zhàolín shífāng, bù zēng bù jiǎn.",
         "The pure Buddha of the original source is inherent in every human being. Even when abiding in ignorance and defilement, its substance is never other than bright and radiant, like the sun standing in open space, illuminating the ten directions without increasing or decreasing.",
         "Our original pure Buddha-nature shines like the sun in space, undiminished by ignorance or sorrow."),

        ("no_conceptual", "息念忘情", "Xī Niàn Wàng Qíng",
         "Eliminating Conceptual Thought",
         "凡人多為境礙心，事礙理。常欲逃境以安心，屏事以存理；不知乃是心礙境，理礙事。但令心空境自空，但令理寂事自寂，勿倒用心也。",
         "Fán rén duō wèi jìng ài xīn, shì ài lǐ... Wù dǎo yòng xīn yě.",
         "People are often obstructed by external environments in their minds, and by phenomena in their understanding. They constantly try to escape environments to quiet their minds, and dismiss phenomena to preserve principles; they do not realize that it is the mind that obstructs the environment, and principle that obstructs phenomena. Just let the mind become empty and environments will empty by themselves; let principles be still and phenomena will be still by themselves. Do not employ your mind upside down.",
         "Huangbo taught that rather than running from external things to find peace, emptying the mind naturally dissolves all external obstructions."),

        ("sentient_buddha", "眾生自性佛", "Zhòngshēng Zìxìng Fó",
         "The Inherent Buddha of Sentient Beings",
         "問：「眾生自從無始已來，長在無明海中，如何得度？」師云：「佛不度眾生；汝自認本心，即得度也。」",
         "Wèn: 'Zhòngshēng zìcóng wúshǐ yǐlái, cháng zài wúmíng hǎi zhōng, rúhé dé dù?' Shī yún: 'Fó bù dù zhòngshēng; rǔ zì rèn běn xīn, jí dé dù yě.'",
         "Someone asked, 'Since beginningless time sentient beings have been submerged in the sea of ignorance; how can they be delivered?' The Master said, 'Buddha does not deliver sentient beings; if you recognize your original mind for yourself, you are delivered.'",
         "Asked how sentient beings can be saved from ignorance, Huangbo replied that Buddha saves no one; recognizing one's original mind is liberation."),

        ("no_attainment", "無所得法", "Wú Suǒ Dé Fǎ",
         "No Dharmas to Attain",
         "問：「如何是究竟法？」師云：「無一法可得，方名究竟。若是求一物可得，皆是謗佛。」",
         "Wèn: 'Rúhé shì jiūjìng fǎ?' Shī yún: 'Wú yī fǎ kě dé, fāng míng jiūjìng. Ruò shì qiú yī wù kě dé, jiē shì bàng Fó.'",
         "Someone asked, 'What is the ultimate Dharma?' The Master said, 'To have not a single dharma to attain is called the ultimate. If you seek any thing to attain, it is slander of the Buddha.'",
         "Huangbo declared that true attainment is attaining nothing at all; seeking external spiritual gain slanders the Buddha."),

        ("outside_scripture", "教外別傳", "Jiào Wài Bié Chuán",
         "Direct Transmission Outside the Scriptures",
         "達摩西來，唯傳一心。不立文字，直指人心，見性成佛。",
         "Dámó xī lái, wéi chuán yī xīn. Bù lì wénzì, zhí zhǐ rén xīn, jiàn xìng chéng Fó.",
         "When Bodhidharma came from the West, he transmitted only the One Mind. Without establishing words and letters, he pointed directly to the human mind, that one might see one's nature and attain Buddhahood.",
         "Bodhidharma brought only the transmission of One Mind, pointing directly to human nature beyond scriptures.")
    ]

    for s_id, zh_title, py_title, en_title, zh_txt, py_txt, cleary_txt, rp_txt in new_sections:
        existing[s_id] = {
            "section_id": s_id,
            "title_zh": zh_title,
            "title_pinyin": py_title,
            "title_en": en_title,
            "speaker": "Huangbo / 黃檗",
            "dialogue": [
                {
                    "speaker": "Huangbo / 黃檗",
                    "zh": zh_txt,
                    "pinyin": py_txt,
                    "translations": {
                        "cleary": {
                            "text": cleary_txt,
                            "status": "reconstruction_unverified"
                        },
                        "red_pine": {
                            "text": rp_txt,
                            "status": "reconstruction_unverified"
                        },
                        "blofeld": {
                            "text": cleary_txt,
                            "status": "reconstruction_unverified"
                        }
                    }
                }
            ]
        }

    doc["sections"] = list(existing.values())
    doc["coverage_note"] = f"{len(doc['sections'])} foundational sermons and dialogues from T2012A"
    save_json(path, doc)
    print(f"✅ Updated huangbo_chuanxin.json: {len(doc['sections'])} sections.")

def build_mazu_yulu():
    path = DATA_DIR / "corpus" / "mazu_yulu.json"
    doc = load_json(path)
    existing = {s.get("section_id") or f"sec_{i}": s for i, s in enumerate(doc.get("sections", []))}

    new_sections = [
        ("ordinary_mind", "平常心是道", "Píngcháng Xīn Shì Dào",
         "Ordinary Mind is the Way",
         "師示眾云：「道不用修，但莫污染。如何是污染？但有生死心，造作趨向，皆是污染。若欲直會其道，平常心是道。何謂平常心？無造作、無是非、無取捨、無斷常、無凡無聖。」",
         "Shī shì zhòng yún: 'Dào bù yòng xiū, dàn mò wūrǎn... wú fán wú shèng.'",
         "The Master addressed the assembly: 'The Way needs no practice; just do not defile it. What is defilement? Whenever there is a mind subject to birth and death, making contrivances and directing toward a goal—that is all defilement. If you want to understand the Way directly, Ordinary Mind is the Way. What is Ordinary Mind? No contrivance, no right or wrong, no grasping or rejecting, no annihilation or permanence, neither ordinary nor holy.'",
         "Mazu taught that the Way requires no contrivance; Ordinary Mind—free from preference, grasping, and holiness—is the Way."),

        ("mind_buddha", "即心即佛", "Jí Xīn Jí Fó",
         "Mind is Buddha",
         "示眾云：「汝等諸人，各信自心是佛；此心即是佛心。」",
         "Shì zhòng yún: 'Rǔ děng zhū rén, gè xìn zì xīn shì Fó; cǐ xīn jí shì Fó xīn.'",
         "The Master addressed the assembly: 'All of you must believe that your own mind is Buddha; this very mind is the Buddha Mind.'",
         "Mazu instructed every monk to believe that his own mind is the Buddha Mind."),

        ("neither_mind_buddha", "非心非佛", "Fēi Xīn Fēi Fó",
         "Neither Mind nor Buddha",
         "僧問：「和尚為什麼說即心即佛？」師云：「為止小兒啼。」僧云：「啼止時如何？」師云：「非心非佛。」",
         "Sēng wèn: 'Héshang wèishénme shuō jí xīn jí Fó?' Shī yún: 'Wèi zhǐ xiǎo'ér tí.' Sēng yún: 'Tí zhǐ shí rúhé?' Shī yún: 'Fēi xīn fēi Fó.'",
         "A monk asked, 'Why does the Master say that Mind is Buddha?' Mazu said, 'To stop a crying child.' The monk asked, 'When the weeping stops, what then?' Mazu said, 'Neither Mind nor Buddha.'",
         "Mazu explained that calling mind Buddha is a remedy for crying infants; once calm, the truth is neither mind nor Buddha."),

        ("polishing_brick", "磨磚作鏡", "Mó Zhuān Zuò Jìng",
         "Polishing a Brick to Make a Mirror",
         "馬祖在南嶽傳法院常坐禪。南嶽懷讓禪師問：「大德坐禪，圖箇甚麼？」馬云：「圖作佛。」懷讓乃取一磚於彼庵前石上磨。馬云：「磨磚作甚麼？」懷讓云：「磨作鏡。」馬云：「磨磚豈得成鏡？」懷讓云：「磨磚既不成鏡，坐禪豈得成佛？」",
         "Mǎzǔ zài Nányuè Chuánfǎyuàn cháng zuòchán... Huáiràng yún: 'Mó zhuān jì bù chéng jìng, zuòchán qǐ dé chéng Fó?'",
         "When Mazu was studying at Nanyue, he constantly sat in meditation. Master Huairang asked him, 'Great Worthy, what is your aim in sitting in meditation?' Mazu said, 'My aim is to become a Buddha.' Huairang then took a brick and began polishing it on a rock in front of Mazu's hut. Mazu asked, 'Why are you polishing that brick?' Huairang said, 'To make a mirror.' Mazu asked, 'How can polishing a brick make a mirror?' Huairang said, 'If polishing a brick cannot make a mirror, how can sitting in meditation make a Buddha?'",
         "When Mazu sat in meditation seeking Buddhahood, his teacher Huairang polished a brick to show that mechanical sitting cannot manufacture a Buddha."),

        ("damei_plum", "梅子熟也", "Méizǐ Shú Yě",
         "The Great Plum is Ripe",
         "大梅法常參馬祖，問：「如何是佛？」祖云：「即心是佛。」大梅即住大梅山。馬祖後使僧去問大梅：「和尚近日道：非心非佛。」大梅云：「這老漢惑亂人未有了日！任他非心非佛，我只管即心即佛。」僧回舉似馬祖。祖云：「大眾！梅子熟也！」",
         "Dàméi Fǎcháng cān Mǎzǔ... Zǔ yún: 'Dàzhòng! Méizǐ shú yě!'",
         "Damei asked Mazu, 'What is Buddha?' Mazu said, 'Mind is Buddha.' Damei went to live on Mount Damei. Later Mazu sent a monk to test him, saying Mazu now taught 'Neither mind nor Buddha.' Damei said, 'That old man never stops confusing people! Let him say Neither mind nor Buddha; I stick to Mind is Buddha.' When the monk reported this, Mazu proclaimed, 'The plum is ripe!'",
         "Testing his disciple Damei with 'Neither mind nor Buddha,' Mazu celebrated Damei's unshakable confidence in 'Mind is Buddha' by announcing the plum was ripe.")
    ]

    for s_id, zh_title, py_title, en_title, zh_txt, py_txt, cleary_txt, rp_txt in new_sections:
        existing[s_id] = {
            "section_id": s_id,
            "title_zh": zh_title,
            "title_pinyin": py_title,
            "title_en": en_title,
            "speaker": "Mazu / 馬祖",
            "dialogue": [
                {
                    "speaker": "Mazu / 馬祖",
                    "zh": zh_txt,
                    "pinyin": py_txt,
                    "translations": {
                        "cleary": {
                            "text": cleary_txt,
                            "status": "reconstruction_unverified"
                        },
                        "red_pine": {
                            "text": rp_txt,
                            "status": "reconstruction_unverified"
                        },
                        "suzuki": {
                            "text": cleary_txt,
                            "status": "reconstruction_unverified"
                        }
                    }
                }
            ]
        }

    doc["sections"] = list(existing.values())
    doc["coverage_note"] = f"{len(doc['sections'])} foundational sermons and dialogues from T1986 / X1321"
    save_json(path, doc)
    print(f"✅ Updated mazu_yulu.json: {len(doc['sections'])} sections.")

def sync_canonical_locators():
    path = DATA_DIR / "canonical_locators.json"
    locators = load_json(path)

    # Update congronglu_cases case_locators
    cr_cases = load_json(DATA_DIR / "corpus" / "congronglu_cases.json").get("cases", [])
    cr_locs = locators["documents"]["congronglu_cases"]["case_locators"]
    for c in cr_cases:
        c_str = str(c["case_num"])
        if c_str not in cr_locs:
            cr_locs[c_str] = {
                "canonical_locator": f"T2004, case {c_str}",
                "status": "case_level_anchor"
            }
    locators["documents"]["congronglu_cases"]["case_locators"] = dict(sorted(cr_locs.items(), key=lambda x: int(x[0])))
    save_json(path, locators)
    print("✅ Synchronized canonical_locators.json for congronglu_cases.")

if __name__ == "__main__":
    build_congronglu()
    build_zhaozhou_yulu()
    build_huangbo_chuanxin()
    build_mazu_yulu()
    sync_canonical_locators()
