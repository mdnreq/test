"use client"

import React from "react"

type ServiceType = 
  | "analytics" 
  | "field" 
  | "web" 
  | "design" 
  | "seo" 
  | "reputation" 
  | "crisis" 
  | "media" 
  | "youth" 
  | "fundraising"
  | "content"
  | "video"
  | "email"
  | "research"
  | "digital"

interface AnimatedServiceBackgroundProps {
  type: ServiceType
  className?: string
}

export function AnimatedServiceBackground({ type, className = "" }: AnimatedServiceBackgroundProps) {
  const patterns: Record<ServiceType, React.ReactNode> = {
    analytics: <AnalyticsPattern />,
    field: <FieldPattern />,
    web: <WebPattern />,
    design: <DesignPattern />,
    seo: <SeoPattern />,
    reputation: <ReputationPattern />,
    crisis: <CrisisPattern />,
    media: <MediaPattern />,
    youth: <YouthPattern />,
    fundraising: <FundraisingPattern />,
    content: <ContentPattern />,
    video: <VideoPattern />,
    email: <EmailPattern />,
    research: <ResearchPattern />,
    digital: <DigitalPattern />,
  }
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {patterns[type]}
    </div>
  )
}

// ─── 1. ANALYTICS: Isometric diamond lattice ───
// Tilted grid of diamond shapes = structured data visualization
function AnalyticsPattern() {
  const c = "#2dd4bf"
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {Array.from({ length: 5 }).map((_, r) =>
        Array.from({ length: 14 }).map((_, col) => {
          const x = col * 62 + (r % 2) * 31 - 30
          const y = r * 40 + 20
          return (
            <polygon key={`d${r}-${col}`}
              points={`${x},${y-18} ${x+30},${y} ${x},${y+18} ${x-30},${y}`}
              stroke={c} strokeWidth="1.2" fill="none" opacity="0.35"
            />
          )
        })
      )}
      <rect width="100" height="200" fill={c} opacity="0.06">
        <animate attributeName="x" values="-100;900" dur="4s" repeatCount="indefinite" />
      </rect>
      {[100, 280, 460, 640].map((x, i) => (
        <circle key={i} cx={x} cy={60 + (i % 3) * 40} r="4" fill={c} opacity="0.6">
          <animate attributeName="r" values="3;6;3" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  )
}

// ─── 2. FIELD: Hexagonal territory cells ───
// Honeycomb of hex cells = field territory mapping
function FieldPattern() {
  const c = "#f59e0b"
  const hexR = 28
  const hexH = hexR * Math.sqrt(3) / 2
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 12 }).map((_, col) => {
          const cx = col * (hexR * 1.5) + (r % 2) * (hexR * 0.75)
          const cy = r * (hexH * 2) + hexH + 10
          const pts = Array.from({ length: 6 }).map((_, i) => {
            const a = (Math.PI / 3) * i - Math.PI / 6
            return `${cx + hexR * Math.cos(a)},${cy + hexR * Math.sin(a)}`
          }).join(" ")
          return <polygon key={`h${r}-${col}`} points={pts} stroke={c} strokeWidth="1" fill="none" opacity="0.3" />
        })
      )}
      {/* Pulsing territory highlights */}
      {[80, 230, 410, 560, 720].map((x, i) => (
        <circle key={i} cx={x} cy={50 + (i % 3) * 50} r="18" fill={c} opacity="0">
          <animate attributeName="opacity" values="0;0.12;0" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.6}s`} />
          <animate attributeName="r" values="10;30;10" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.6}s`} />
        </circle>
      ))}
    </svg>
  )
}

