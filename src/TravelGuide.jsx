import React, { useState, useEffect, useRef } from 'react';
import { 
  Fish, 
  Waves, 
  MapPin, 
  Calendar, 
  Plane, 
  Anchor, 
  Sun, 
  Camera,
  Utensils,
  Hotel,
  Navigation,
  Clock,
  DollarSign,
  Info,
  Building2,
  Mountain,
  Footprints,
  Ticket
} from 'lucide-react';

// 每日地图组件
function DailyMap({ activities, day }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || activities.length === 0) return;
    
    // 检查Leaflet是否已加载
    if (typeof window.L === 'undefined') {
      console.warn('Leaflet not loaded');
      return;
    }

    // 计算中心点和边界
    const lats = activities.map(a => a.coordinates.lat);
    const lngs = activities.map(a => a.coordinates.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // 初始化地图
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapRef.current).setView([centerLat, centerLng], 13);
      
      // 添加OpenStreetMap图层
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    } else {
      mapInstanceRef.current.setView([centerLat, centerLng], 13);
    }

    // 清除旧标记
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // 添加新标记
    activities.forEach((activity, idx) => {
      const label = String.fromCharCode(65 + idx);
      const colors = ['red', 'blue', 'green', 'purple', 'orange', 'yellow', 'pink'];
      const color = colors[idx % colors.length];
      
      // 创建自定义图标
      const icon = window.L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${label}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = window.L.marker([activity.coordinates.lat, activity.coordinates.lng], { icon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${label}: ${activity.title}</b><br/>坐标: ${activity.coordinates.lat.toFixed(4)}, ${activity.coordinates.lng.toFixed(4)}`);
      
      markersRef.current.push(marker);
    });

    // 调整地图边界以包含所有标记
    if (activities.length > 1) {
      const bounds = window.L.latLngBounds(activities.map(a => [a.coordinates.lat, a.coordinates.lng]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // 清理函数
    return () => {
      // 组件卸载时不清理地图，因为可能在切换日期时重用
    };
  }, [activities, day]);

  if (activities.length === 0) return null;

  return (
    <div className="mb-6 bg-white rounded-lg p-4 md:p-6 shadow-lg border-l-4 border-indigo-500">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
        <h3 className="text-lg md:text-xl font-bold text-gray-800">今日行程地图</h3>
      </div>
      
      {/* 地图容器 - 响应式高度 */}
      <div 
        ref={mapRef} 
        className="rounded-lg overflow-hidden shadow-md bg-gray-100 mb-4 h-[300px] md:h-[500px]"
        style={{ zIndex: 0 }}
      />
      
      {/* 景点列表 - 响应式布局 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 mb-3">
        {activities.map((activity, idx) => {
          const colors = ['red', 'blue', 'green', 'purple', 'orange', 'yellow', 'pink'];
          const color = colors[idx % colors.length];
          const colorClasses = {
            'red': 'bg-red-600',
            'blue': 'bg-blue-600',
            'green': 'bg-green-600',
            'purple': 'bg-purple-600',
            'orange': 'bg-orange-600',
            'yellow': 'bg-yellow-600',
            'pink': 'bg-pink-600'
          };
          
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 text-sm bg-indigo-50 p-2 md:p-3 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200`}
            >
              <span className={`${colorClasses[color]} text-white rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-semibold text-xs md:text-sm truncate">{activity.title}</p>
                <p className="text-xs text-gray-500 hidden sm:block">坐标: {activity.coordinates.lat.toFixed(4)}, {activity.coordinates.lng.toFixed(4)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-xs text-gray-600 text-center bg-indigo-50 p-2 md:p-3 rounded-lg border border-indigo-200">
        💡 地图上显示了今日所有景点的位置（标记A、B、C等）。您可以在地图上直接查看、缩放和拖拽，标记点会跟随地图移动。点击标记可查看详细信息。
      </div>
    </div>
  );
}

function TravelGuide() {
  const [activeDay, setActiveDay] = useState(0);

  // 城市坐标信息
  const cityCoordinates = {
    sydney: { lat: -33.8688, lng: 151.2093, name: "悉尼" },
    goldCoast: { lat: -28.0167, lng: 153.4000, name: "黄金海岸" },
    auckland: { lat: -36.8485, lng: 174.7633, name: "奥克兰" },
    queenstown: { lat: -45.0312, lng: 168.6626, name: "皇后镇" }
  };

  const itinerary = [
    {
      day: 1,
      date: "Day 1",
      location: "悉尼 (Sydney), 澳大利亚",
      title: "抵达悉尼 + 市中心观光",
      activities: [
        {
          time: "上午",
          title: "抵达悉尼国际机场",
          description: "办理入境手续，前往酒店办理入住",
          icon: Plane,
          tips: "建议选择靠近市中心的酒店，方便游览"
        },
        {
          time: "下午",
          title: "悉尼歌剧院 + 海港大桥",
          description: "参观世界著名的悉尼歌剧院，欣赏其独特的建筑风格，然后步行至海港大桥，欣赏悉尼港全景",
          icon: Building2,
          tips: "可以参加歌剧院导览团，了解建筑历史。海港大桥可以步行或攀登",
          ticketPrice: "歌剧院导览：AUD 43/人；海港大桥步行：免费；大桥攀登：AUD 268-403/人",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          coordinates: { lat: -33.8568, lng: 151.2153 }
        },
        {
          time: "傍晚",
          title: "岩石区 (The Rocks) 漫步",
          description: "在悉尼最古老的街区漫步，欣赏历史建筑，购买纪念品，体验当地文化",
          icon: Navigation,
          tips: "岩石区有很多特色小店和餐厅，周末有集市",
          ticketPrice: "免费",
          image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
          coordinates: { lat: -33.8591, lng: 151.2090 }
        },
        {
          time: "晚上",
          title: "达令港晚餐 + 夜景",
          description: "在达令港享用海鲜晚餐，欣赏港口夜景和灯光秀",
          icon: Utensils,
          tips: "推荐餐厅：Nick's Seafood Restaurant 或 Aria Sydney",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          coordinates: { lat: -33.8705, lng: 151.2021 }
        }
      ],
      accommodation: "悉尼市中心酒店",
      highlight: "悉尼标志性建筑 + 城市风光",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      coordinates: cityCoordinates.sydney,
      flightPrice: null,
      route: [
        { from: "悉尼国际机场", to: "市中心酒店", method: "机场快线/出租车", time: "30-45分钟", distance: "15公里" },
        { from: "酒店", to: "悉尼歌剧院", method: "步行/渡轮", time: "15-20分钟", distance: "2公里" },
        { from: "悉尼歌剧院", to: "海港大桥", method: "步行", time: "10分钟", distance: "1公里" },
        { from: "海港大桥", to: "岩石区", method: "步行", time: "5分钟", distance: "0.5公里" },
        { from: "岩石区", to: "达令港", method: "步行/轻轨", time: "15分钟", distance: "1.5公里" }
      ],
      accommodationDetails: {
        area: "环形码头/岩石区/达令港",
        recommendations: [
          "Four Seasons Hotel Sydney（四季酒店）- 5星级，位置绝佳，步行至歌剧院5分钟",
          "Park Hyatt Sydney（柏悦酒店）- 5星级，海港景观，价格较高",
          "Harbour Rocks Hotel（海港岩石酒店）- 4星级，岩石区历史建筑，性价比高",
          "YHA Sydney Harbour（青年旅舍）- 经济型，海港景观，适合预算有限的旅行者"
        ],
        priceRange: "AUD 150-600/晚",
        bookingTips: "建议提前1-2个月预订，选择可免费取消的房型"
      }
    },
    {
      day: 2,
      date: "Day 2",
      location: "悉尼 (Sydney), 澳大利亚",
      title: "悉尼海钓日",
      activities: [
        {
          time: "上午",
          title: "皇家植物园 + 麦考利夫人座椅",
          description: "在皇家植物园漫步，欣赏悉尼港美景，前往麦考利夫人座椅，这里是拍摄歌剧院和海港大桥的最佳位置",
          icon: Camera,
          tips: "早上光线最好，适合拍照。植物园免费开放",
          ticketPrice: "免费",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          coordinates: { lat: -33.8591, lng: 151.2169 }
        },
        {
          time: "中午",
          title: "悉尼鱼市场午餐",
          description: "前往悉尼鱼市场，品尝新鲜海鲜，体验当地海鲜文化",
          icon: Utensils,
          tips: "市场早上5点就开门，中午人较多但选择也更多"
        },
        {
          time: "下午",
          title: "深海钓鱼之旅",
          description: "参加专业深海钓鱼团，前往悉尼外海，目标鱼种：金枪鱼、马林鱼、鲷鱼",
          icon: Fish,
          tips: "需要提前预订，建议选择半天行程（4-6小时）。这是第一个钓鱼行程",
          ticketPrice: "AUD 150-350/人（半天行程）",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
          coordinates: { lat: -33.8688, lng: 151.2093 }
        },
        {
          time: "晚上",
          title: "环形码头 + 市中心晚餐",
          description: "返回环形码头，在市中心享用晚餐，体验悉尼夜生活",
          icon: Utensils,
          tips: "推荐餐厅：Quay Restaurant（米其林三星）或 Opera Bar"
        }
      ],
      accommodation: "悉尼市中心酒店",
      highlight: "深海钓鱼体验（第一个钓鱼行程）",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      coordinates: cityCoordinates.sydney,
      flightPrice: null,
      route: [
        { from: "酒店", to: "皇家植物园", method: "步行/公交", time: "10-15分钟", distance: "1.5公里" },
        { from: "皇家植物园", to: "悉尼鱼市场", method: "轻轨/出租车", time: "20分钟", distance: "5公里" },
        { from: "鱼市场", to: "环形码头（海钓出发地）", method: "轻轨/出租车", time: "15分钟", distance: "4公里" },
        { from: "环形码头", to: "酒店", method: "步行/轻轨", time: "10分钟", distance: "1公里" }
      ],
      accommodationDetails: {
        area: "环形码头/岩石区/达令港",
        recommendations: [
          "Four Seasons Hotel Sydney（四季酒店）- 5星级，位置绝佳",
          "Harbour Rocks Hotel（海港岩石酒店）- 4星级，性价比高",
          "YHA Sydney Harbour（青年旅舍）- 经济型，海港景观"
        ],
        priceRange: "AUD 150-600/晚",
        bookingTips: "建议提前1-2个月预订"
      }
    },
    {
      day: 3,
      date: "Day 3",
      location: "悉尼 (Sydney), 澳大利亚",
      title: "悉尼海岸徒步日",
      activities: [
        {
          time: "上午",
          title: "邦迪海滩 (Bondi Beach)",
          description: "前往世界著名的邦迪海滩，体验海滩文化，可进行冲浪或海滩漫步",
          icon: Waves,
          tips: "早上人少，适合拍照和享受宁静的海滩时光",
          ticketPrice: "免费",
          image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
          coordinates: { lat: -33.8915, lng: 151.2767 }
        },
        {
          time: "中午",
          title: "邦迪到库吉海滩步道徒步",
          description: "沿着海岸线徒步，欣赏壮丽的海景、岩石池和悬崖景观，这是悉尼最著名的海岸步道",
          icon: Footprints,
          tips: "全程约6公里，需1.5-2小时，记得带水和防晒。这是第一个徒步行程",
          ticketPrice: "免费",
          image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
          coordinates: { lat: -33.8915, lng: 151.2767 }
        },
        {
          time: "下午",
          title: "库吉海滩休闲",
          description: "在库吉海滩休息，可以游泳、冲浪或享受海滩时光",
          icon: Sun,
          tips: "库吉海滩有很好的餐厅和咖啡店，可以在这里用午餐",
          ticketPrice: "免费"
        },
        {
          time: "晚上",
          title: "返回市中心晚餐",
          description: "返回悉尼市中心，享用晚餐",
          icon: Utensils,
          tips: "推荐在达令港或岩石区用餐"
        }
      ],
      accommodation: "悉尼市中心酒店",
      highlight: "海岸徒步体验（第一个徒步行程）",
      image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=80",
      coordinates: cityCoordinates.sydney,
      flightPrice: null,
      route: [
        { from: "酒店", to: "邦迪海滩", method: "公交/出租车", time: "30-40分钟", distance: "8公里" },
        { from: "邦迪海滩", to: "库吉海滩", method: "海岸步道徒步", time: "1.5-2小时", distance: "6公里" },
        { from: "库吉海滩", to: "酒店", method: "公交/出租车", time: "40分钟", distance: "10公里" }
      ],
      accommodationDetails: {
        area: "环形码头/岩石区/达令港",
        recommendations: [
          "Four Seasons Hotel Sydney（四季酒店）- 5星级",
          "Harbour Rocks Hotel（海港岩石酒店）- 4星级",
          "YHA Sydney Harbour（青年旅舍）- 经济型"
        ],
        priceRange: "AUD 150-600/晚",
        bookingTips: "建议提前1-2个月预订"
      }
    },
    {
      day: 4,
      date: "Day 4",
      location: "悉尼 (Sydney), 澳大利亚",
      title: "悉尼港海洋观光日",
      activities: [
        {
          time: "上午",
          title: "悉尼港游船观光",
          description: "乘坐游船游览悉尼港，从不同角度欣赏歌剧院、海港大桥和港口美景，了解悉尼的历史和文化",
          icon: Waves,
          tips: "建议选择包含导览的游船，可以了解更多历史。这是唯一的海洋观光行程",
          ticketPrice: "AUD 35-85/人（根据游船类型和时长）",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          coordinates: { lat: -33.8688, lng: 151.2093 }
        },
        {
          time: "中午",
          title: "游船上午餐",
          description: "在游船上享用午餐，同时欣赏海港美景",
          icon: Utensils,
          tips: "很多游船提供午餐套餐，需要提前预订"
        },
        {
          time: "下午",
          title: "塔龙加动物园（可选）",
          description: "可选择前往塔龙加动物园，这里可以俯瞰整个悉尼港，同时观赏澳洲特有动物",
          icon: Camera,
          tips: "动物园位置绝佳，可以看到袋鼠、考拉等澳洲动物",
          ticketPrice: "AUD 46-51/人（成人票）",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          coordinates: { lat: -33.8433, lng: 151.2407 }
        },
        {
          time: "傍晚",
          title: "海德公园 + 圣玛丽大教堂",
          description: "在市中心的海德公园漫步，参观圣玛丽大教堂，体验悉尼的城市文化",
          icon: Building2,
          tips: "海德公园是悉尼最古老的公园，大教堂是澳洲最大的教堂"
        },
        {
          time: "晚上",
          title: "市中心晚餐",
          description: "在市中心享用晚餐，体验悉尼的餐饮文化",
          icon: Utensils,
          tips: "推荐在乔治街或达令港附近用餐"
        }
      ],
      accommodation: "悉尼市中心酒店",
      highlight: "悉尼港海洋观光（唯一的海洋观光行程）",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      coordinates: cityCoordinates.sydney,
      flightPrice: null,
      route: [
        { from: "酒店", to: "环形码头（游船出发地）", method: "步行/轻轨", time: "10分钟", distance: "1公里" },
        { from: "环形码头", to: "塔龙加动物园（可选）", method: "渡轮", time: "15分钟", distance: "3公里" },
        { from: "塔龙加动物园", to: "海德公园", method: "渡轮+步行", time: "30分钟", distance: "5公里" },
        { from: "海德公园", to: "酒店", method: "步行", time: "10分钟", distance: "1公里" }
      ],
      accommodationDetails: {
        area: "环形码头/岩石区/达令港",
        recommendations: [
          "Four Seasons Hotel Sydney（四季酒店）- 5星级",
          "Harbour Rocks Hotel（海港岩石酒店）- 4星级",
          "YHA Sydney Harbour（青年旅舍）- 经济型"
        ],
        priceRange: "AUD 150-600/晚",
        bookingTips: "建议提前1-2个月预订"
      }
    },
    {
      day: 5,
      date: "Day 5",
      location: "悉尼 → 黄金海岸 (Gold Coast), 澳大利亚",
      title: "前往黄金海岸",
      activities: [
        {
          time: "上午",
          title: "飞往黄金海岸",
          description: "乘坐国内航班前往黄金海岸（约1.5小时）",
          icon: Plane,
          tips: "建议选择早班机，充分利用时间"
        },
        {
          time: "下午",
          title: "冲浪者天堂海滩",
          description: "抵达后前往冲浪者天堂，体验冲浪或海滩休闲，享受黄金海岸的阳光和海滩",
          icon: Waves,
          tips: "这里有专业的冲浪学校，适合初学者。海滩非常宽阔，适合各种活动",
          ticketPrice: "海滩免费；冲浪课程：AUD 60-120/人（2小时）",
          image: "https://images.unsplash.com/photo-1507525421304-0d2d3c108235?w=800&q=80",
          coordinates: { lat: -28.0026, lng: 153.4295 }
        },
        {
          time: "傍晚",
          title: "海滩日落漫步",
          description: "在黄金海岸海滩漫步，欣赏美丽的日落",
          icon: Camera,
          tips: "黄金海岸的日落非常壮观，记得带相机"
        },
        {
          time: "晚上",
          title: "海滩餐厅晚餐",
          description: "在海滩附近的餐厅享用晚餐",
          icon: Utensils,
          tips: "推荐餐厅：The Fish House 或 Surfers Paradise 附近的餐厅"
        }
      ],
      accommodation: "黄金海岸海滩度假村",
      highlight: "抵达黄金海岸，海滩休闲",
      image: "https://images.unsplash.com/photo-1507525421304-0d2d3c108235?w=1200&q=80",
      coordinates: cityCoordinates.goldCoast,
      flightPrice: "悉尼 → 黄金海岸：AUD 120-250/人（单程）",
      route: [
        { from: "悉尼机场", to: "黄金海岸机场", method: "国内航班", time: "1.5小时", distance: "800公里" },
        { from: "黄金海岸机场", to: "冲浪者天堂", method: "机场巴士/出租车", time: "30-40分钟", distance: "25公里" },
        { from: "酒店", to: "冲浪者天堂海滩", method: "步行", time: "2-5分钟", distance: "0.2公里" }
      ],
      accommodationDetails: {
        area: "冲浪者天堂/布罗德海滩",
        recommendations: [
          "Peppers Broadbeach（胡椒布罗德海滩酒店）- 5星级，海滩景观，位置绝佳",
          "QT Gold Coast（QT黄金海岸酒店）- 4星级，设计感强，靠近海滩",
          "Mantra on View Hotel（曼特拉景观酒店）- 4星级，性价比高，海景房",
          "Surfers Paradise YHA（冲浪者天堂青年旅舍）- 经济型，靠近海滩，适合预算有限的旅行者"
        ],
        priceRange: "AUD 120-400/晚",
        bookingTips: "冲浪者天堂区域最方便，建议选择海景房"
      }
    },
    {
      day: 6,
      date: "Day 6",
      location: "黄金海岸 (Gold Coast), 澳大利亚",
      title: "黄金海岸徒步日",
      activities: [
        {
          time: "上午",
          title: "春溪国家公园徒步",
          description: "前往春溪国家公园，这里有美丽的雨林步道和瀑布，体验澳洲的自然风光",
          icon: Footprints,
          tips: "推荐：Natural Bridge 步道，可以看到萤火虫洞和瀑布。这是第二个徒步行程",
          ticketPrice: "国家公园门票：免费；萤火虫洞导览：AUD 25-35/人",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
          coordinates: { lat: -28.2000, lng: 153.2667 }
        },
        {
          time: "中午",
          title: "国家公园野餐",
          description: "在国家公园内享用野餐，享受大自然",
          icon: Utensils,
          tips: "可以提前准备食物，或在附近的餐厅用餐"
        },
        {
          time: "下午",
          title: "坦伯林山步道（可选）",
          description: "可选择前往坦伯林山，这里有更多徒步路线和观景点",
          icon: Mountain,
          tips: "坦伯林山有多个难度不同的步道，可以根据体力选择"
        },
        {
          time: "傍晚",
          title: "返回黄金海岸",
          description: "返回黄金海岸，在海滩放松",
          icon: Waves,
          tips: "可以在海滩上休息，欣赏日落"
        },
        {
          time: "晚上",
          title: "海鲜晚餐",
          description: "在黄金海岸享用新鲜海鲜晚餐",
          icon: Utensils,
          tips: "推荐餐厅：The Fish House 或 Omeros Brothers"
        }
      ],
      accommodation: "黄金海岸海滩度假村",
      highlight: "国家公园徒步体验（第二个徒步行程）",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
      coordinates: cityCoordinates.goldCoast,
      flightPrice: null,
      route: [
        { from: "酒店", to: "春溪国家公园", method: "租车/包车", time: "1-1.5小时", distance: "60公里" },
        { from: "春溪国家公园", to: "坦伯林山（可选）", method: "租车/包车", time: "30分钟", distance: "25公里" },
        { from: "坦伯林山", to: "酒店", method: "租车/包车", time: "1小时", distance: "50公里" }
      ],
      accommodationDetails: {
        area: "冲浪者天堂/布罗德海滩",
        recommendations: [
          "Peppers Broadbeach（胡椒布罗德海滩酒店）- 5星级",
          "QT Gold Coast（QT黄金海岸酒店）- 4星级",
          "Mantra on View Hotel（曼特拉景观酒店）- 4星级",
          "Surfers Paradise YHA（冲浪者天堂青年旅舍）- 经济型"
        ],
        priceRange: "AUD 120-400/晚",
        bookingTips: "建议选择靠近海滩的酒店"
      }
    },
    {
      day: 7,
      date: "Day 7",
      location: "黄金海岸 → 奥克兰 (Auckland), 新西兰",
      title: "飞往新西兰 + 奥克兰城市观光",
      activities: [
        {
          time: "上午",
          title: "飞往奥克兰",
          description: "乘坐国际航班前往新西兰奥克兰（约3小时）",
          icon: Plane,
          tips: "注意时差，新西兰比澳大利亚快2-3小时（夏令时）"
        },
        {
          time: "下午",
          title: "奥克兰海港 + 天空塔",
          description: "抵达后游览奥克兰海港，然后前往天空塔，这是南半球最高的建筑，可以俯瞰整个奥克兰",
          icon: Building2,
          tips: "天空塔可以登顶观景，也可以体验高空漫步或蹦极",
          ticketPrice: "天空塔观景：NZD 32/人；高空漫步：NZD 155/人",
          image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80",
          coordinates: { lat: -36.8485, lng: 174.7633 }
        },
        {
          time: "傍晚",
          title: "奥克兰市中心漫步",
          description: "在奥克兰市中心漫步，体验新西兰最大的城市文化",
          icon: Navigation,
          tips: "可以前往皇后街购物，或在高架桥港区用餐"
        },
        {
          time: "晚上",
          title: "奥克兰海港晚餐",
          description: "在奥克兰海港附近享用晚餐，欣赏海港夜景",
          icon: Utensils,
          tips: "推荐餐厅：Depot Eatery 或 The Oyster Inn"
        }
      ],
      accommodation: "奥克兰海港酒店",
      highlight: "抵达新西兰，奥克兰城市观光",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80",
      coordinates: cityCoordinates.auckland,
      flightPrice: "黄金海岸 → 奥克兰：AUD 250-450/人（单程，约3小时）",
      route: [
        { from: "黄金海岸机场", to: "奥克兰机场", method: "国际航班", time: "3小时", distance: "2300公里" },
        { from: "奥克兰机场", to: "市中心酒店", method: "机场巴士/出租车", time: "40-50分钟", distance: "20公里" },
        { from: "酒店", to: "奥克兰海港", method: "步行/公交", time: "10分钟", distance: "1公里" },
        { from: "海港", to: "天空塔", method: "步行", time: "10分钟", distance: "1公里" },
        { from: "天空塔", to: "皇后街", method: "步行", time: "5分钟", distance: "0.5公里" }
      ],
      accommodationDetails: {
        area: "奥克兰市中心/高架桥港区",
        recommendations: [
          "Sofitel Auckland Viaduct Harbour（索菲特奥克兰高架桥港酒店）- 5星级，海港景观，位置绝佳",
          "Cordis Auckland（奥克兰科迪斯酒店）- 5星级，市中心，购物方便",
          "Hilton Auckland（希尔顿奥克兰酒店）- 5星级，海港景观，价格较高",
          "CityLife Auckland（奥克兰城市生活酒店）- 4星级，市中心，性价比高",
          "YHA Auckland City（奥克兰城市青年旅舍）- 经济型，位置便利"
        ],
        priceRange: "NZD 120-500/晚",
        bookingTips: "高架桥港区（Viaduct Harbour）位置最佳，可欣赏海港美景"
      }
    },
    {
      day: 8,
      date: "Day 8",
      location: "奥克兰 (Auckland), 新西兰",
      title: "奥克兰海钓日",
      activities: [
        {
          time: "上午",
          title: "豪拉基湾 (Hauraki Gulf) 海钓",
          description: "参加豪拉基湾的深海钓鱼团，这是奥克兰最著名的海钓区域，鱼类资源丰富",
          icon: Fish,
          tips: "可钓到金枪鱼、鲷鱼、鲈鱼、比目鱼等多种鱼类。需要提前预订。这是第二个钓鱼行程",
          ticketPrice: "NZD 180-350/人（半天行程）",
          image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
          coordinates: { lat: -36.8485, lng: 174.7633 }
        },
        {
          time: "中午",
          title: "船上午餐",
          description: "在钓鱼船上享用午餐，品尝新鲜钓到的鱼",
          icon: Utensils,
          tips: "很多钓鱼团提供现场烹饪服务，可以品尝自己钓到的鱼"
        },
        {
          time: "下午",
          title: "继续海钓或返回",
          description: "继续享受海钓乐趣，或返回奥克兰海港",
          icon: Anchor,
          tips: "如果选择全天行程，可以继续钓鱼。半天行程则返回海港"
        },
        {
          time: "傍晚",
          title: "德文波特 (Devonport) 或使命湾 (Mission Bay)",
          description: "前往德文波特或使命湾，欣赏奥克兰海港美景和日落",
          icon: Camera,
          tips: "这两个地方都是欣赏海港和日落的绝佳位置"
        },
        {
          time: "晚上",
          title: "奥克兰海鲜晚餐",
          description: "在奥克兰享用新鲜海鲜晚餐",
          icon: Utensils,
          tips: "推荐餐厅：Depot Eatery 或 The Oyster Inn"
        }
      ],
      accommodation: "奥克兰海港酒店",
      highlight: "豪拉基湾深海钓鱼（第二个钓鱼行程）",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      coordinates: cityCoordinates.auckland
    },
    {
      day: 9,
      date: "Day 9",
      location: "奥克兰 → 皇后镇 (Queenstown), 新西兰",
      title: "前往皇后镇 + 湖光山色",
      activities: [
        {
          time: "上午",
          title: "飞往皇后镇",
          description: "从奥克兰飞往皇后镇（约1.5小时）",
          icon: Plane,
          tips: "皇后镇机场风景绝美，降落时记得拍照"
        },
        {
          time: "下午",
          title: "瓦卡蒂普湖 (Lake Wakatipu) 观光",
          description: "抵达后游览瓦卡蒂普湖，这是新西兰最美丽的湖泊之一，可以乘坐TSS Earnslaw蒸汽船游览",
          icon: Waves,
          tips: "TSS Earnslaw是南半球唯一仍在运营的燃煤蒸汽船，非常值得体验",
          ticketPrice: "TSS Earnslaw蒸汽船：NZD 75-145/人（根据行程）",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          coordinates: { lat: -45.0312, lng: 168.6626 }
        },
        {
          time: "傍晚",
          title: "皇后镇小镇漫步",
          description: "在皇后镇小镇漫步，欣赏湖光山色，体验这个著名度假小镇的魅力",
          icon: Camera,
          tips: "皇后镇虽然小但非常美丽，有很多特色小店和餐厅",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
          coordinates: { lat: -45.0312, lng: 168.6626 }
        },
        {
          time: "晚上",
          title: "皇后镇晚餐",
          description: "在皇后镇享用晚餐，推荐当地特色",
          icon: Utensils,
          tips: "推荐餐厅：Fishbone Bar & Grill 或 Fergburger（著名汉堡店）"
        }
      ],
      accommodation: "皇后镇湖景度假村",
      highlight: "瓦卡蒂普湖美景 + 皇后镇风光",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      coordinates: cityCoordinates.queenstown,
      flightPrice: "奥克兰 → 皇后镇：NZD 150-300/人（单程，约1.5小时）",
      route: [
        { from: "奥克兰机场", to: "皇后镇机场", method: "国内航班", time: "1.5小时", distance: "1000公里" },
        { from: "皇后镇机场", to: "市中心酒店", method: "机场巴士/出租车", time: "15-20分钟", distance: "8公里" },
        { from: "酒店", to: "瓦卡蒂普湖", method: "步行", time: "2-5分钟", distance: "0.3公里" },
        { from: "湖岸", to: "TSS Earnslaw码头", method: "步行", time: "5分钟", distance: "0.5公里" },
        { from: "码头", to: "皇后镇小镇", method: "步行", time: "5分钟", distance: "0.5公里" }
      ],
      accommodationDetails: {
        area: "皇后镇市中心/湖滨区",
        recommendations: [
          "Eichardt's Private Hotel（艾查特私人酒店）- 5星级，湖景，位置绝佳，价格较高",
          "Hilton Queenstown Resort & Spa（皇后镇希尔顿度假村）- 5星级，湖景，设施完善",
          "Millbrook Resort（米尔布鲁克度假村）- 5星级，高尔夫度假村，距离市中心5公里",
          "Kamana Lakehouse（卡马纳湖屋）- 4星级，湖景，性价比高",
          "YHA Queenstown Lakefront（皇后镇湖滨青年旅舍）- 经济型，湖景，位置便利"
        ],
        priceRange: "NZD 150-800/晚",
        bookingTips: "湖滨区（Lakefront）位置最佳，可欣赏瓦卡蒂普湖美景，建议提前2-3个月预订"
      }
    },
    {
      day: 10,
      date: "Day 10",
      location: "奥克兰 → 返程",
      title: "返程日",
      activities: [
        {
          time: "上午",
          title: "奥克兰鱼市场",
          description: "前往奥克兰鱼市场，购买新鲜海鲜和纪念品",
          icon: Fish,
          tips: "可以购买一些新西兰特产，如绿唇贻贝、三文鱼等",
          image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80",
          coordinates: { lat: -36.8485, lng: 174.7633 }
        },
        {
          time: "中午",
          title: "最后一顿海鲜大餐",
          description: "在奥克兰享用最后一顿海鲜大餐",
          icon: Utensils,
          tips: "推荐：Depot Eatery 或 The Oyster Inn",
          image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80",
          coordinates: { lat: -36.8485, lng: 174.7633 }
        },
        {
          time: "下午",
          title: "前往机场，结束旅程",
          description: "前往奥克兰国际机场，办理登机手续，结束愉快的10天钓鱼度假之旅",
          icon: Plane,
          tips: "建议提前3小时到达机场"
        }
      ],
      accommodation: "返程",
      highlight: "完美收官",
      image: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80",
      coordinates: cityCoordinates.auckland,
      flightPrice: "皇后镇 → 奥克兰：NZD 150-300/人（单程）",
      route: [
        { from: "皇后镇机场", to: "奥克兰机场", method: "国内航班", time: "1.5小时", distance: "1000公里" },
        { from: "奥克兰机场", to: "市中心", method: "机场巴士/出租车", time: "40-50分钟", distance: "20公里" },
        { from: "市中心", to: "奥克兰鱼市场", method: "公交/出租车", time: "15分钟", distance: "3公里" },
        { from: "鱼市场", to: "奥克兰国际机场", method: "机场巴士/出租车", time: "40-50分钟", distance: "20公里" }
      ],
      accommodationDetails: {
        area: "奥克兰机场附近（如需要过夜）",
        recommendations: [
          "Novotel Auckland Airport（奥克兰机场诺富特酒店）- 4星级，机场内，方便转机",
          "Ibis Budget Auckland Airport（奥克兰机场宜必思快捷酒店）- 经济型，机场附近",
          "如不需要过夜，可直接前往机场"
        ],
        priceRange: "NZD 100-250/晚",
        bookingTips: "如航班时间允许，建议直接前往机场，无需住宿"
      }
    }
  ];

  const tips = [
    {
      category: "钓鱼准备",
      items: [
        "提前了解当地钓鱼法规和许可证要求",
        "准备适合的钓鱼装备（或选择租用）",
        "了解目标鱼种和最佳钓鱼时间",
        "预订专业钓鱼团或向导服务"
      ]
    },
    {
      category: "最佳钓鱼时间",
      items: [
        "澳大利亚：全年可钓，但春季（9-11月）和秋季（3-5月）最佳",
        "新西兰：全年可钓，夏季（12-2月）和秋季（3-5月）最佳",
        "海钓：清晨和傍晚是最佳时间",
        "湖钓：全天都可以，但早晨和傍晚效果更好"
      ]
    },
    {
      category: "必备物品",
      items: [
        "防晒霜（SPF50+）和太阳镜",
        "防水外套和帽子",
        "舒适的防滑鞋",
        "相机（记录美好时刻）",
        "晕船药（如需要）",
        "钓鱼许可证（如需要）"
      ]
    },
    {
      category: "预算参考",
      items: [
        "专业海钓团：$150-400/人/天",
        "湖钓向导：$200-500/人/天",
        "钓鱼许可证：$20-50/天",
        "住宿：$100-300/晚",
        "餐饮：$50-150/天"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Fish className="w-16 h-16" />
            <Waves className="w-16 h-16" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            澳新钓鱼海洋度假之旅
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-2">
            10天深度体验澳大利亚和新西兰的海洋魅力
          </p>
          <div className="flex justify-center items-center gap-6 mt-6 text-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>10天9夜</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>悉尼 → 黄金海岸 → 奥克兰 → 皇后镇</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Day Navigation */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {itinerary.map((day, index) => (
              <button
                key={index}
                onClick={() => setActiveDay(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeDay === index
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-blue-100'
                }`}
              >
                Day {day.day}
              </button>
            ))}
          </div>
        </div>

        {/* Active Day Details */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-bold">{itinerary[activeDay].title}</h2>
              <span className="text-xl font-semibold">{itinerary[activeDay].date}</span>
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{itinerary[activeDay].location}</span>
            </div>
          </div>

          <div className="p-6">
            {/* Day Image */}
            {itinerary[activeDay].image && (
              <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={itinerary[activeDay].image} 
                  alt={itinerary[activeDay].title}
                  className="w-full h-64 md:h-80 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=' + encodeURIComponent(itinerary[activeDay].title);
                  }}
                />
              </div>
            )}

            {/* Flight Price */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">机票价格</span>
              </div>
              {itinerary[activeDay].flightPrice ? (
                <p className="text-blue-700 font-medium">{itinerary[activeDay].flightPrice}</p>
              ) : (
                <p className="text-gray-500 italic">缺失信息</p>
              )}
            </div>

            <div className="mb-6 p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-500">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="w-5 h-5 text-cyan-600" />
                <span className="font-semibold text-cyan-800">今日亮点</span>
              </div>
              <p className="text-cyan-700">{itinerary[activeDay].highlight}</p>
            </div>

            <div className="space-y-6 mb-6">
              {itinerary[activeDay].activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="border-l-4 border-blue-500 pl-6 py-4 bg-gradient-to-r from-blue-50 to-transparent rounded-r-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 text-white rounded-full p-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                            {activity.time}
                          </span>
                          <h3 className="text-xl font-bold text-gray-800">
                            {activity.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-2">{activity.description}</p>
                        
                        {/* Activity Image */}
                        {activity.image && (
                          <div className="mb-3 rounded-lg overflow-hidden shadow-md">
                            <img 
                              src={activity.image} 
                              alt={activity.title}
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/800x400?text=' + encodeURIComponent(activity.title);
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Ticket Price */}
                        {activity.ticketPrice !== undefined && (
                          <div className="flex items-start gap-2 mt-3 p-3 bg-green-50 rounded-lg border-l-2 border-green-400">
                            <Ticket className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-green-700 mb-1">门票/费用：</p>
                              <p className="text-sm text-green-800 font-medium">{activity.ticketPrice}</p>
                            </div>
                          </div>
                        )}
                        
                        {activity.ticketPrice === undefined && (
                          <div className="flex items-start gap-2 mt-3 p-3 bg-gray-50 rounded-lg border-l-2 border-gray-300">
                            <Ticket className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-gray-600 mb-1">门票/费用：</p>
                              <p className="text-sm text-gray-500 italic">缺失信息</p>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-2 mt-3 p-3 bg-yellow-50 rounded-lg border-l-2 border-yellow-400">
                          <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-yellow-800">{activity.tips}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Daily Route Map */}
            {itinerary[activeDay].activities && itinerary[activeDay].activities.some(a => a.coordinates) && (
              <DailyMap activities={itinerary[activeDay].activities.filter(a => a.coordinates)} day={activeDay} />
            )}

            {/* Route Information */}
            {itinerary[activeDay].route && itinerary[activeDay].route.length > 0 && (
              <div className="mb-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center gap-2 mb-4">
                  <Navigation className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-800">今日行程路线</h3>
                </div>
                <div className="space-y-3">
                  {itinerary[activeDay].route.map((segment, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">{segment.from}</span>
                            <Navigation className="w-4 h-4 text-purple-500" />
                            <span className="font-semibold text-gray-800">{segment.to}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mt-2">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">交通：</span>
                              <span>{segment.method}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{segment.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{segment.distance}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accommodation Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Hotel className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-bold text-gray-800">住宿推荐</h3>
              </div>
              {itinerary[activeDay].accommodationDetails ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">推荐区域：</p>
                    <p className="text-gray-800 font-medium">{itinerary[activeDay].accommodationDetails.area}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">推荐酒店：</p>
                    <ul className="space-y-2">
                      {itinerary[activeDay].accommodationDetails.recommendations.map((hotel, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-600 font-bold mt-1">{index + 1}.</span>
                          <span>{hotel}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-4 pt-2 border-t border-gray-300">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">价格范围：</p>
                      <p className="text-gray-800 font-medium">{itinerary[activeDay].accommodationDetails.priceRange}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border-l-2 border-blue-400">
                    <p className="text-sm font-semibold text-blue-700 mb-1">💡 预订提示：</p>
                    <p className="text-sm text-blue-800">{itinerary[activeDay].accommodationDetails.bookingTips}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">{itinerary[activeDay].accommodation}</p>
                  <p className="text-sm text-gray-500 italic">详细住宿信息缺失</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Travel Tips */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {tips.map((tip, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                {tip.category}
              </h3>
              <ul className="space-y-2">
                {tip.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-gray-600">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Interactive Map */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Navigation className="w-6 h-6 text-blue-600" />
            行程路线地图
          </h3>
          <div className="mb-4 rounded-lg overflow-hidden shadow-md bg-gray-100">
            <div className="relative w-full" style={{ height: '500px' }}>
              {/* Google Maps Embed - showing Australia and New Zealand */}
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d12000000!2d140!3d-30!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x6b129838f39a743f%3A0x3019d25eef1eb28!2sSydney%20NSW%2C%20Australia!3m2!1d-33.8688197!2d151.2092955!4m5!1s0x6b90d187e0e26f07%3A0x502a35af3deaf40!2sGold%20Coast%20QLD%2C%20Australia!3m2!1d-28.0166667!2d153.4!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
              />
              
              {/* Custom markers overlay */}
              {/* Custom markers overlay */}
              <div className="absolute inset-0">
                {/* Sydney */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                  style={{ 
                    left: '25%', 
                    top: '60%'
                  }}
                  onClick={() => setActiveDay(0)}
                >
                  <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg border-4 border-white">
                    1
                  </div>
                  <div className="text-center mt-2 bg-white px-2 py-1 rounded shadow text-sm font-semibold whitespace-nowrap">
                    悉尼
                  </div>
                </div>
                
                {/* Gold Coast */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                  style={{ 
                    left: '30%', 
                    top: '55%'
                  }}
                  onClick={() => setActiveDay(4)}
                >
                  <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg border-4 border-white">
                    5
                  </div>
                  <div className="text-center mt-2 bg-white px-2 py-1 rounded shadow text-sm font-semibold whitespace-nowrap">
                    黄金海岸
                  </div>
                </div>
                
                {/* Auckland */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                  style={{ 
                    left: '70%', 
                    top: '65%'
                  }}
                  onClick={() => setActiveDay(6)}
                >
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg border-4 border-white">
                    7
                  </div>
                  <div className="text-center mt-2 bg-white px-2 py-1 rounded shadow text-sm font-semibold whitespace-nowrap">
                    奥克兰
                  </div>
                </div>
                
                {/* Queenstown */}
                <div 
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                  style={{ 
                    left: '75%', 
                    top: '75%'
                  }}
                  onClick={() => setActiveDay(8)}
                >
                  <div className="bg-pink-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold shadow-lg border-4 border-white">
                    9
                  </div>
                  <div className="text-center mt-2 bg-white px-2 py-1 rounded shadow text-sm font-semibold whitespace-nowrap">
                    皇后镇
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* City Markers */}
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            {[
              { key: 'sydney', city: cityCoordinates.sydney, bgClass: 'from-blue-50 to-blue-100', borderClass: 'border-blue-200 hover:border-blue-400', iconClass: 'text-blue-600' },
              { key: 'goldCoast', city: cityCoordinates.goldCoast, bgClass: 'from-green-50 to-green-100', borderClass: 'border-green-200 hover:border-green-400', iconClass: 'text-green-600' },
              { key: 'auckland', city: cityCoordinates.auckland, bgClass: 'from-purple-50 to-purple-100', borderClass: 'border-purple-200 hover:border-purple-400', iconClass: 'text-purple-600' },
              { key: 'queenstown', city: cityCoordinates.queenstown, bgClass: 'from-pink-50 to-pink-100', borderClass: 'border-pink-200 hover:border-pink-400', iconClass: 'text-pink-600' }
            ].map(({ key, city, bgClass, borderClass, iconClass }) => {
              const daysInCity = itinerary.filter(day => 
                day.coordinates && day.coordinates.name === city.name
              );
              if (daysInCity.length === 0) return null;
              
              return (
                <div 
                  key={key}
                  className={`bg-gradient-to-br ${bgClass} rounded-lg p-4 border-2 ${borderClass} transition-all cursor-pointer`}
                  onClick={() => {
                    const firstDayInCity = itinerary.findIndex(day => 
                      day.coordinates && day.coordinates.name === city.name
                    );
                    if (firstDayInCity !== -1) setActiveDay(firstDayInCity);
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className={`w-5 h-5 ${iconClass}`} />
                    <h4 className="font-bold text-gray-800">{city.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Day {daysInCity.map(d => d.day).join(', ')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {daysInCity.length} 天
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Route Description */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">路线说明：</h4>
            <p className="text-sm text-gray-600">
              从 <span className="font-semibold text-blue-600">悉尼</span> 出发，前往 <span className="font-semibold text-green-600">黄金海岸</span>，
              然后飞往新西兰的 <span className="font-semibold text-purple-600">奥克兰</span>，最后到达 <span className="font-semibold text-pink-600">皇后镇</span>。
              点击地图上的标记或下方的城市卡片可以快速跳转到对应日期的行程。
            </p>
          </div>
        </div>

        {/* Route Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Navigation className="w-6 h-6 text-blue-600" />
            行程路线图
          </h3>
          <div className="space-y-3">
            {itinerary.map((day, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-4 p-3 rounded-lg transition-all cursor-pointer ${
                  index === activeDay ? 'bg-blue-50 border-2 border-blue-400' : 'hover:bg-gray-50'
                }`}
                onClick={() => setActiveDay(index)}
              >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === activeDay ? 'bg-blue-600 scale-110' : 'bg-gray-400'
                  }`}>
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{day.location}</p>
                    <p className="text-sm text-gray-500">{day.title}</p>
                  </div>
                  {index < itinerary.length - 1 && (
                    <div className="text-gray-400">
                      <Navigation className="w-5 h-5" />
                    </div>
                  )}
                </div>
            ))}
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-center">行程活动总结</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
              <Fish className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold text-lg mb-1">钓鱼行程</p>
              <p className="text-sm">2个专业钓鱼体验</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
              <Footprints className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold text-lg mb-1">徒步行程</p>
              <p className="text-sm">2个精彩徒步路线</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
              <Waves className="w-8 h-8 mx-auto mb-2" />
              <p className="font-semibold text-lg mb-1">海洋观光</p>
              <p className="text-sm">1个海洋观光体验</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 py-8">
          <p className="mb-2">🎣 祝您享受一次完美的澳新钓鱼海洋度假之旅！</p>
          <p className="text-sm">记得带上相机，记录每一个美好瞬间 📸</p>
        </div>
      </div>
    </div>
  );
}

export default TravelGuide;

