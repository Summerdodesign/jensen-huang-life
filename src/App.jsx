import React, { useState } from 'react';
import { ChevronRight, Sparkles, Trophy, Star, Award } from 'lucide-react';
import TravelGuide from './TravelGuide';

function App() {
  const [showTravelGuide, setShowTravelGuide] = useState(true);

  if (showTravelGuide) {
    return <TravelGuide />;
  }
  const [currentScene, setCurrentScene] = useState(0);
  const [choices, setChoices] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [correctChoices, setCorrectChoices] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);

  const scenes = [
    {
      id: 0,
      title: "序幕：童年的抉择",
      year: "1963-1973",
      bg: "from-amber-900 to-orange-800",
      image: "🏫",
      imageDescription: "童年求学",
      bgPattern: "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 4px)",
      story: "1963年2月17日，你出生在台湾台南。你的父亲是一名化学工程师，母亲是教师。5岁时，为了让你接受更好的教育，父母做出了艰难的决定——将你和哥哥送到泰国曼谷的国际学校学习英语。\n\n一年后，9岁的你和哥哥被送往美国肯塔基州的Oneida Baptist Institute寄宿学校。这是一所为贫困儿童开设的学校，条件艰苦。你们需要自己清扫厕所、割草、做农活。\n\n在这个陌生的国度，你不仅要克服语言障碍，还要适应文化差异和艰苦的生活条件。但正是这段经历，塑造了你坚韧的性格。",
      question: "面对艰苦的寄宿学校生活和语言文化障碍，年幼的黄仁勋实际上是如何应对的？",
      options: [
        {
          text: "埋头苦读，用优异成绩获得奖学金，尽快离开这所学校",
          value: "study",
          isCorrect: false,
          feedback: "虽然学习很重要，但黄仁勋并没有急于离开。他在这所学校度过了整个青春期，直到高中毕业。"
        },
        {
          text: "积极参与学校的各项劳动和活动，培养动手能力和团队精神",
          value: "work",
          isCorrect: true,
          feedback: "正确！黄仁勋后来回忆说，在Oneida的经历教会了他谦卑、勤奋和团队合作。打扫厕所、做农活的经历让他明白，没有任何工作是卑微的。这种'不怕脏活累活'的精神伴随了他一生。"
        },
        {
          text: "保持低调，尽量避免引人注目，独自默默适应",
          value: "observe",
          isCorrect: false,
          feedback: "恰恰相反！黄仁勋积极融入学校生活，参与各种活动。他后来说这段经历是'character building'（性格塑造），让他学会了谦卑和韧性。"
        }
      ]
    },
    {
      id: 1,
      title: "第一幕：大学与爱情",
      year: "1978-1984",
      bg: "from-rose-900 to-pink-800",
      image: "💑",
      imageDescription: "大学恋曲",
      bgPattern: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)",
      story: "高中毕业后，你进入俄勒冈州立大学(Oregon State University)学习电机工程。在这里，命运为你安排了一个特别的相遇。\n\n在一次实验室课程中，你的导师安排你辅导一位学妹——Lori Mills。她比你小一岁，也在学习工程。你们从学习伙伴逐渐发展成恋人。\n\n大学期间，你展现出对技术的热情和天赋。1984年，你获得了电机工程学士学位。毕业后，你面临人生的重要选择：是立即工作还是继续深造？\n\n此时，你已经与Lori订婚。她全力支持你的决定，但你们都面临经济压力。",
      question: "1984年大学毕业后，黄仁勋实际做出了什么选择？",
      options: [
        {
          text: "立即进入半导体公司工作，赚钱养家，为结婚做准备",
          value: "work",
          isCorrect: false,
          feedback: "不完全正确。虽然他确实需要考虑经济问题，但他选择了继续深造。"
        },
        {
          text: "申请斯坦福大学研究生，边读书边在公司实习，两年后获得硕士学位",
          value: "stanford",
          isCorrect: true,
          feedback: "完全正确！1984年，黄仁勋进入斯坦福大学攻读电机工程硕士学位。在读研期间，他在多家半导体公司实习，积累了宝贵的行业经验。1986年获得硕士学位后，他娶了大学恋人Lori。他们的婚姻一直非常美满，育有两个孩子。"
        },
        {
          text: "推迟婚期，申请MIT博士项目，追求最高学术成就",
          value: "phd",
          isCorrect: false,
          feedback: "黄仁勋没有攻读博士学位。他在斯坦福读完硕士后就进入了工业界，因为他更想做实际的产品而非纯学术研究。"
        }
      ]
    },
    {
      id: 2,
      title: "第二幕：硅谷历练",
      year: "1984-1993",
      bg: "from-purple-900 to-indigo-800",
      image: "💼",
      imageDescription: "职场起步",
      bgPattern: "repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 20px)",
      story: "1986年，23岁的你从斯坦福毕业，获得了电机工程硕士学位。你的第一份工作是在AMD（超微半导体）担任芯片设计师。\n\n在AMD工作期间，你参与设计了多款微处理器，深入了解了半导体行业的技术和商业运作。但你也看到了大公司的官僚主义和缓慢决策。\n\n1985年，你跳槽到LSI Logic，担任微处理器设计总监。在这里，你领导团队，积累了管理经验。更重要的是，你注意到一个被忽视的领域：3D图形处理。\n\n当时个人电脑的图形能力非常有限，但你预见到3D图形、视频游戏和多媒体将成为未来的主流。然而，LSI Logic和其他大公司都专注于CPU，对图形芯片兴趣不大。\n\n1993年初，30岁的你越来越确信：3D图形的未来已经到来，但现有公司都错过了这个机会。",
      question: "1993年2月，黄仁勋做出了什么决定？他是如何开始的？",
      options: [
        {
          text: "在LSI Logic内部成立图形芯片部门，说服管理层投资",
          value: "internal",
          isCorrect: false,
          feedback: "黄仁勋确实试图说服公司，但大公司对这个新领域不感兴趣。最终他选择了离开。"
        },
        {
          text: "与两位工程师朋友在Denny's餐厅会面，决定创立一家专注3D图形的公司",
          value: "startup",
          isCorrect: true,
          feedback: "完全正确！1993年2月，黄仁勋与Chris Malachowsky和Curtis Priem在加州圣何塞的Denny's餐厅会面。他们在餐巾纸上写下了商业计划，决定创立NVIDIA。三人各投入约1000美元，并从红杉资本等风投那里筹集了约2000万启动资金。公司名称'NVIDIA'来自拉丁语'invidia'（嫉妒）和'NV'（next version）的组合。"
        },
        {
          text: "先观察市场一年，等SGI等大公司犯错后再进入",
          value: "wait",
          isCorrect: false,
          feedback: "时不我待！黄仁勋认为如果等待，机会窗口就会关闭。他立即行动，创立了NVIDIA。"
        }
      ]
    },
    {
      id: 3,
      title: "第三幕：NV1的惨败",
      year: "1993-1995",
      bg: "from-red-900 to-orange-800",
      image: "⚠️",
      imageDescription: "生死危机",
      bgPattern: "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 10px, rgba(255,0,0,0.03) 10px, rgba(255,0,0,0.03) 20px)",
      story: "NVIDIA成立后，你们面临第一个重大决策：第一款产品的技术路线。\n\n当时市场上主要有两种3D图形技术路线：\n1. 基于三角形的多边形渲染（业界主流，如3dfx采用）\n2. 基于四边形的曲面渲染（NVIDIA的选择，技术上更先进）\n\n你们选择了后者，认为这是更优越的技术。1995年，NVIDIA发布了第一款产品NV1，集成了3D图形、音频和游戏控制器功能。\n\n但市场反应冷淡。游戏开发商都在为三角形渲染开发游戏（尤其是微软的DirectX主推三角形），NV1的四边形技术虽然先进，却缺乏软件支持。\n\n更糟的是，与世嘉合作开发的游戏机芯片项目也失败了。公司烧钱速度很快，士气低落。到1996年底，NVIDIA只剩下不到6个月的运营资金。",
      question: "面对NV1的失败和资金即将耗尽，黄仁勋实际上做了什么？",
      options: [
        {
          text: "坚持四边形技术路线，继续开发NV2，相信技术终将被认可",
          value: "persist",
          isCorrect: false,
          feedback: "如果这样做，NVIDIA就死了！黄仁勋后来说这是他学到的最重要一课：再好的技术，如果市场不接受，就是错误的技术。"
        },
        {
          text: "立即转向业界主流的三角形技术，all-in开发NV3（RIVA 128），并裁员降低成本",
          value: "pivot",
          isCorrect: true,
          feedback: "完全正确！这是NVIDIA历史上最关键的决策。1996-1997年，黄仁勋做了三件事：1) 承认技术路线错误，立即转向三角形渲染；2) 将所有资源投入NV3项目；3) 痛苦地裁员以延长跑道。他后来说：'我们离倒闭只有30天，这教会了我谦卑。'1997年NV3（RIVA 128）发布后大获成功，成为当年最畅销的3D加速卡，公司得救了！"
        },
        {
          text: "寻求被AMD或Intel收购，至少保住团队和技术",
          value: "sellout",
          isCorrect: false,
          feedback: "虽然有投资者建议这么做，但黄仁勋拒绝了。他相信NVIDIA还有机会，只需要纠正方向。"
        }
      ]
    },
    {
      id: 4,
      title: "第四幕：GPU的诞生",
      year: "1997-1999",
      bg: "from-green-900 to-emerald-800",
      image: "🎮",
      imageDescription: "GPU诞生",
      bgPattern: "linear-gradient(45deg, rgba(0,255,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,255,0,0.05) 75%)",
      story: "RIVA 128的成功让NVIDIA起死回生。1998年，你们发布了RIVA TNT，性能进一步提升。公司终于站稳了脚跟。\n\n但你不满足于此。你看到了更大的愿景：传统上，图形渲染由CPU完成，效率很低。如果有一个专门的处理器来处理图形计算，不仅能大幅提升性能，还能解放CPU去做其他工作。\n\n1999年，你们准备发布革命性的GeForce 256。这款芯片不仅性能强大，更重要的是它首次在硬件层面实现了Transform & Lighting（T&L）功能，能独立完成完整的3D渲染流程。\n\n此时你面临一个营销决策：如何定位这款产品？是称其为'显卡'还是创造一个新概念？",
      question: "1999年8月，黄仁勋在发布GeForce 256时做了什么？",
      options: [
        {
          text: "称其为'新一代3D加速卡'，强调性能提升",
          value: "accelerator",
          isCorrect: false,
          feedback: "这样太保守了！黄仁勋做了一个大胆的事情。"
        },
        {
          text: "创造了'GPU'（Graphics Processing Unit）这个全新的产品类别名称",
          value: "gpu",
          isCorrect: true,
          feedback: "完全正确！黄仁勋在发布会上首次提出了'GPU'（图形处理器）这个概念，将其定位为与CPU（中央处理器）并列的处理器类别。这不仅是营销天才之举，更定义了一个全新的行业。GeForce 256被称为'世界上第一个GPU'。从此，GPU成为了行业标准术语，NVIDIA也成为这个品类的定义者和领导者。这一决策的影响延续至今，为后来的通用计算和AI应用奠定了基础。"
        },
        {
          text: "低调发布，让性能说话，避免过度营销",
          value: "lowkey",
          isCorrect: false,
          feedback: "黄仁勋从不低调！他深知品牌和概念的重要性，做了一个改变行业的决定。"
        }
      ]
    },
    {
      id: 5,
      title: "第五幕：上市与竞争",
      year: "1999-2006",
      bg: "from-blue-900 to-cyan-800",
      image: "📈",
      imageDescription: "上市腾飞",
      bgPattern: "repeating-linear-gradient(135deg, rgba(0,200,255,0.03) 0px, rgba(0,200,255,0.03) 10px, transparent 10px, transparent 20px)",
      story: "1999年1月，NVIDIA在纳斯达克上市，IPO价格为12美元。GeForce系列大获成功，公司营收和利润快速增长。\n\n2000年，你们击败了曾经不可一世的3dfx，并在2000年底收购了这家昔日的行业霸主。同时，你们赢得了微软Xbox游戏机的GPU订单，进一步巩固市场地位。\n\n但挑战也随之而来。主要竞争对手ATI（后被AMD收购）推出了强劲的Radeon系列，在某些代次上甚至超越了NVIDIA。市场份额和技术领先地位的竞争异常激烈。\n\n2006年，你开始思考一个问题：GPU强大的并行计算能力，是否只能用于图形渲染？如果能让程序员直接用GPU做通用计算，会怎么样？\n\n这个想法很大胆，但也充满风险。开发通用计算平台需要投入数亿甚至数十亿美元，而市场需求并不明确。董事会和华尔街分析师都表示怀疑。",
      question: "2006年，黄仁勋决定投资开发CUDA（Compute Unified Device Architecture）平台。这是一个什么样的决定？",
      options: [
        {
          text: "一个小规模的研发项目，投入几千万美元测试市场反应",
          value: "small",
          isCorrect: false,
          feedback: "远不止如此！这是一个需要数十亿美元、持续多年投入的巨大赌注。"
        },
        {
          text: "一个长期战略投资，即使短期看不到回报也要坚持，累计投入超过100亿美元",
          value: "longterm",
          isCorrect: true,
          feedback: "完全正确！CUDA的开发和生态建设，从2006年到2012年深度学习爆发，NVIDIA累计投入超过100亿美元。这期间股价承压，分析师不理解，董事会有人质疑。但黄仁勋坚信GPU的并行计算能力将在科学计算、AI等领域大放异彩。他后来说：'如果当时知道要花这么多钱和时间，可能不敢做。但现在回看，这是NVIDIA做过最正确的决定。'CUDA让NVIDIA在AI时代到来时占据了绝对优势。"
        },
        {
          text: "暂缓投资，先让学术界和开源社区探索GPU通用计算的可能性",
          value: "wait",
          isCorrect: false,
          feedback: "如果等待，NVIDIA就会错失AI时代！黄仁勋果断押注，即使要承受巨大压力。"
        }
      ]
    },
    {
      id: 6,
      title: "第六幕：黑暗中的坚持",
      year: "2006-2012",
      bg: "from-indigo-900 to-purple-800",
      image: "🌙",
      imageDescription: "黑暗坚持",
      bgPattern: "radial-gradient(ellipse at center, rgba(100,100,255,0.05) 0%, transparent 70%)",
      story: "CUDA发布后，最初几年市场反应冷淡。主要用户是少数科学研究机构和大学实验室。相比巨额投入，商业回报微乎其微。\n\n2008年金融危机重创PC市场，NVIDIA股价从2007年的37美元暴跌至2008年的6美元。华尔街分析师纷纷质疑：为什么要在CUDA上浪费这么多钱？为什么不专注于更赚钱的游戏GPU？\n\n2010年，移动互联网兴起，PC市场进一步萎缩。NVIDIA在移动芯片市场投入巨资，但Tegra芯片被高通Snapdragon压制，难以打开局面。\n\n公司内部也有人开始动摇。但你坚持继续投资CUDA生态：\n- 免费提供开发工具和SDK\n- 资助大学开设GPU编程课程\n- 与科研机构合作推广GPU计算\n- 持续优化CUDA性能和易用性\n\n2012年，你已经在CUDA上投入了约80亿美元，但商业回报依然有限。",
      question: "2012年6月，多伦多大学研究生Alex Krizhevsky做了什么事情，改变了NVIDIA的命运？",
      options: [
        {
          text: "发布了一个新的GPU游戏引擎，大幅提升游戏画质",
          value: "game",
          isCorrect: false,
          feedback: "不是游戏相关，而是人工智能！"
        },
        {
          text: "使用NVIDIA GPU训练深度神经网络，在ImageNet竞赛中以巨大优势夺冠",
          value: "imagenet",
          isCorrect: true,
          feedback: "完全正确！2012年，Alex Krizhevsky和导师Geoffrey Hinton使用两块NVIDIA GTX 580 GPU训练了AlexNet深度学习模型，在ImageNet图像识别竞赛中以15.3%的错误率夺冠，远超第二名的26.2%。这一突破震惊了整个AI界，证明了深度学习的潜力，也证明了GPU在AI训练中的巨大优势。黄仁勋后来说：'那一刻我知道，AI的时代到来了，而我们已经准备了6年。'CUDA的长期投资终于得到了回报！"
        },
        {
          text: "开发了CUDA的竞争产品OpenCL，打破NVIDIA的垄断",
          value: "opencl",
          isCorrect: false,
          feedback: "OpenCL是CUDA的开放标准竞争对手，但最终CUDA在AI领域占据主导地位。"
        }
      ]
    },
    {
      id: 7,
      title: "第七幕：AI革命的引擎",
      year: "2012-2017",
      bg: "from-green-900 to-teal-800",
      image: "🤖",
      imageDescription: "AI觉醒",
      bgPattern: "repeating-linear-gradient(0deg, rgba(0,255,100,0.03) 0px, rgba(0,255,100,0.03) 2px, transparent 2px, transparent 4px)",
      story: "AlexNet的突破像导火索一样，引爆了AI革命。全球的科技公司和研究机构都开始押注深度学习，而他们都需要GPU。\n\nGoogle、Facebook、Microsoft、百度、腾讯等巨头纷纷采购NVIDIA GPU建设AI训练集群。NVIDIA的数据中心业务开始快速增长。\n\n2016年，你在GTC（GPU Technology Conference）大会上发布了专为深度学习设计的Tesla P100 GPU，基于Pascal架构，性能是前代的10倍。你还推出了DGX-1，一个集成8块Tesla P100的AI超级计算机，售价12.9万美元。\n\n第一台DGX-1交付给了一个特殊的客户。你亲自将这台机器送到他们手中，这成为了一个象征性的时刻。",
      question: "2016年，黄仁勋亲手将第一台DGX-1交付给了哪个组织/个人？",
      options: [
        {
          text: "Google的Demis Hassabis（DeepMind创始人），用于AlphaGo训练",
          value: "deepmind",
          isCorrect: false,
          feedback: "DeepMind确实是重要客户，但第一台DGX-1送给了另一个AI领域的先驱。"
        },
        {
          text: "OpenAI，用于强化学习和大语言模型研究",
          value: "openai",
          isCorrect: true,
          feedback: "完全正确！2016年8月，黄仁勋亲自将第一台DGX-1交付给OpenAI。当时OpenAI刚成立不久，由Sam Altman领导，Elon Musk是主要资助者之一。这台机器被用于强化学习、机器人控制等研究。几年后，OpenAI用NVIDIA GPU训练出了GPT系列模型，最终在2022年推出ChatGPT，再次引爆AI革命。黄仁勋与OpenAI的关系一直很紧密，NVIDIA也成为OpenAI最重要的硬件合作伙伴。"
        },
        {
          text: "斯坦福大学AI实验室，感谢母校的培养",
          value: "stanford",
          isCorrect: false,
          feedback: "斯坦福确实是NVIDIA的重要合作伙伴，但第一台DGX-1的客户另有其人。"
        }
      ]
    },
    {
      id: 8,
      title: "第八幕：成为AI时代的心脏",
      year: "2017-2023",
      bg: "from-yellow-900 to-orange-800",
      image: "💎",
      imageDescription: "万亿帝国",
      bgPattern: "conic-gradient(from 0deg at 50% 50%, rgba(255,215,0,0.1) 0deg, transparent 60deg, rgba(255,215,0,0.1) 120deg, transparent 180deg, rgba(255,215,0,0.1) 240deg, transparent 300deg, rgba(255,215,0,0.1) 360deg)",
      story: "AI的需求呈指数级增长。你不断推出更强大的GPU：\n- 2017年：Volta架构，引入Tensor Core专为AI设计\n- 2018年：Turing架构，引入实时光线追踪\n- 2020年：Ampere架构，AI性能再翻倍\n- 2022年：Hopper架构，H100成为AI训练的黄金标准\n\n但真正的转折点在2022年11月。OpenAI发布了ChatGPT，全球为之震撼。人们突然意识到，AI不再是实验室的玩具，而是将改变世界的技术。\n\nChatGPT完全基于NVIDIA GPU训练。随后的AI大爆炸——Google的Bard、微软的Copilot、Anthropic的Claude、Meta的Llama——全部需要NVIDIA GPU。\n\nH100 GPU一卡难求，价格从官方的3万美元炒到黑市的4-5万美元。数据中心业务营收暴涨，从2022财年的150亿美元飙升至2024财年的470亿美元。\n\n2023年5月，NVIDIA市值突破1万亿美元，成为第一家市值破万亿的芯片公司。",
      question: "2023-2024年，面对AI需求爆炸和供不应求，黄仁勋做了什么？",
      options: [
        {
          text: "大幅提高GPU价格，最大化利润，让市场自然调节",
          value: "price",
          isCorrect: false,
          feedback: "NVIDIA确实提高了价格，但黄仁勋更关注长期生态建设。"
        },
        {
          text: "全力扩大产能，与台积电紧密合作，同时推进下一代架构，并投资AI生态",
          value: "scale",
          isCorrect: true,
          feedback: "完全正确！黄仁勋采取了多管齐下的策略：1）大幅增加台积电订单，H100月产能从数万片提升到数十万片；2）加速推出下一代Blackwell架构（B100/B200）；3）投资AI初创公司，建设生态系统；4）推出云服务，让更多人能用上GPU；5）开发软件工具（如NeMo、TensorRT），降低AI开发门槛。2024年3月，NVIDIA市值突破2万亿美元，黄仁勋个人财富超过900亿美元，成为全球最富有的华人。"
        },
        {
          text: "授权GPU技术给其他厂商，培养竞争对手，避免垄断质疑",
          value: "license",
          isCorrect: false,
          feedback: "恰恰相反！NVIDIA严格保护自己的技术优势，CUDA生态成为护城河。"
        }
      ]
    },
    {
      id: 9,
      title: "终幕：传奇还在继续",
      year: "2024-未来",
      bg: "from-violet-900 to-rose-800",
      image: "🌟",
      imageDescription: "传奇继续",
      bgPattern: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)",
      story: "2024年，61岁的你站在科技界的巅峰。你的标志性黑色皮衣（总是同一件款式的皮夹克）成为科技界的icon。\n\nNVIDIA不仅主导GPU市场，更成为AI时代的基础设施提供商。每一个大语言模型、每一个AI应用背后，都有NVIDIA的身影。\n\n但你没有停下脚步。你布局的新领域包括：\n- 自动驾驶：NVIDIA DRIVE平台，与各大车厂合作\n- 机器人：Isaac平台，推动具身智能发展\n- 数字孪生：Omniverse平台，构建元宇宙的底层技术\n- 生命科学：用AI加速药物研发和基因分析\n- 量子计算：下一代计算的基础设施\n\n从台南的少年，到科技巨头的掌舵人，你的人生充满了正确的判断和坚持。你创造了GPU这个品类，押注了CUDA平台，引领了AI革命。\n\n回顾一生，哪个决策最能代表你的精神？",
      question: "回顾黄仁勋的一生，他最著名的管理哲学和名言是什么？",
      options: [
        {
          text: "Move fast and break things（快速行动，打破常规）",
          value: "fast",
          isCorrect: false,
          feedback: "这是扎克伯格的名言，不是黄仁勋的风格。"
        },
        {
          text: "我们距离倒闭永远只有30天（We are always 30 days from going out of business）",
          value: "30days",
          isCorrect: true,
          feedback: "完全正确！这是黄仁勋最著名的管理哲学。即使在NVIDIA市值超过2万亿美元时，他依然保持这种危机意识。他经常对员工说：我们要像公司随时会倒闭一样工作。这源于1996-1997年NVIDIA差点破产的经历。此外，他的其他名言还包括：The more you buy, the more you save（在GTC上推销GPU时的幽默说法）、做你害怕做的事（Do the things you are afraid to do）、以及他标志性的结束语Thank you for coming。黄仁勋的领导风格结合了远见、执行力、危机意识和工程师文化。"
        },
        {
          text: "Stay hungry, stay foolish（求知若饥，虚心若愚）",
          value: "hungry",
          isCorrect: false,
          feedback: "这是乔布斯的名言。黄仁勋有自己独特的管理哲学。"
        }
      ]
    }
  ];

  const handleChoice = (option) => {
    const newChoices = [...choices, { scene: currentScene, choice: option }];
    setChoices(newChoices);

    setFeedbackData({
      isCorrect: option.isCorrect,
      feedback: option.feedback,
      correctAnswer: option.isCorrect ? null : scenes[currentScene].options.find(opt => opt.isCorrect).text
    });
    setShowFeedback(true);

    if (option.isCorrect) {
      setCorrectChoices(correctChoices + 1);
    }
  };

  const nextScene = () => {
    setShowFeedback(false);
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartJourney = () => {
    setCurrentScene(0);
    setChoices([]);
    setShowResult(false);
    setCorrectChoices(0);
    setShowFeedback(false);
    setFeedbackData(null);
  };

  const getPersonalityResult = () => {
    const score = correctChoices;
    const total = scenes.length;
    const percentage = (score / total) * 100;

    if (percentage >= 80) {
      return {
        type: "商业天才",
        score: score,
        total: total,
        desc: `你对黄仁勋的人生有深入的了解！你答对了${score}/${total}道题。你理解了他在关键时刻的抉择：承认错误的勇气、长期主义的坚持、创造新品类的远见。这些正是让NVIDIA从濒临破产到万亿市值的关键。`,
        icon: Trophy,
        color: "text-yellow-400"
      };
    } else if (percentage >= 60) {
      return {
        type: "优秀学员",
        score: score,
        total: total,
        desc: `不错的表现！你答对了${score}/${total}道题。你掌握了黄仁勋人生的主要脉络，但有些关键细节还需要深入了解。建议再次体验，关注那些看似冒险但实则深思熟虑的决策。`,
        icon: Star,
        color: "text-blue-400"
      };
    } else {
      return {
        type: "初学者",
        score: score,
        total: total,
        desc: `你答对了${score}/${total}道题。黄仁勋的人生充满了反直觉的决策：在失败时转向、在成功时豪赌未来、在质疑中坚持。建议重新体验，这次仔细阅读每个场景的背景故事。`,
        icon: Sparkles,
        color: "text-purple-400"
      };
    }
  };

  if (showFeedback) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${scenes[currentScene].bg} text-white p-4 md:p-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-8">
              {feedbackData.isCorrect ? (
                <>
                  <div className="text-7xl mb-4">🎉</div>
                  <h2 className="text-4xl font-bold mb-4 text-yellow-400">
                    太棒了！
                  </h2>
                </>
              ) : (
                <>
                  <div className="text-7xl mb-4">💡</div>
                  <h2 className="text-4xl font-bold mb-4 text-blue-400">
                    让我们了解真实的历史
                  </h2>
                </>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
              <p className="text-lg leading-relaxed">{feedbackData.feedback}</p>
            </div>

            {!feedbackData.isCorrect && feedbackData.correctAnswer && (
              <div className="bg-blue-900/30 backdrop-blur rounded-2xl p-6 mb-6 border-l-4 border-blue-400">
                <p className="text-sm text-blue-300 mb-2">✨ 黄仁勋当时的选择：</p>
                <p className="text-lg font-semibold">{feedbackData.correctAnswer}</p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={nextScene}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all transform hover:scale-105 shadow-lg"
              >
                {currentScene < scenes.length - 1 ? '继续下一幕 →' : '查看最终结果 →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const result = getPersonalityResult();
    const Icon = result.icon;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <Icon className={`w-24 h-24 mx-auto mb-6 ${result.color}`} />
            <h1 className="text-5xl font-bold mb-4">完成！</h1>
            <div className={`text-3xl font-bold mb-2 ${result.color}`}>{result.type}</div>
            <div className="text-2xl font-semibold mb-6 text-gray-300">得分: {result.score} / {result.total}</div>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">{result.desc}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" />
              你的答题记录
            </h2>
            <div className="space-y-4">
              {choices.map((choice, idx) => (
                <div key={idx} className={`flex items-start gap-4 p-4 rounded-lg ${choice.choice.isCorrect ? 'bg-green-900/20 border-l-4 border-green-400' : 'bg-red-900/20 border-l-4 border-red-400'}`}>
                  <div className="text-2xl">
                    {choice.choice.isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1 flex items-center gap-2">
                      <span className="text-gray-400">{scenes[choice.scene].year}</span>
                      <span>{scenes[choice.scene].title}</span>
                    </div>
                    <div className="text-sm text-gray-300 mb-1">你的选择：{choice.choice.text}</div>
                    {!choice.choice.isCorrect && (
                      <div className="text-sm text-green-400">
                        正确答案：{scenes[choice.scene].options.find(opt => opt.isCorrect).text}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">黄仁勋的成功秘诀</h2>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">1.</span>
                <span><strong>承认错误的勇气</strong>：NV1失败后立即转向，没有被沉没成本束缚</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">2.</span>
                <span><strong>长期主义</strong>：在CUDA上投入100亿美元，坚持6年才看到回报</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">3.</span>
                <span><strong>创造新品类</strong>：发明"GPU"这个概念，定义了整个行业</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">4.</span>
                <span><strong>危机意识</strong>："距离倒闭永远只有30天"的心态保持创业激情</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-yellow-400 text-xl">5.</span>
                <span><strong>押注未来</strong>：当别人看不懂时，坚定投资下一个十年的技术</span>
              </li>
            </ul>
          </div>

          <div className="text-center">
            <button
              onClick={restartJourney}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full font-bold text-lg hover:from-green-500 hover:to-emerald-500 transition-all transform hover:scale-105 shadow-lg"
            >
              重新开始旅程
            </button>
          </div>
        </div>
      </div>
    );
  }

  const scene = scenes[currentScene];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${scene.bg} text-white p-4 md:p-8 transition-all duration-1000 relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: scene.bgPattern }}></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>进度: {currentScene + 1} / {scenes.length}</span>
            <span>正确: {correctChoices} 题</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in">
          <div className="text-center mb-6">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 blur-3xl"></div>
              <div className="relative text-8xl md:text-9xl mb-4 filter drop-shadow-2xl">{scene.image}</div>
            </div>
            <div className="text-sm text-yellow-400 font-semibold mb-2 tracking-wider uppercase">{scene.year}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{scene.title}</h1>
          </div>

          <div className="text-base md:text-lg text-gray-200 leading-relaxed mb-8 space-y-4 whitespace-pre-line">
            {scene.story}
          </div>

          <div className="bg-yellow-900/20 backdrop-blur rounded-2xl p-6 mb-8 border-l-4 border-yellow-400">
            <p className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              关键抉择
            </p>
            <p className="text-lg">{scene.question}</p>
          </div>

          <div className="space-y-4">
            {scene.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(option)}
                className="w-full text-left p-6 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-xl border border-white/20 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-lg font-semibold mb-1">{option.text}</div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-300">
          <p className="mb-2">💡 提示：选择黄仁勋在历史上真实做出的决定</p>
          <p>错误的选择会有详细的解释说明</p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