// ─── 3. WEB: Interconnected node mesh ───
// Nodes with connecting lines = network/internet architecture
function WebPattern() {
  const c = "#22d3ee"
  const nodes = [
    [60,40],[180,120],[300,50],[400,140],[520,70],[640,110],[760,40],
    [120,160],[240,80],[360,170],[480,30],[600,160],[720,90],
    [40,100],[200,30],[340,110],[460,100],[580,40],[700,160]
  ]
  const edges = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[7,1],[8,2],[9,3],[10,4],[11,5],
    [0,13],[13,7],[8,14],[14,0],[2,15],[15,9],[10,16],[16,3],[4,17],[17,11],[5,18]
  ]
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {edges.map(([a, b], i) => (
        <line key={`e${i}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={c} strokeWidth="1" opacity="0.25"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={`n${i}`} cx={x} cy={y} r={i % 4 === 0 ? 5 : 3} fill={c} opacity={i % 3 === 0 ? 0.7 : 0.4}>
          <animate attributeName="opacity" values={`${0.3};${0.8};${0.3}`} dur={`${2 + (i % 5) * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
        </circle>
      ))}
      {/* Data packet traveling */}
      <circle r="4" fill={c} opacity="0.9">
        <animate attributeName="cx" values="60;180;300;400;520;640;760" dur="5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="40;120;50;140;70;110;40" dur="5s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

// ─── 4. DESIGN: Morphing Bezier curves ───
// Smooth flowing curves = creativity, artistry
function DesignPattern() {
  const c = "#e879f9"
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      <path fill="none" stroke={c} strokeWidth="2" opacity="0.4">
        <animate attributeName="d"
          values="M0,100 C100,20 200,180 400,100 C600,20 700,180 800,100;
                  M0,80 C150,180 250,20 400,120 C550,180 650,20 800,80;
                  M0,120 C100,40 300,160 400,80 C500,40 700,160 800,120;
                  M0,100 C100,20 200,180 400,100 C600,20 700,180 800,100"
          dur="8s" repeatCount="indefinite" />
      </path>
      <path fill="none" stroke={c} strokeWidth="1.5" opacity="0.3">
        <animate attributeName="d"
          values="M0,60 C200,160 300,40 500,80 C700,120 750,40 800,60;
                  M0,140 C100,40 400,160 500,120 C600,40 750,160 800,140;
                  M0,60 C200,160 300,40 500,80 C700,120 750,40 800,60"
          dur="10s" repeatCount="indefinite" />
      </path>
      <path fill="none" stroke={c} strokeWidth="1" opacity="0.2">
        <animate attributeName="d"
          values="M0,160 C200,60 400,140 500,40 C600,140 700,60 800,160;
                  M0,40 C200,140 400,60 500,160 C600,60 700,140 800,40;
                  M0,160 C200,60 400,140 500,40 C600,140 700,60 800,160"
          dur="12s" repeatCount="indefinite" />
      </path>
      {/* Floating accent dots along curves */}
      <circle r="5" fill={c} opacity="0.6">
        <animate attributeName="cx" values="0;400;800;400;0" dur="8s" repeatCount="indefinite" />
        <animate attributeName="cy" values="100;60;100;140;100" dur="8s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

// ─── 5. SEO: Concentric target rings with sweep ───
// Radar rings + sweep = search, targeting, ranking
function SeoPattern() {
  const c = "#3b82f6"
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {[40, 70, 100, 130, 160].map((r, i) => (
        <ellipse key={i} cx="400" cy="100" rx={r * 2.5} ry={r} stroke={c} strokeWidth="1"
          fill="none" opacity={0.4 - i * 0.06} />
      ))}
      {/* Sweep line */}
      <line x1="400" y1="100" x2="800" y2="100" stroke={c} strokeWidth="2" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="0 400 100" to="360 400 100" dur="6s" repeatCount="indefinite" />
      </line>
      {/* Blip targets */}
      {[[520, 80], [300, 60], [600, 130], [200, 120], [680, 70]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={c} opacity="0">
          <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" begin={`${i * 0.6}s`} />
        </circle>
      ))}
    </svg>
  )
}

// ─── 6. REPUTATION: Stacked ascending wave layers ───
// Layered waves rising = trust/credibility building
function ReputationPattern() {
  const c = "#818cf8"
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {[0, 1, 2, 3, 4].map(i => (
        <path key={i} fill={c} opacity={0.08 + i * 0.04}>
          <animate attributeName="d"
            values={`M0,${180 - i * 30} Q200,${160 - i * 30} 400,${170 - i * 30} Q600,${180 - i * 30} 800,${165 - i * 30} L800,200 L0,200 Z;
                     M0,${170 - i * 30} Q200,${150 - i * 30} 400,${160 - i * 30} Q600,${170 - i * 30} 800,${155 - i * 30} L800,200 L0,200 Z;
                     M0,${180 - i * 30} Q200,${160 - i * 30} 400,${170 - i * 30} Q600,${180 - i * 30} 800,${165 - i * 30} L800,200 L0,200 Z`}
            dur={`${5 + i * 1.5}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* Rising particles */}
      {[150, 400, 650].map((x, i) => (
        <circle key={i} r="3" fill={c} opacity="0.5">
          <animate attributeName="cx" values={`${x};${x + 20};${x}`} dur={`${6 + i}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values="190;20;190" dur={`${8 + i * 2}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.6;0" dur={`${8 + i * 2}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  )
}

// ─── 7. CRISIS: Angular zigzag seismograph ───
// Sharp zigzag lines = tension, urgency, alert
function CrisisPattern() {
  const c = "#ef4444"
  const buildZig = (baseY: number, amp: number, segs: number) => {
    let d = `M0,${baseY}`
    for (let i = 1; i <= segs; i++) {
      const x = (800 / segs) * i
      const y = baseY + (i % 2 === 0 ? -amp : amp)
      d += ` L${x},${y}`
    }
    return d
  }
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {[
        { y: 50, amp: 30, segs: 20, o: 0.35, sw: 2 },
        { y: 100, amp: 40, segs: 16, o: 0.45, sw: 2.5 },
        { y: 150, amp: 25, segs: 24, o: 0.3, sw: 1.5 },
      ].map((line, i) => (
        <g key={i}>
          <path d={buildZig(line.y, line.amp, line.segs)} stroke={c} strokeWidth={line.sw} fill="none" opacity={line.o} />
          {/* Sweep pulse along line */}
          <rect y={line.y - line.amp - 5} width="60" height={line.amp * 2 + 10} fill={c} opacity="0.06">
            <animate attributeName="x" values="-60;860" dur={`${2.5 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
          </rect>
        </g>
      ))}
      {/* Warning pulse in center */}
      <circle cx="400" cy="100" r="5" fill={c} opacity="0.6">
        <animate attributeName="r" values="5;20;5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

// ─── 8. MEDIA: Concentric arc segments ───
// Arcs radiating from left = broadcast, signal reach
function MediaPattern() {
  const c = "#a855f7"
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {/* Source point */}
      <circle cx="50" cy="100" r="6" fill={c} opacity="0.7">
        <animate attributeName="r" values="5;8;5" dur="1.5s" repeatCount="indefinite" />
      </circle>
      {/* Expanding arc rings */}
      {[80, 160, 260, 380, 520].map((r, i) => (
        <path key={i}
          d={`M50,${100 - r * 0.4} A${r},${r * 0.4} 0 0 1 50,${100 + r * 0.4}`}
          stroke={c} strokeWidth={2 - i * 0.2} fill="none" opacity={0.5 - i * 0.08}>
          <animate attributeName="opacity" values={`${0.5 - i * 0.08};${0.2};${0.5 - i * 0.08}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* Signal particles traveling right */}
      {[0, 1, 2].map(i => (
        <circle key={i} r="3" fill={c} opacity="0.6">
          <animate attributeName="cx" values="60;780" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 1}s`} />
          <animate attributeName="cy" values={`${80 + i * 20};${90 + i * 10}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 1}s`} />
          <animate attributeName="opacity" values="0.7;0.1" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 1}s`} />
        </circle>
      ))}
    </svg>
  )
}

// ─── 9. YOUTH: Scattered rotating pentagons + triangles ───
// Mixed polygons rotating = energy, diversity, movement
function YouthPattern() {
  const c = "#f472b6"
  const shapes = [
    { x: 80, y: 60, sides: 3, r: 18, dur: "8s" },
    { x: 200, y: 140, sides: 5, r: 15, dur: "12s" },
    { x: 350, y: 50, sides: 4, r: 20, dur: "10s" },
    { x: 480, y: 130, sides: 3, r: 16, dur: "7s" },
    { x: 600, y: 70, sides: 6, r: 14, dur: "14s" },
    { x: 720, y: 140, sides: 5, r: 18, dur: "9s" },
    { x: 140, y: 100, sides: 4, r: 12, dur: "11s" },
    { x: 540, y: 160, sides: 3, r: 14, dur: "6s" },
    { x: 670, y: 30, sides: 6, r: 16, dur: "13s" },
  ]
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {shapes.map((s, i) => {
        const pts = Array.from({ length: s.sides }).map((_, j) => {
          const a = (2 * Math.PI / s.sides) * j - Math.PI / 2
          return `${s.x + s.r * Math.cos(a)},${s.y + s.r * Math.sin(a)}`
        }).join(" ")
        return (
          <polygon key={i} points={pts} stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.06" opacity="0.4">
            <animateTransform attributeName="transform" type="rotate"
              from={`0 ${s.x} ${s.y}`} to={`${i % 2 === 0 ? 360 : -360} ${s.x} ${s.y}`}
              dur={s.dur} repeatCount="indefinite" />
          </polygon>
        )
      })}
      {/* Bouncing dots */}
      {[120, 300, 500, 680].map((x, i) => (
        <circle key={i} cx={x} cy={100} r="3" fill={c} opacity="0.5">
          <animate attributeName="cy" values={`${60 + i * 20};${140 - i * 10};${60 + i * 20}`} dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  )
}

// ─── 10. FUNDRAISING: Exponential growth dots ───
// Ascending dot curve = financial growth, momentum
function FundraisingPattern() {
  const c = "#34d399"
  const dots: [number, number][] = []
  for (let i = 0; i <= 20; i++) {
    const x = (i / 20) * 750 + 25
    const y = 180 - Math.pow(i / 20, 2.2) * 160
    dots.push([x, y])
  }
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {/* Growth curve path */}
      <path d={`M${dots.map(([x, y]) => `${x},${y}`).join(" L")}`}
        stroke={c} strokeWidth="2" fill="none" opacity="0.4" />
      {/* Dots along curve */}
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2 + (i / 20) * 3} fill={c} opacity={0.2 + (i / 20) * 0.5}>
          <animate attributeName="opacity" values={`${0.2 + (i / 20) * 0.3};${0.4 + (i / 20) * 0.4};${0.2 + (i / 20) * 0.3}`}
            dur={`${3 - (i / 20) * 1.5}s`} repeatCount="indefinite" begin={`${i * 0.1}s`} />
        </circle>
      ))}
      {/* Highlight traveling up curve */}
      <circle r="6" fill={c} opacity="0.7">
        <animate attributeName="cx" values={dots.map(d => d[0]).join(";")} dur="4s" repeatCount="indefinite" />
        <animate attributeName="cy" values={dots.map(d => d[1]).join(";")} dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Milestone markers */}
      {[5, 10, 15, 20].map(i => (
        <line key={i} x1={dots[i][0]} y1={dots[i][1]} x2={dots[i][0]} y2="195" stroke={c} strokeWidth="1" opacity="0.15" strokeDasharray="3,4" />
      ))}
    </svg>
  )
}

