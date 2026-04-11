export interface Article {
  id: number;
  content: string;
  country: string;
  language: string;
  year: number;
}

export const ARTICLES: Article[] = [
  { id: 0, content: "As the sambadrome filled with thousands of spectators, the parade entered its second hour under a canopy of electric lights. The float, adorned with golden feathers and representing the mythological origins of the river basin, was cheered on by the estimated 70,000 people lining the avenue. This year's competition featured a dozen schools, each with nearly 3,000 performers.", country: "Brazil", language: "English", year: 2020 },
  { id: 1, content: "今年の桜の開花予想は例年より約1週間早く、3月下旬には満開になると気象庁が発表した。東京の上野公園では、すでに花見の場所取りをする人々の姿が見られ、週末には数万人が訪れると予想されている。今年は特に温暖な冬の影響で、梅の花も早くに咲き終わり、春の訪れを告げる花々が次々と咲き始めている。", country: "Japan", language: "Japanese", year: 2023 },
  { id: 2, content: "استقطبت السهرة الفنية المقامة في ساحة جامع الفنا أعداداً كبيرة من السياح والمواطنين، حيث تناوب على الأداء عدد من الفنانين الشباب إلى جانب أسماء راسخة في الفن الأصيل. وقد أضفت الإضاءة الخافتة والرياح الخفيفة القادمة من جبال الأطلس على المكان أجواءً مميزة.", country: "Morocco", language: "Arabic", year: 2022 },
  { id: 3, content: "Die Bundesregierung hat angekündigt, die Förderung für Elektrofahrzeuge um weitere zwei Jahre zu verlängern, nachdem die Nachfrage im letzten Quartal um 34 Prozent gestiegen ist. Mehrere Automobilhersteller aus dem Stuttgarter Raum begrüßten die Entscheidung und kündigten an, ihre Produktionskapazitäten für Elektromodelle bis 2025 zu verdoppeln.", country: "Germany", language: "German", year: 2022 },
  { id: 4, content: "Durante las festividades del 2 de noviembre, los cementerios se llenaron de flores de cempasúchil y el aroma del copal inundó las calles empedradas del centro histórico. Familias enteras montaron ofrendas con fotografías de los difuntos, pan de muerto y bebidas que en vida disfrutaban sus seres queridos.", country: "Mexico", language: "Spanish", year: 2021 },
  { id: 5, content: "Le marché de Noël de la place de la République accueille cette année plus de deux cents exposants venus de toute la région. Entre les stands de vin chaud et de foie gras, les familles se pressaient devant les étalages de jouets en bois artisanal. Le maire a inauguré l'événement en soulignant l'importance de soutenir les producteurs locaux.", country: "France", language: "French", year: 2023 },
  { id: 6, content: "The Afrobeats concert at the amphitheatre drew a capacity crowd of over fifteen thousand, with fans travelling from neighbouring states to witness the headline performance. Street vendors outside sold suya and chilled drinks to the long queues while unofficial merchandise stalls lined the access roads.", country: "Nigeria", language: "English", year: 2022 },
  { id: 7, content: "With the monsoon season delayed by nearly three weeks, farmers in the central plateau were forced to rely on irrigation canals that had already begun to run low. Meanwhile, the national cricket team's preparations for the upcoming tour were disrupted when the training facility in the eastern city reported flooding.", country: "India", language: "English", year: 2023 },
  { id: 8, content: "새벽 두 시, 강남의 한 연습실에서는 여섯 명의 연습생들이 땀을 흘리며 안무를 반복하고 있었다. 데뷔까지 남은 시간이 이제 한 달도 채 되지 않았다. 소속사 관계자는 이번 그룹은 글로벌 팬덤을 겨냥한 콘셉트로 준비됐으며, 첫 앨범은 한국어와 영어 트랙을 함께 수록할 예정이라고 밝혔다.", country: "South Korea", language: "Korean", year: 2022 },
  { id: 9, content: "Tras la victoria en la final del torneo, la ciudad entera salió a las calles en una celebración que duró hasta el amanecer. El capitán del equipo, que jugó lesionado durante los últimos veinte minutos del partido, fue cargado en hombros por sus compañeros. El presidente de la nación declaró el lunes siguiente como feriado nacional.", country: "Argentina", language: "Spanish", year: 2022 },
  { id: 10, content: "The city council voted seven to four to extend the bike lane network through the downtown corridor, overriding objections from business owners. The cycling advocacy group celebrated outside city hall, noting that the expansion would connect three previously isolated neighbourhoods to the rapid transit system.", country: "Canada", language: "English", year: 2023 },
  { id: 11, content: "Con el precio del café arábica rozando máximos históricos en los mercados internacionales, los cultivadores de las laderas andinas reportaron un incremento del 28% en sus ingresos. La cooperativa regional, que agrupa a más de cuatro mil familias productoras, anunció la apertura de una nueva planta de procesamiento.", country: "Colombia", language: "Spanish", year: 2022 },
  { id: 12, content: "随着人工智能技术的飞速发展，该市的科技园区今年新增注册企业超过三百家，吸引外资逾四十亿元。园区管委会主任在新闻发布会上表示，重点扶持方向包括大模型应用、智能制造和自动驾驶三大领域。", country: "China", language: "Chinese", year: 2023 },
  { id: 13, content: "Boğaz'ın iki yakasını birbirine bağlayan köprü, bayram tatilinin ilk günü tarihi bir araç yoğunluğuna sahne oldu. Trafik müdürlüğü açıkladığı verilere göre, sabah altı ile öğlen on iki arasında geçiş yapan araç sayısı geçen yılın aynı dönemine göre yüzde kırk iki artış gösterdi.", country: "Turkey", language: "Turkish", year: 2022 },
  { id: 14, content: "Det statliga energibolaget tillkännagav att landets sista kolkraftverk officiellt stängdes vid midnatt, vilket gör landet till ett av de första i världen att helt avveckla sin kolbaserade elproduktion. Miljöministern betonade att detta var ett historiskt ögonblick för klimatomställningen.", country: "Sweden", language: "Swedish", year: 2022 },
  { id: 15, content: "وأفادت وكالة الأنباء الرسمية بأن مشروع المدينة الاقتصادية شهد خلال الربع الأخير إبرام عقود بقيمة تجاوزت المليار دولار مع شركات دولية متخصصة في البنية التحتية الذكية. وتأتي هذه التطورات في سياق مساعي التنويع الاقتصادي.", country: "Saudi Arabia", language: "Arabic", year: 2023 },
  { id: 16, content: "The national electricity grid operator declared a Stage 4 load shedding alert for the entire week, warning households and businesses to expect up to twelve hours without power daily. The crisis was attributed to unplanned outages at several coal power stations.", country: "South Africa", language: "English", year: 2023 },
  { id: 17, content: "Le festival annuel de gnawa a réuni cette année des musiciens venus de plusieurs continents pour des nuits de transe et de rituel dans les riads de la médina. Les maâlems, gardiens de cette tradition pluriséculaire, ont partagé la scène avec des artistes de jazz et de soul dans des fusions inédites.", country: "Morocco", language: "French", year: 2022 },
  { id: 18, content: "La estación de esquí registró su temporada más concurrida en una década, con más de cuatrocientos mil visitantes entre diciembre y marzo. Las autoridades regionales atribuyeron el éxito a la excepcional nevada de principios de invierno y a la mejora de las conexiones de transporte desde la capital.", country: "Spain", language: "Spanish", year: 2023 },
  { id: 19, content: "Thousands lined the streets for the annual independence celebration, a tradition that has marked this date since the country gained sovereignty. Steel pan bands from every district competed for the national trophy while masquerade troupes performed in costumes that had taken months to prepare.", country: "Trinidad and Tobago", language: "English", year: 2022 },
];

const TOTAL_ROUNDS = 3;

export function selectArticles(roomId: string): number[] {
  let h = 0;
  for (const c of roomId) {
    h = ((h * 31 + c.charCodeAt(0)) >>> 0);
  }
  const n = ARTICLES.length;
  const indices: number[] = [];
  let offset = 0;
  while (indices.length < TOTAL_ROUNDS) {
    const idx = ((h + offset * 7) % n + n) % n;
    if (!indices.includes(idx)) indices.push(idx);
    offset++;
  }
  return indices;
}