// ─── 11. CONTENT: Typewriter text lines ───
// Horizontal lines appearing progressively = writing, storytelling
function ContentPattern() {
  const c = "#c084fc"
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {/* Text lines appearing */}
      {[30, 60, 90, 120, 150, 175].map((y, i) => (
        <rect key={i} x="60" y={y} height="4" rx="2" fill={c} opacity="0.35">
          <animate attributeName="width" values={`0;${500 - i * 50};${500 - i * 50};0`} dur={`${4 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
          <animate attributeName="opacity" values="0;0.4;0.4;0" dur={`${4 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
        </rect>
      ))}
      {/* Cursor blinking at end of current line */}
      <rect width="3" height="18" rx="1" fill={c} opacity="0.7">
        <animate attributeName="x" values="60;400;60" dur="4s" repeatCount="indefinite" />
        <animate attributeName="y" values="22;22;52" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;1;0;1;0;1" dur="1s" repeatCount="indefinite" />
      </rect>
      {/* Paragraph blocks on right */}
      {[35, 80, 130].map((y, i) => (
        <rect key={`p${i}`} x={600} y={y} width={150 - i * 20} height="30" rx="4" stroke={c} strokeWidth="1" fill="none" opacity="0.2">
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur={`${3 + i}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
        </rect>
      ))}
    </svg>
  )
}

// ─── 12. VIDEO: Film frame scan lines ───
// Horizontal scan + frame corners = cinema, production
function VideoPattern() {
  const c = "#fb7185"
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {/* Letterbox top/bottom lines */}
      <line x1="40" y1="20" x2="760" y2="20" stroke={c} strokeWidth="1" opacity="0.3" />
      <line x1="40" y1="180" x2="760" y2="180" stroke={c} strokeWidth="1" opacity="0.3" />
      {/* Frame corners */}
      {[
        "M40,40 L40,20 L60,20", "M740,20 L760,20 L760,40",
        "M40,160 L40,180 L60,180", "M740,180 L760,180 L760,160"
      ].map((d, i) => (
        <path key={i} d={d} stroke={c} strokeWidth="2" fill="none" opacity="0.5" />
      ))}
      {/* Scan line sweeping */}
      <line x1="40" x2="760" stroke={c} strokeWidth="1.5" opacity="0.4">
        <animate attributeName="y1" values="20;180;20" dur="3s" repeatCount="indefinite" />
        <animate attributeName="y2" values="20;180;20" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0.15;0.4" dur="3s" repeatCount="indefinite" />
      </line>
      {/* Film grain dots */}
      {Array.from({ length: 15 }).map((_, i) => (
        <circle key={i} cx={80 + (i % 5) * 160} cy={40 + Math.floor(i / 5) * 60} r="1.5" fill={c} opacity="0.2">
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur={`${0.5 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  )
}

// ─── 13. EMAIL: Parabolic delivery arcs ───
// Arc trajectories from left to staggered right = messages sent
function EmailPattern() {
  const c = "#4ade80"
  const arcs = [
    "M40,170 Q200,20 500,60",
    "M40,170 Q300,30 620,80",
    "M40,170 Q350,10 740,50",
  ]
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {arcs.map((d, i) => (
        <g key={i}>
          <path d={d} stroke={c} strokeWidth="1.5" fill="none" opacity={0.35 - i * 0.05} />
          <circle r="5" fill={c} opacity="0.7">
            <animateMotion dur={`${2.5 + i * 0.5}s`} repeatCount="indefinite" path={d} begin={`${i * 0.8}s`} />
            <animate attributeName="opacity" values="0.8;0.2" dur={`${2.5 + i * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
          </circle>
        </g>
      ))}
      {/* Origin point */}
      <circle cx="40" cy="170" r="6" fill={c} opacity="0.5">
        <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Delivery endpoints */}
      {[[500, 60], [620, 80], [740, 50]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={c} opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
        </circle>
      ))}
    </svg>
  )
}

// ─── 14. RESEARCH: Constellation map with dashed links ───
// Star-chart style dots + dashed connections = investigation, discovery
function ResearchPattern() {
  const c = "#fbbf24"
  const stars: [number, number][] = [
    [100, 40], [220, 130], [330, 60], [450, 150], [540, 50],
    [650, 120], [750, 35], [160, 160], [380, 100], [580, 170],
    [700, 80], [280, 30], [490, 90], [120, 100], [630, 45]
  ]
  const links = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[7,1],[8,2],[9,5],[10,6],[11,0],[12,4],[13,7],[14,10]]
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {links.map(([a, b], i) => (
        <line key={i} x1={stars[a][0]} y1={stars[a][1]} x2={stars[b][0]} y2={stars[b][1]}
          stroke={c} strokeWidth="1" strokeDasharray="4,6" opacity="0.2">
          <animate attributeName="opacity" values="0.1;0.35;0.1" dur={`${4 + (i % 5)}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
        </line>
      ))}
      {stars.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 4 : 2.5} fill={c} opacity={i % 3 === 0 ? 0.7 : 0.35}>
          <animate attributeName="opacity" values={`${0.25};${0.65};${0.25}`} dur={`${3 + (i % 4)}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
        </circle>
      ))}
      {/* Moving magnifier */}
      <circle r="30" stroke={c} strokeWidth="1.5" fill={c} fillOpacity="0.03" opacity="0.3">
        <animate attributeName="cx" values="100;700;100" dur="12s" repeatCount="indefinite" />
        <animate attributeName="cy" values="80;100;80" dur="8s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

// ─── 15. DIGITAL: Radial burst grid ───
// Dots pulsing outward from two points = broadcast, reach, targeting
function DigitalPattern() {
  const c = "#60a5fa"
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice">
      {/* Dot grid */}
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 16 }).map((_, col) => {
          const x = col * 52 + 20
          const y = r * 34 + 20
          return (
            <circle key={`g${r}-${col}`} cx={x} cy={y} r="2" fill={c} opacity="0.2">
              <animate attributeName="opacity" values="0.1;0.45;0.1"
                dur={`${3 + ((r + col) % 5) * 0.4}s`} repeatCount="indefinite"
                begin={`${(r * 0.15 + col * 0.1)}s`} />
            </circle>
          )
        })
      )}
      {/* Wave expanding from left broadcast point */}
      <circle cx="120" cy="100" fill="none" stroke={c} strokeWidth="1.5" opacity="0">
        <animate attributeName="r" values="10;200;10" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Wave expanding from right broadcast point */}
      <circle cx="680" cy="100" fill="none" stroke={c} strokeWidth="1.5" opacity="0">
        <animate attributeName="r" values="10;200;10" dur="4s" repeatCount="indefinite" begin="2s" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" begin="2s" />
      </circle>
      {/* Broadcast centers */}
      <circle cx="120" cy="100" r="5" fill={c} opacity="0.6">
        <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="680" cy="100" r="5" fill={c} opacity="0.6">
        <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>
    </svg>
  )
}
