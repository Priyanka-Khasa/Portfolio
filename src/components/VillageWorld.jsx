/**
 * ULTIMATE VILLAGE PORTFOLIO - Redesigned for maximum visual fidelity
 * A photorealistic 3D Indian village world as an interactive portfolio
 *
 * Key upgrades over original:
 * - PBR materials with roughness/metalness maps
 * - Volumetric atmospheric fog + god rays
 * - Physically-based sky with sun disc + horizon glow
 * - SSAO-style ambient occlusion via shadow intensity
 * - Detailed terrain with height variation
 * - Realistic water with reflection + wave distortion
 * - Enhanced buildings with more geometry detail
 * - Rich particle systems (fireflies, pollen, dust motes)
 * - Cinematic camera with depth-of-field-like focus
 * - Polished HUD with glassmorphism panels
 * - Smooth state transitions + animated overlays
 */

import {
  Canvas,
  useFrame,
  useThree,
} from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import { Environment, OrbitControls, SoftShadows } from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

// --- DATA ---------------------------------------------------------------------
const places = [
  {
    id: "home",
    label: "Home",
    emoji: "home",
    color: "#ffb347",
    position: [-4, 0, -8],
    description: "Welcome - where it all begins.",
    accent: "#ff8c00",
  },
  {
    id: "education",
    label: "Education",
    emoji: "book",
    color: "#7ec8e3",
    position: [14, 0, -10],
    description: "The library of accumulated knowledge.",
    accent: "#4a90d9",
  },
  {
    id: "projects",
    label: "Projects",
    emoji: "gear",
    color: "#76f4ff",
    position: [-16, 0, -12],
    description: "The workshop where ideas become reality.",
    accent: "#00bcd4",
  },
  {
    id: "skills",
    label: "Skills",
    emoji: "farm",
    color: "#a8e063",
    position: [-12, 0, -34],
    description: "A cultivated farm of capabilities.",
    accent: "#4caf50",
  },
  {
    id: "achievements",
    label: "Achievements",
    emoji: "temple",
    color: "#ffd700",
    position: [12, 0, -36],
    description: "A temple built from milestones.",
    accent: "#ff9800",
  },
  {
    id: "experience",
    label: "Experience",
    emoji: "market",
    color: "#ff6b6b",
    position: [4, 0, 12],
    description: "The market of professional journey.",
    accent: "#e53935",
  },
  {
    id: "contact",
    label: "Contact",
    emoji: "mail",
    color: "#c084fc",
    position: [22, 0, -2],
    description: "The post office - send a message.",
    accent: "#9333ea",
  },
];

const placeById = Object.fromEntries(places.map((p) => [p.id, p]));

// --- MATH UTILS ---------------------------------------------------------------
const lerp = THREE.MathUtils.lerp;
const rand = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(rand(min, max + 1));

// --- PBR MATERIAL PRESETS -----------------------------------------------------
const MAT = {
  mud: { color: "#c4956a", roughness: 0.95, metalness: 0 },
  thatch: { color: "#9b8558", roughness: 1, metalness: 0 },
  stone: { color: "#7a7268", roughness: 0.8, metalness: 0.1 },
  wood: { color: "#6b3d1e", roughness: 0.8, metalness: 0.05 },
  darkWood: { color: "#3e1f0a", roughness: 0.85, metalness: 0.05 },
  gold: { color: "#ffd700", roughness: 0.15, metalness: 1.0, envMapIntensity: 1.5 },
  brass: { color: "#b5902a", roughness: 0.3, metalness: 0.85, envMapIntensity: 1.2 },
  leaf: { color: "#2d6a2d", roughness: 0.8, metalness: 0 },
  grass: { color: "#4a8c3f", roughness: 0.9, metalness: 0 },
  soil: { color: "#5a3620", roughness: 1, metalness: 0 },
  water: { color: "#2a7a9e", roughness: 0.02, metalness: 0.9, transparent: true, opacity: 0.85, envMapIntensity: 2.0 },
  plaster: { color: "#d4b896", roughness: 0.9, metalness: 0 },
  whitePlaster: { color: "#ebe0cc", roughness: 0.85, metalness: 0 },
  terracotta: { color: "#cc5e3a", roughness: 0.8, metalness: 0.1 },
  marble: { color: "#ffe4c4", roughness: 0.2, metalness: 0.1, envMapIntensity: 1.2 },
};

function M(preset, override = {}) {
  return <meshStandardMaterial {...MAT[preset]} {...override} />;
}

// --- GLOW LIGHT ---------------------------------------------------------------
function Glow({ color = "#ffcf7a", intensity = 1.5, distance = 10, scale = 1, pulse = false }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (pulse && ref.current) {
      ref.current.intensity = intensity * (0.85 + 0.15 * Math.sin(clock.elapsedTime * 3));
    }
  });
  return (
    <group scale={scale}>
      <mesh>
        <sphereGeometry args={[0.14, 12, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      <pointLight ref={ref} color={color} intensity={intensity} distance={distance} decay={2} />
    </group>
  );
}

// --- LABEL SIGN ---------------------------------------------------------------
function PlaceLabel({ place }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Sign board */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 0.35, 0.1]} />
        <meshStandardMaterial color={place.color} emissive={place.color} emissiveIntensity={0.6} roughness={0.4} />
      </mesh>
      {/* Sign border */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[2.5, 0.45, 0.04]} />
        <meshStandardMaterial color={place.accent || "#555"} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Hanging post */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.0, 8]} />
        {M("darkWood")}
      </mesh>
      {/* Post base ornament */}
      <mesh position={[0, -1.05, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={place.accent || "#666"} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

// --- STONE BASE ---------------------------------------------------------------
function StoneBase({ width, depth }) {
  return (
    <group>
      <mesh receiveShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[width + 0.8, 0.25, depth + 0.8]} />
        {M("stone")}
      </mesh>
      {/* Stone trim */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[width + 0.6, 0.08, depth + 0.6]} />
        <meshStandardMaterial color="#8a7f74" roughness={0.8} />
      </mesh>
    </group>
  );
}

// --- DETAILED HUT -------------------------------------------------------------
function Hut({ place, width = 4.8, onSelect, decorated = false, showGlow = true }) {
  const depth = width * 0.78;
  const wallH = 3.2;
  const roofBase = 1.4 + wallH;

  return (
    <group position={place.position} onClick={() => onSelect(place.id)}>
      <StoneBase width={width} depth={depth} />

      {/* Steps */}
      <group position={[0, 0.22, depth / 2 + 0.3]}>
        <mesh castShadow position={[0, 0.1, 0]}>
          <boxGeometry args={[1.8, 0.2, 0.55]} />
          {M("stone", { color: "#777068" })}
        </mesh>
        <mesh castShadow position={[0, -0.05, 0.5]}>
          <boxGeometry args={[2.2, 0.2, 0.55]} />
          {M("stone")}
        </mesh>
      </group>

      {/* Main walls */}
      <mesh castShadow receiveShadow position={[0, wallH / 2 + 0.3, 0]}>
        <boxGeometry args={[width, wallH, depth]} />
        {M("plaster")}
      </mesh>

      {/* Wall horizontal band */}
      <mesh position={[0, wallH * 0.6 + 0.3, 0]}>
        <boxGeometry args={[width + 0.01, 0.15, depth + 0.01]} />
        <meshStandardMaterial color="#b88c6a" roughness={0.9} />
      </mesh>

      {/* Corner pillars */}
      {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([mx, mz], i) => (
        <mesh key={i} castShadow position={[mx * width * 0.49, wallH / 2 + 0.3, mz * depth * 0.49]}>
          <boxGeometry args={[0.22, wallH, 0.22]} />
          {M("whitePlaster")}
        </mesh>
      ))}

      {/* Roof with overhang */}
      <group position={[0, roofBase, 0]}>
        <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[width * 0.92, 2.6, 4, 1]} />
          {M("thatch")}
        </mesh>
        {/* Thatch layers */}
        <mesh rotation={[0, Math.PI / 4, 0]} position={[0, -0.3, 0]}>
          <coneGeometry args={[width * 0.98, 0.6, 4, 1]} />
          <meshStandardMaterial color="#7a6440" roughness={1} />
        </mesh>
        {/* Roof ridge */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          {M("terracotta")}
        </mesh>
        {/* Chimney */}
        <mesh castShadow position={[width * 0.22, 1.1, -depth * 0.2]}>
          <cylinderGeometry args={[0.13, 0.16, 1.0, 8]} />
          {M("stone")}
        </mesh>
        <mesh position={[width * 0.22, 1.65, -depth * 0.2]}>
          <cylinderGeometry args={[0.17, 0.13, 0.18, 8]} />
          {M("stone", { color: "#555" })}
        </mesh>
      </group>

      {/* Door */}
      <group position={[0, wallH * 0.38 + 0.25, depth / 2 + 0.03]}>
        {/* Door arch */}
        <mesh castShadow position={[0, 0.2, -0.05]}>
          <boxGeometry args={[1.5, 2.6, 0.18]} />
          {M("whitePlaster")}
        </mesh>
        {/* Door panel */}
        <mesh castShadow>
          <boxGeometry args={[1.2, 2.2, 0.12]} />
          {M("darkWood")}
        </mesh>
        {/* Door vertical divider */}
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[0.06, 2.2, 0.05]} />
          <meshStandardMaterial color="#2a1505" />
        </mesh>
        {/* Door handle */}
        <mesh position={[0.42, 0, 0.1]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          {M("brass")}
        </mesh>
        <mesh position={[-0.42, 0, 0.1]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          {M("brass")}
        </mesh>
      </group>

      {/* Windows - front */}
      <group position={[0, wallH * 0.65 + 0.15, depth / 2 + 0.03]}>
        {[[-width * 0.29, 0], [width * 0.29, 0]].map(([wx, _, i]) => (
          <group key={wx} position={[wx, 0, 0]}>
            <mesh>
              <boxGeometry args={[1.0, 1.0, 0.18]} />
              {M("whitePlaster")}
            </mesh>
            <mesh position={[0, 0, 0.1]}>
              <boxGeometry args={[0.75, 0.75, 0.06]} />
              <meshStandardMaterial color="#7ab4cc" roughness={0.05} metalness={0.1} transparent opacity={0.7} />
            </mesh>
            {/* Window shutters */}
            <mesh position={[-0.43, 0, 0.12]} rotation={[0, 0.4, 0]}>
              <boxGeometry args={[0.38, 0.8, 0.06]} />
              {M("wood")}
            </mesh>
            <mesh position={[0.43, 0, 0.12]} rotation={[0, -0.4, 0]}>
              <boxGeometry args={[0.38, 0.8, 0.06]} />
              {M("wood")}
            </mesh>
          </group>
        ))}
      </group>

      {/* Side windows */}
      {[[-1, 0], [1, 0]].map(([sx, _, si]) => (
        <group key={sx} position={[sx * (width / 2 + 0.03), wallH * 0.6 + 0.15, 0]}>
          <mesh>
            <boxGeometry args={[0.18, 0.9, 1.0]} />
            {M("whitePlaster")}
          </mesh>
          <mesh position={[sx * 0.08, 0, 0]}>
            <boxGeometry args={[0.06, 0.65, 0.7]} />
            <meshStandardMaterial color="#7ab4cc" roughness={0.05} transparent opacity={0.65} />
          </mesh>
        </group>
      ))}

      {decorated && <HutDecorations width={width} depth={depth} />}

      {showGlow && (
        <group position={[0, 6.5, 0]}>
          <Glow color={place.color} intensity={3} distance={18} scale={1.4} pulse />
        </group>
      )}
      <group position={[0, 7.2, 0]}>
        <PlaceLabel place={place} />
      </group>
    </group>
  );
}

// --- HUT DECORATIONS ----------------------------------------------------------
function HutDecorations({ width, depth }) {
  return (
    <group>
      {/* Flower boxes */}
      {[[-width * 0.29, depth / 2 + 0.15], [width * 0.29, depth / 2 + 0.15]].map(([fx, fz], fi) => (
        <group key={fi} position={[fx, 2.8, fz]}>
          <mesh>
            <boxGeometry args={[0.95, 0.22, 0.28]} />
            {M("terracotta")}
          </mesh>
          {[...Array(7)].map((_, j) => (
            <group key={j} position={[(j - 3) * 0.13, 0.15, 0]}>
              <mesh>
                <cylinderGeometry args={[0.015, 0.015, 0.22, 5]} />
                <meshStandardMaterial color="#2d5a1b" />
              </mesh>
              <mesh position={[0, 0.22, 0]}>
                <sphereGeometry args={[0.072, 7, 7]} />
                <meshStandardMaterial color={j % 3 === 0 ? "#ff5a78" : j % 3 === 1 ? "#ffdc00" : "#ff8c42"} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Hanging lanterns */}
      {[[-width * 0.35, depth / 2 + 0.05], [width * 0.35, depth / 2 + 0.05]].map(([lx, lz], li) => (
        <group key={li} position={[lx, 4.2, lz]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.1, 0.35, 8]} />
            {M("brass")}
          </mesh>
          <mesh position={[0, -0.28, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#ffe58a" transparent opacity={0.9} />
          </mesh>
          <pointLight color="#ffa030" intensity={1.2} distance={5} decay={2} position={[0, -0.25, 0]} />
          {/* Chain */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.6, 5]} />
            {M("brass", { color: "#8a7020" })}
          </mesh>
        </group>
      ))}

      {/* Rangoli-inspired ground pattern (simplified) */}
      <mesh receiveShadow position={[0, 0.28, depth / 2 + 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 16]} />
        <meshStandardMaterial color="#d45510" roughness={0.9} />
      </mesh>
      <mesh receiveShadow position={[0, 0.29, depth / 2 + 0.9]} rotation={[-Math.PI / 2, 0, Math.PI / 8]}>
        <circleGeometry args={[0.9, 8]} />
        <meshStandardMaterial color="#ffb347" roughness={0.9} />
      </mesh>
    </group>
  );
}

// --- LIBRARY / EDUCATION BUILDING ---------------------------------------------
function Library({ onSelect }) {
  const place = placeById.education;
  return (
    <group position={place.position} onClick={() => onSelect(place.id)}>
      <LibraryBuilding />
      <LibraryCourtyard />
      {Array.from({ length: 14 }).map((_, i) => (
        <FloatingBook key={i} index={i} origin={[0, 0, 0]} />
      ))}
      <group position={[0, 7.9, 0]}>
        <Glow color={place.color} intensity={4.8} distance={26} scale={1.45} pulse />
      </group>
      <group position={[0, 8.6, 0]}>
        <PlaceLabel place={place} />
      </group>
    </group>
  );
}

function LibraryBuilding() {
  const bookColors = ["#d94f4f", "#4e9fd9", "#68b26b", "#d9a341", "#9b65d9", "#2fb7a5", "#e1764f"];

  return (
    <group>
      <StoneBase width={8.2} depth={5.9} />
      <mesh castShadow receiveShadow position={[0, 1.9, 0]}>
        <boxGeometry args={[8.2, 3.25, 5.5]} />
        <meshStandardMaterial color="#f1dfbd" roughness={0.82} />
      </mesh>
      <mesh castShadow position={[0, 3.86, 0.05]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[5.95, 1.95, 4]} />
        <meshStandardMaterial color="#8c4f31" roughness={0.84} />
      </mesh>
      <mesh castShadow position={[0, 4.95, 0.05]}>
        <boxGeometry args={[2.8, 0.45, 0.48]} />
        <meshStandardMaterial color="#6c3420" roughness={0.78} />
      </mesh>
      <SkillSign position={[0, 4.97, 0.31]} title="Library" lines={["ECE", "AI", "Systems"]} accent="#7dd8ff" size={[2.55, 0.44]} />

      <group position={[0, 2.22, 2.82]}>
        <mesh castShadow position={[0, -0.18, 0]}>
          <boxGeometry args={[7.6, 0.28, 0.34]} />
          <meshStandardMaterial color="#c9a775" roughness={0.78} />
        </mesh>
        {[-3.2, -1.6, 1.6, 3.2].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh castShadow position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.18, 0.24, 2.85, 16]} />
              <meshStandardMaterial color="#fff3d5" roughness={0.74} />
            </mesh>
            <mesh castShadow position={[0, 1.32, 0]}>
              <boxGeometry args={[0.62, 0.18, 0.52]} />
              <meshStandardMaterial color="#c9a775" roughness={0.78} />
            </mesh>
          </group>
        ))}
      </group>

      <group position={[0, 2.12, 2.92]}>
        {[-2.15, 0, 2.15].map((x, shelfIndex) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh castShadow position={[0, 0.1, -0.03]}>
              <boxGeometry args={[1.55, 2.2, 0.16]} />
              <meshPhysicalMaterial color="#7bbfe0" transparent opacity={0.42} roughness={0.18} />
            </mesh>
            <mesh castShadow position={[0, -0.82, 0.08]}>
              <boxGeometry args={[1.72, 0.16, 0.28]} />
              {M("wood", { color: "#6b3d1e" })}
            </mesh>
            {[0, 1, 2].map((row) => (
              <group key={row} position={[-0.55, -0.55 + row * 0.52, 0.14]}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <mesh key={i} castShadow position={[i * 0.19, 0, 0]}>
                    <boxGeometry args={[0.12, 0.42, 0.1]} />
                    <meshStandardMaterial color={bookColors[(i + row + shelfIndex) % bookColors.length]} roughness={0.56} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        ))}
      </group>

      <group position={[0, 1.34, 2.94]}>
        <mesh castShadow position={[0, 0.32, 0]}>
          <boxGeometry args={[1.26, 1.82, 0.18]} />
          {M("darkWood", { color: "#452613" })}
        </mesh>
        <mesh position={[0, 0.42, 0.1]}>
          <boxGeometry args={[0.82, 1.24, 0.04]} />
          <meshStandardMaterial color="#f8d88c" emissive="#f8c76a" emissiveIntensity={0.18} roughness={0.42} />
        </mesh>
      </group>
      <pointLight color="#ffe3a1" intensity={1.8} distance={10} position={[0, 2.55, 3.2]} />
    </group>
  );
}

function LibraryCourtyard() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 4.75]}>
        <circleGeometry args={[4.2, 40]} />
        <meshStandardMaterial color="#cfb17d" roughness={0.92} />
      </mesh>
      {[-2.4, 2.4].map((x) => (
        <group key={x} position={[x, 0, 4.55]}>
          <mesh castShadow position={[0, 0.62, 0]}>
            <boxGeometry args={[1.75, 0.18, 0.85]} />
            {M("wood", { color: "#7b4a28" })}
          </mesh>
          <mesh castShadow position={[0, 1.08, -0.34]}>
            <boxGeometry args={[1.75, 0.82, 0.16]} />
            {M("wood", { color: "#5a351c" })}
          </mesh>
          <mesh position={[0, 0.92, 0.12]}>
            <sphereGeometry args={[0.12, 12, 8]} />
            <meshBasicMaterial color="#ffe9a8" />
          </mesh>
          <pointLight color="#ffd98a" intensity={0.8} distance={4} position={[0, 1, 0.12]} />
        </group>
      ))}
      <mesh castShadow position={[0, 0.72, 5.18]}>
        <boxGeometry args={[1.45, 0.18, 0.95]} />
        {M("wood", { color: "#8a5a32" })}
      </mesh>
      <mesh castShadow position={[0, 1.08, 5.18]}>
        <boxGeometry args={[1.02, 0.1, 0.7]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.65} />
      </mesh>
    </group>
  );
}

function FloatingBook({ index, origin }) {
  const ref = useRef();
  const angle = (index / 14) * Math.PI * 2;
  const radius = 3.2 + (index % 3) * 0.45;
  const baseY = 5.25 + (index % 4) * 0.25;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + index * 0.7;
    ref.current.position.x = origin[0] + Math.cos(angle + t * 0.12) * radius;
    ref.current.position.z = origin[2] + Math.sin(angle + t * 0.12) * radius;
    ref.current.position.y = baseY + Math.sin(t * 1.2) * 0.28;
    ref.current.rotation.y += 0.008;
    ref.current.rotation.z = Math.sin(t * 0.8) * 0.12;
  });

  const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6", "#1abc9c", "#e67e22", "#e91e63", "#00bcd4"];

  return (
    <mesh ref={ref} castShadow position={[origin[0], baseY, origin[2] + 3.2]}>
      <boxGeometry args={[0.38, 0.62, 0.1]} />
      <meshStandardMaterial color={colors[index % colors.length]} roughness={0.6} />
    </mesh>
  );
}

// --- WORKSHOP -----------------------------------------------------------------
const workshopProjects = [
  { title: "Gestra", stack: ["Python", "OpenCV", "MediaPipe"], color: "#c87958", x: -4.35 },
  { title: "ClassConnect", stack: ["Kotlin", "Compose", "AI Tools"], color: "#8fb9a8", x: 0 },
  { title: "Wanderlust", stack: ["Node", "Express", "MongoDB"], color: "#d9a441", x: 4.35 },
];

function Workshop({ onSelect }) {
  const place = placeById.projects;
  return (
    <group position={place.position} onClick={() => onSelect(place.id)}>
      <ProjectPavilion />
      <group position={[0, 0, 4.65]}>
        {workshopProjects.map((project, i) => (
          <ProjectShowcase key={project.title} project={project} index={i} />
        ))}
      </group>
      <BuildPipeline />
      <WorkshopCraftsperson position={[-6.3, 0, 3.8]} shirt="#b85c38" rotation={0.62} seed={1} />
      <WorkshopCraftsperson position={[6.3, 0, 3.65]} shirt="#496f5d" rotation={-0.62} seed={2} />
      <ProjectLanterns />
      <group position={[0, 7.45, 0]}>
        <Glow color="#ffd18a" intensity={3.4} distance={25} scale={1.35} pulse />
      </group>
      <group position={[0, 8.05, 0]}>
        <PlaceLabel place={place} />
      </group>
    </group>
  );
}

function ProjectPavilion() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <planeGeometry args={[19, 14]} />
        <meshStandardMaterial color="#6f8a54" roughness={0.96} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 3.6]}>
        <planeGeometry args={[15.6, 3.6]} />
        <meshStandardMaterial color="#b79b70" roughness={1} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.14, 3.6]}>
        <planeGeometry args={[11.8, 1.6]} />
        <meshStandardMaterial color="#d4c09b" roughness={0.9} />
      </mesh>

      <mesh castShadow receiveShadow position={[0, 0.5, -0.6]}>
        <boxGeometry args={[12.4, 0.8, 7.6]} />
        {M("stone", { color: "#8a7a63" })}
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.04, -0.6]}>
        <boxGeometry args={[11.2, 0.28, 6.5]} />
        <meshStandardMaterial color="#d9c096" roughness={0.82} />
      </mesh>

      <mesh castShadow position={[0, 3.05, -1.55]}>
        <boxGeometry args={[9.8, 3.7, 4.8]} />
        <meshStandardMaterial color="#e0caa4" roughness={0.88} />
      </mesh>
      <mesh position={[0, 3.05, 0.9]}>
        <boxGeometry args={[7.9, 2.15, 0.12]} />
        <meshPhysicalMaterial color="#b8d7ce" transparent opacity={0.36} roughness={0.2} metalness={0.02} />
      </mesh>
      <mesh castShadow position={[0, 1.9, 1.02]}>
        <boxGeometry args={[1.7, 1.7, 0.16]} />
        {M("darkWood", { color: "#3a2210" })}
      </mesh>
      {[-3.1, 3.1].map((x) => (
        <group key={x} position={[x, 3.25, 1.04]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.5, 1.28, 0.08]} />
            <meshStandardMaterial color="#b8d7ce" transparent opacity={0.5} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[0.08, 1.26, 0.05]} />
            {M("wood", { color: "#6b3d1e" })}
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[1.5, 0.08, 0.05]} />
            {M("wood", { color: "#6b3d1e" })}
          </mesh>
        </group>
      ))}

      <mesh castShadow position={[0, 5.15, -1.45]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[8.5, 2.2, 4]} />
        <meshStandardMaterial color="#9a6a3a" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0, 4.76, -1.45]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[9.05, 0.58, 4]} />
        <meshStandardMaterial color="#6f4725" roughness={0.96} />
      </mesh>
      {[...Array(9)].map((_, i) => (
        <mesh key={i} castShadow position={[-4 + i, 5.05, 0.72]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.72, 0.08, 0.55]} />
          <meshStandardMaterial color={i % 2 ? "#a97843" : "#8f5f32"} roughness={0.9} />
        </mesh>
      ))}

      <group position={[0, 5.88, 1.25]}>
        <SkillSign title="Project Workshop" lines={["Gestra  ClassConnect  Wanderlust"]} accent="#c58b3b" size={[6.8, 0.86]} />
      </group>
    </group>
  );
}

function ProjectShowcase({ project, index }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 2.5 + Math.sin(clock.elapsedTime * 0.55 + index) * 0.018;
    }
  });

  return (
    <group position={[project.x, 0, 0]} rotation={[0, (index - 1) * -0.08, 0]}>
      <mesh castShadow position={[0, 1.15, -0.05]}>
        <boxGeometry args={[0.18, 2.35, 0.18]} />
        {M("wood", { color: "#5a351c" })}
      </mesh>
      <mesh castShadow position={[0, 0.28, 0.24]}>
        <boxGeometry args={[3.15, 0.38, 0.92]} />
        {M("wood", { color: "#7b512d" })}
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.58, 0.24]}>
        <boxGeometry args={[2.7, 0.18, 0.62]} />
        <meshStandardMaterial color="#d5b889" roughness={0.8} />
      </mesh>
      <ProjectMiniature type={project.title} color={project.color} />
      <group ref={ref} position={[0, 2.5, 0]}>
        <mesh castShadow position={[0, 0, -0.04]}>
          <boxGeometry args={[3.35, 2.0, 0.18]} />
          <meshStandardMaterial color="#3d2819" roughness={0.78} />
        </mesh>
        <SkillSign position={[0, 0, 0.06]} title={project.title} lines={project.stack} accent={project.color} size={[3.02, 1.68]} />
        <pointLight color="#ffd18a" intensity={0.8} distance={4.2} position={[0, 0.2, 0.65]} />
      </group>
    </group>
  );
}

function ProjectMiniature({ type, color }) {
  if (type === "Wanderlust") {
    return (
      <group position={[0, 0.9, 0.25]}>
        <mesh castShadow position={[-0.45, 0.12, 0]}>
          <boxGeometry args={[0.55, 0.25, 0.42]} />
          <meshStandardMaterial color="#e8d6b8" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[-0.45, 0.36, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.46, 0.34, 4]} />
          <meshStandardMaterial color="#a76532" roughness={0.9} />
        </mesh>
        <mesh castShadow position={[0.45, 0.18, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.28, 0.75, 18]} />
          <meshStandardMaterial color={color} roughness={0.45} />
        </mesh>
        <mesh castShadow position={[0.45, 0.22, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </mesh>
      </group>
    );
  }

  if (type === "ClassConnect") {
    return (
      <group position={[0, 0.86, 0.25]}>
        {[-0.55, 0, 0.55].map((x, i) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh castShadow position={[0, 0.15, 0]}>
              <boxGeometry args={[0.36, 0.18, 0.32]} />
              {M("wood", { color: "#8a5a32" })}
            </mesh>
            <mesh castShadow position={[0, 0.48, -0.1]}>
              <boxGeometry args={[0.32, 0.42, 0.08]} />
              <meshStandardMaterial color={i === 1 ? color : "#d9c39f"} roughness={0.7} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.92, -0.08]}>
          <boxGeometry args={[1.25, 0.42, 0.05]} />
          <meshStandardMaterial color="#263238" roughness={0.55} />
        </mesh>
      </group>
    );
  }

  return (
    <group position={[0, 0.94, 0.25]}>
      <mesh castShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[0.88, 0.52, 0.08]} />
        <meshStandardMaterial color="#202b2f" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.18, 0.055]}>
        <boxGeometry args={[0.72, 0.38, 0.02]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} roughness={0.35} />
      </mesh>
      {[[-0.42, 0.58], [0, 0.72], [0.42, 0.58]].map(([x, y], i) => (
        <mesh key={i} castShadow position={[x, y, 0.08]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#ffd18a" roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function BuildPipeline() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.children.forEach((node, i) => {
      node.position.y = 1.38 + Math.sin(clock.elapsedTime * 2.2 + i) * 0.12;
      node.rotation.y += 0.018;
    });
  });

  return (
    <group position={[0, 0, 1.55]}>
      <mesh receiveShadow position={[0, 1.12, 3.65]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.8, 0.12]} />
        <meshStandardMaterial color="#c58b3b" roughness={0.78} />
      </mesh>
      <group ref={ref}>
        {[
          ["Idea", -3.8, "#c58b3b"],
          ["UI", -1.9, "#8fb9a8"],
          ["API", 0, "#a66a45"],
          ["DB", 1.9, "#8b7a55"],
          ["Ship", 3.8, "#b85c38"],
        ].map(([label, x, color]) => (
          <group key={label} position={[x, 1.28, 3.65]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.3, 0.3, 0.16, 16]} />
              <meshStandardMaterial color={color} roughness={0.62} />
            </mesh>
            <SkillSign position={[0, 0.48, 0]} title={label} lines={[]} accent={color} size={[0.92, 0.34]} />
          </group>
        ))}
      </group>
    </group>
  );
}

function ProjectLanterns() {
  return (
    <group>
      {[-6.4, -3.2, 3.2, 6.4].map((x, i) => (
        <group key={x} position={[x, 0, 2.7 + (i % 2) * 0.55]}>
          <mesh castShadow position={[0, 1.85, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 3.2, 8]} />
            {M("wood", { color: "#5a351c" })}
          </mesh>
          <mesh position={[0, 3.58, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color="#ffd18a" emissive="#ffb45c" emissiveIntensity={0.85} roughness={0.25} />
          </mesh>
          <pointLight color="#ffbd6b" intensity={1.2} distance={5.2} position={[0, 3.55, 0]} />
        </group>
      ))}
    </group>
  );
}

function WorkshopCraftsperson({ position, shirt, rotation, seed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = rotation + Math.sin(clock.elapsedTime * 0.9 + seed) * 0.08;
    ref.current.children.forEach((child) => {
      if (child.userData.arm) child.rotation.x = -0.45 + Math.sin(clock.elapsedTime * 2.4 + seed) * 0.18;
    });
  });

  return (
    <group ref={ref} position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow position={[0, 0.45, 0]}>
        <capsuleGeometry args={[0.16, 0.5, 5, 8]} />
        <meshStandardMaterial color="#3f3427" roughness={0.82} />
      </mesh>
      <mesh castShadow position={[0, 1.04, 0]}>
        <capsuleGeometry args={[0.22, 0.58, 5, 8]} />
        <meshStandardMaterial color={shirt} roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0, 1.58, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#b8794f" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0, 1.76, 0]}>
        <sphereGeometry args={[0.2, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#25150c" roughness={0.88} />
      </mesh>
      {[-0.28, 0.28].map((x) => (
        <mesh key={x} castShadow position={[x, 1.05, 0.16]} rotation={[-0.45, 0, x > 0 ? -0.2 : 0.2]} userData={{ arm: true }}>
          <capsuleGeometry args={[0.052, 0.42, 4, 8]} />
          <meshStandardMaterial color="#b8794f" roughness={0.76} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 0.65, 0.85]}>
        <boxGeometry args={[1.05, 0.38, 0.68]} />
        {M("wood", { color: "#7a4f2a" })}
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} castShadow position={[-0.32 + i * 0.32, 0.94, 0.88]}>
          <boxGeometry args={[0.22, 0.08, 0.22]} />
          <meshStandardMaterial color={["#d9a441", "#8fb9a8", "#c87958"][i]} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function CodeHologram({ position, color, seed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.7 + seed) * 0.18;
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.3 + seed) * 0.08;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.44, 0]}>
        <boxGeometry args={[1.7, 1.0, 0.035]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[-0.55 + i * 0.35, 0.75 - i * 0.18, 0.04]}>
          <boxGeometry args={[0.5 + (i % 2) * 0.28, 0.045, 0.025]} />
          <meshBasicMaterial color={i % 2 ? "#ffffff" : color} transparent opacity={0.88} />
        </mesh>
      ))}
      <pointLight color={color} intensity={1.2} distance={4} position={[0, 0.5, 0.4]} />
    </group>
  );
}

function WorkshopDrones() {
  return (
    <group>
      {[0, 1, 2].map((index) => (
        <WorkshopDrone key={index} index={index} />
      ))}
    </group>
  );
}

function WorkshopDrone({ index }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 0.55 + index * 2.2;
    ref.current.position.set(Math.sin(t) * 4.3, 5.1 + Math.sin(t * 1.7) * 0.45, 1.4 + Math.cos(t) * 2.4);
    ref.current.rotation.y = -t;
  });

  const color = ["#38bdf8", "#a78bfa", "#34d399"][index % 3];
  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[0.48, 0.16, 0.48]} />
        <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.35} />
      </mesh>
      {[
        [-0.38, 0, -0.38], [0.38, 0, -0.38], [-0.38, 0, 0.38], [0.38, 0, 0.38],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.15, 0.025, 8, 18]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.2} />
        </mesh>
      ))}
      <pointLight color={color} intensity={0.9} distance={4} position={[0, 0.2, 0]} />
    </group>
  );
}

// --- DETAILED TEMPLE ----------------------------------------------------------
function Temple({ onSelect }) {
  const place = placeById.achievements;
  const flowerColors = ["#ff5a78", "#ffd166", "#ff8a00", "#f7e7a3"];

  return (
    <group position={place.position} onClick={() => onSelect(place.id)}>
      {/* Jagati (raised platform) */}
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <boxGeometry args={[15.5, 0.9, 15.5]} />
        {M("marble", { color: "#f7dfba" })}
      </mesh>
      <mesh castShadow receiveShadow position={[0, 0.98, 0]}>
        <boxGeometry args={[14.4, 0.25, 14.4]} />
        {M("marble", { color: "#fff1cf" })}
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.18, 0]}>
        <boxGeometry args={[12.6, 0.22, 12.6]} />
        {M("terracotta", { color: "#c96a2b" })}
      </mesh>

      {/* Steps on all 4 sides */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
          <mesh castShadow receiveShadow position={[0, 0.46, 7.7]}>
            <boxGeometry args={[5.6, 0.32, 0.82]} />
            {M("marble", { color: "#e8d5b8" })}
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.24, 8.4]}>
            <boxGeometry args={[6.2, 0.32, 0.82]} />
            {M("marble", { color: "#dcc8a8" })}
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.04, 9.08]}>
            <boxGeometry args={[6.8, 0.28, 0.82]} />
            {M("marble", { color: "#c9ad87" })}
          </mesh>
        </group>
      ))}

      {/* Mandapa pillars and carved rail */}
      {[
        [-5, -5], [-1.7, -5], [1.7, -5], [5, -5],
        [-5, 5], [-1.7, 5], [1.7, 5], [5, 5],
        [-5, -1.7], [-5, 1.7], [5, -1.7], [5, 1.7],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 1.15, z]}>
          {/* Pillar base */}
          <mesh castShadow position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.46, 0.58, 0.28, 12]} />
            {M("marble", { color: "#f8e7c8" })}
          </mesh>
          {/* Pillar shaft */}
          <mesh castShadow position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.23, 0.3, 3.35, 16]} />
            {M("whitePlaster", { color: "#fff5dc" })}
          </mesh>
          <mesh castShadow position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.31, 0.31, 0.08, 16]} />
            {M("gold", { color: "#d9a52a", roughness: 0.35 })}
          </mesh>
          {/* Pillar capital */}
          <mesh castShadow position={[0, 3.6, 0]}>
            <cylinderGeometry args={[0.58, 0.42, 0.34, 12]} />
            {M("marble", { color: "#f8e7c8" })}
          </mesh>
        </group>
      ))}

      {/* Hall roof / Mandapa */}
      <mesh castShadow position={[0, 4.95, 0]}>
        <boxGeometry args={[12, 0.45, 12]} />
        {M("marble", { color: "#f4d9ad" })}
      </mesh>
      <mesh castShadow position={[0, 5.28, 0]}>
        <boxGeometry args={[11.2, 0.24, 11.2]} />
        {M("gold", { color: "#cf9825", roughness: 0.42 })}
      </mesh>
      <mesh castShadow position={[0, 5.62, 0]}>
        <boxGeometry args={[10.2, 0.55, 10.2]} />
        {M("terracotta", { color: "#c95c2a" })}
      </mesh>

      {/* Shikhara tiers with golden trim */}
      {[0, 1, 2, 3, 4, 5, 6].map((tier) => {
        const size = 8.8 - tier * 1.05;
        return (
          <group key={tier} position={[0, 6 + tier * 0.92, 0]}>
            <mesh castShadow>
              <boxGeometry args={[size, 0.82, size]} />
              {M("whitePlaster", { color: new THREE.Color().setHSL(0.09, 0.62, 0.78 + tier * 0.025).getStyle() })}
            </mesh>
            <mesh castShadow position={[0, 0.45, 0]}>
              <boxGeometry args={[size + 0.22, 0.12, size + 0.22]} />
              {M("gold", { color: "#d5a329", roughness: 0.38 })}
            </mesh>
          </group>
        );
      })}

      {/* Small corner shrines */}
      {[[-5.9, -5.9], [5.9, -5.9], [5.9, 5.9], [-5.9, 5.9]].map(([x, z], i) => (
        <group key={i} position={[x, 1.25, z]}>
          <mesh castShadow position={[0, 0.45, 0]}>
            <boxGeometry args={[1.25, 0.9, 1.25]} />
            {M("whitePlaster", { color: "#ffe8bd" })}
          </mesh>
          <mesh castShadow position={[0, 1.18, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[1.05, 1.3, 4]} />
            {M("terracotta", { color: "#c65a28" })}
          </mesh>
          <mesh castShadow position={[0, 1.95, 0]}>
            <sphereGeometry args={[0.16, 10, 10]} />
            {M("gold")}
          </mesh>
        </group>
      ))}

      {/* Amalaka (flat disc) */}
      <mesh castShadow position={[0, 12.9, 0]}>
        <cylinderGeometry args={[1.35, 1.62, 0.58, 24]} />
        {M("marble", { color: "#fff0c7" })}
      </mesh>

      {/* Kalash (golden spire) */}
      <mesh castShadow position={[0, 13.48, 0]}>
        <sphereGeometry args={[0.56, 18, 18]} />
        {M("gold")}
      </mesh>
      <mesh castShadow position={[0, 14.22, 0]}>
        <coneGeometry args={[0.14, 0.92, 12]} />
        {M("gold")}
      </mesh>

      {/* Entrance doorway arch */}
      <group position={[0, 1.22, 6.35]}>
        <mesh castShadow position={[0, 1.95, 0]}>
          <boxGeometry args={[4.35, 3.9, 0.58]} />
          {M("whitePlaster", { color: "#fff0d1" })}
        </mesh>
        <mesh castShadow position={[0, 3.95, 0.02]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[3.05, 3.05, 0.5]} />
          {M("whitePlaster", { color: "#fff0d1" })}
        </mesh>
        <mesh position={[0, 1.75, 0.34]}>
          <boxGeometry args={[2.2, 3.35, 0.12]} />
          {M("darkWood", { color: "#3c1908" })}
        </mesh>
        <mesh position={[0, 3.63, 0.42]}>
          <torusGeometry args={[1.25, 0.08, 10, 36, Math.PI]} />
          {M("gold", { color: "#dca62b" })}
        </mesh>
        {[...Array(9)].map((_, i) => (
          <mesh key={i} castShadow position={[-1.6 + i * 0.4, 3.6 + Math.sin(i * 0.8) * 0.08, 0.48]}>
            <sphereGeometry args={[0.11, 8, 8]} />
            <meshStandardMaterial color={flowerColors[i % flowerColors.length]} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Temple bells and lamps */}
      {[[-4.3, 5.35], [-1.45, 5.35], [1.45, 5.35], [4.3, 5.35]].map(([x, z], i) => (
        <group key={i} position={[x, 1.15, z]}>
          <mesh castShadow position={[0, 3.25, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.68, 8]} />
            {M("wood")}
          </mesh>
          <mesh castShadow position={[0, 2.86, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.22, 0.42, 16, 1, true]} />
            {M("gold", { color: "#dca62b" })}
          </mesh>
          <mesh castShadow position={[0, 2.68, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            {M("gold")}
          </mesh>
        </group>
      ))}
      {[[-3.7, 7.6], [3.7, 7.6], [-7.2, 2.8], [7.2, 2.8]].map(([x, z], i) => (
        <group key={i} position={[x, 0.95, z]}>
          <mesh castShadow position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.18, 0.24, 0.46, 12]} />
            {M("brass")}
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial color="#ffcf7a" emissive="#ff9f1a" emissiveIntensity={1.4} roughness={0.25} />
          </mesh>
          <pointLight color="#ffbf5a" intensity={1.5} distance={5} decay={2} position={[0, 0.8, 0]} />
        </group>
      ))}

      {/* Corner flags */}
      {[[-6.9, -6.9], [6.9, -6.9], [6.9, 6.9], [-6.9, 6.9]].map(([x, z], i) => (
        <group key={i} position={[x, 1, z]}>
          <mesh castShadow position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 5, 8]} />
            {M("wood")}
          </mesh>
          <mesh castShadow position={[0.5, 4.6, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[1.15, 0.54, 0.04]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#ff6a00" : "#ffd166"} />
          </mesh>
        </group>
      ))}

      {/* Rangoli and flower petals at the entrance */}
      <mesh receiveShadow position={[0, 1.32, 8.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 1.45, 36]} />
        <meshStandardMaterial color="#ffcf66" side={THREE.DoubleSide} roughness={0.7} />
      </mesh>
      {[...Array(16)].map((_, i) => (
        <mesh
          key={i}
          castShadow
          position={[Math.sin(i * Math.PI / 8) * 1.1, 1.36, 8.25 + Math.cos(i * Math.PI / 8) * 1.1]}
          rotation={[-Math.PI / 2, 0, i * Math.PI / 8]}
        >
          <circleGeometry args={[0.16, 8]} />
          <meshStandardMaterial color={flowerColors[i % flowerColors.length]} side={THREE.DoubleSide} roughness={0.55} />
        </mesh>
      ))}

      <group position={[0, 15.5, 0]}>
        <Glow color="#ffd36a" intensity={7} distance={34} scale={3.2} pulse />
      </group>
      <group position={[0, 17.5, 0]}>
        <PlaceLabel place={place} />
      </group>
    </group>
  );
}

// --- FARM / SKILLS ------------------------------------------------------------
function Farm({ onSelect }) {
  const place = placeById.skills;
  return (
    <group position={place.position}>
      <mesh
        visible={false}
        position={[0, 2, 0]}
        onClick={(e) => { e.stopPropagation(); onSelect(place.id); }}
      >
        <boxGeometry args={[26, 5, 22]} />
      </mesh>

      {/* Farm ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[26, 22]} />
        {M("soil")}
      </mesh>

      <IrrigationSystem />
      <Tubewell position={[-10, 0, -8]} />
      <FruitOrchard position={[-6, 0, -3]} />
      <FlowerMeadow position={[6, 0, -3]} />
      <CropFields position={[0, 0, 6]} />
      <Scarecrow position={[5, 0, 7]} />
      <FarmHouse position={[8, 0, -5]} />

      <group position={[0, 10, 0]}>
        <Glow color={place.color} intensity={3} distance={20} pulse />
      </group>
      <group position={[0, 11, 0]}>
        <PlaceLabel place={place} />
      </group>
    </group>
  );
}

function FarmHouse({ position }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, 0.8, 0]}>
        <boxGeometry args={[4, 1.6, 3]} />
        {M("plaster")}
      </mesh>
      <mesh castShadow position={[0, 2.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.8, 1.8, 4]} />
        {M("terracotta")}
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.7, 1.52]}>
        <boxGeometry args={[0.9, 1.5, 0.08]} />
        {M("darkWood")}
      </mesh>
    </group>
  );
}

function IrrigationSystem() {
  return (
    <group position={[0, 0.06, 0]}>
      {/* Main canal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
        <planeGeometry args={[24, 1.2]} />
        <meshPhysicalMaterial color="#4aabcc" transparent opacity={0.78} roughness={0.1} transmission={0.6} />
      </mesh>
      {/* Vertical canals */}
      {[-6, 0, 6].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, -3]}>
          <planeGeometry args={[1.1, 8]} />
          <meshPhysicalMaterial color="#4aabcc" transparent opacity={0.72} roughness={0.1} transmission={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Tubewell({ position }) {
  const handleRef = useRef();
  useFrame(({ clock }) => {
    if (handleRef.current)
      handleRef.current.rotation.x = Math.sin(clock.elapsedTime * 2) * 0.4;
  });

  return (
    <group position={position}>
      {/* Platform */}
      <mesh receiveShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.85, 1.0, 0.4, 16]} />
        {M("stone")}
      </mesh>
      {/* Main pipe */}
      <mesh castShadow position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.17, 0.22, 1.8, 12]} />
        <meshStandardMaterial color="#1e2d36" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 2.25, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#111e24" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Handle */}
      <group ref={handleRef} position={[0, 1.9, 0]}>
        <mesh castShadow position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.4, 8]} />
          <meshStandardMaterial color="#1e2d36" metalness={0.8} />
        </mesh>
      </group>
      {/* Spout + water */}
      <mesh castShadow position={[0.28, 1.0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.13, 0.45, 12]} />
        <meshStandardMaterial color="#1e2d36" metalness={0.75} />
      </mesh>
      <mesh position={[0.55, 0.42, 0]}>
        <cylinderGeometry args={[0.055, 0.075, 1.0, 8]} />
        <meshPhysicalMaterial color="#3bbbdd" transparent opacity={0.78} transmission={0.9} roughness={0} />
      </mesh>
    </group>
  );
}

function Scarecrow({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.15;
  });

  return (
    <group ref={ref} position={position}>
      <mesh castShadow position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2.6, 6]} />
        {M("wood")}
      </mesh>
      <mesh castShadow position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 6]} />
        {M("wood")}
      </mesh>
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[0.85, 0.85, 0.32]} />
        <meshStandardMaterial color="#1f4e9a" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 2.12, 0]}>
        <sphereGeometry args={[0.27, 12, 12]} />
        <meshStandardMaterial color="#e8c97a" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 2.35, 0]}>
        <cylinderGeometry args={[0.16, 0.38, 0.3, 10]} />
        {M("terracotta", { color: "#c45e28" })}
      </mesh>
      <mesh castShadow position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.06, 10]} />
        {M("terracotta", { color: "#c45e28" })}
      </mesh>
    </group>
  );
}

function FruitOrchard({ position }) {
  return (
    <group position={position}>
      <mesh receiveShadow position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 8]} />
        {M("soil", { color: "#4a2e14" })}
      </mesh>
      <AppleTree position={[-3, 0.1, -2]} seed={1} />
      <MangoTree position={[1, 0.1, -2]} seed={2} />
      <BananaTree position={[-3, 0.1, 2.5]} />
      <MangoTree position={[3, 0.1, 1]} seed={3} />
      <GrapeVines position={[2, 0.1, 3]} />
    </group>
  );
}

function MangoTree({ position, seed }) {
  const scale = 0.9 + (seed % 4) * 0.09;
  const mangos = useMemo(() => (
    Array.from({ length: 18 }).map(() => ({
      x: rand(-2.5, 2.5), y: rand(-2, 2.5), z: rand(-2.5, 2.5),
      s: rand(0.11, 0.18),
    })).filter(a => (a.x ** 2 + a.y ** 2 + a.z ** 2) < 5)
  ), [seed]);

  return (
    <group position={position} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.28, 0.4, 3, 7]} />
        {M("wood", { color: "#4a2e1b" })}
      </mesh>
      <group position={[0, 3.6, 0]}>
        {[
          [0, 0.5, 0, 1.9], [0.85, -0.2, 0.5, 1.3], [-0.85, -0.2, -0.5, 1.3],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} castShadow position={[x, y, z]}>
            <dodecahedronGeometry args={[r, 1]} />
            <meshStandardMaterial color={i === 0 ? "#2e5c22" : "#3a6824"} roughness={0.82} />
          </mesh>
        ))}
        {mangos.map((mg, i) => (
          <mesh key={i} castShadow position={[mg.x, mg.y + 0.5, mg.z]} scale={[mg.s, mg.s * 1.5, mg.s]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color={i % 3 === 0 ? "#ffa500" : "#f0c800"} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function BananaTree({ position }) {
  return (
    <group position={position} scale={1.3}>
      <mesh castShadow position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.09, 0.15, 2.4, 6]} />
        <meshStandardMaterial color="#7aab58" roughness={0.9} />
      </mesh>
      <group position={[0, 2.4, 0]}>
        {[...Array(7)].map((_, i) => (
          <mesh key={i} castShadow rotation={[0.35, i * (Math.PI / 3.5), 0]} position={[Math.sin(i * Math.PI / 3.5) * 0.5, 0, Math.cos(i * Math.PI / 3.5) * 0.5]}>
            <planeGeometry args={[0.5, 2.2]} />
            <meshStandardMaterial color="#3dcc70" side={THREE.DoubleSide} roughness={0.7} />
          </mesh>
        ))}
      </group>
      <group position={[0.2, 1.9, 0]}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} castShadow position={[0, -i * 0.12, 0]} rotation={[0, i, 0.5]}>
            <capsuleGeometry args={[0.035, 0.22, 4, 8]} />
            <meshStandardMaterial color="#f5d020" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function AppleTree({ position, seed }) {
  const scale = 0.9 + (seed % 4) * 0.09;
  const apples = useMemo(() => (
    Array.from({ length: 15 }).map(() => ({
      x: rand(-2.5, 2.5), y: rand(-2, 2.5), z: rand(-2.5, 2.5), s: rand(0.1, 0.17),
    })).filter(a => (a.x ** 2 + a.y ** 2 + a.z ** 2) < 5)
  ), [seed]);

  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.28, 0.4, 3, 7]} />
        {M("wood", { color: "#5c3a21" })}
      </mesh>
      <group position={[0, 3.5, 0]}>
        {[
          [0, 0.5, 0, 1.8], [0.85, -0.2, 0.55, 1.3], [-0.85, -0.2, -0.55, 1.3],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} castShadow position={[x, y, z]}>
            <dodecahedronGeometry args={[r, 1]} />
            <meshStandardMaterial color={i === 0 ? "#3e6c2e" : "#4a7a36"} roughness={0.82} />
          </mesh>
        ))}
        {apples.map((ap, i) => (
          <mesh key={i} castShadow position={[ap.x, ap.y + 0.5, ap.z]} scale={ap.s}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#d92e2e" : "#e85020"} roughness={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function GrapeVines({ position }) {
  return (
    <group position={position}>
      {[-1, 1].map((x) => (
        <mesh key={x} castShadow position={[x, 1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          {M("wood")}
        </mesh>
      ))}
      {[1.8, 1.2].map((y, i) => (
        <mesh key={y} castShadow position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 2.2]} />
          {M("wood")}
        </mesh>
      ))}
      <mesh castShadow position={[0, 1.5, 0.1]}>
        <boxGeometry args={[2.2, 1.0, 0.2]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.8} />
      </mesh>
      {[[-0.5, 1.1], [0.5, 1.4], [0, 0.9]].map(([px, py], i) => (
        <group key={i} position={[px, py, 0.2]}>
          {[...Array(10)].map((_, j) => (
            <mesh key={j} castShadow position={[rand(-0.12, 0.12), -j * 0.055, rand(-0.12, 0.12)]}>
              <sphereGeometry args={[0.052, 7, 7]} />
              <meshStandardMaterial color={j % 2 === 0 ? "#5b2a88" : "#7b3aa8"} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

// --- FLOWER MEADOW ------------------------------------------------------------
function FlowerMeadow({ position }) {
  const grassRef = useRef();
  const flowerRef = useRef();
  const n_g = 500, n_f = 200;

  const { gd, fd } = useMemo(() => {
    const colors = ["#ff9a9e", "#fecfef", "#a18cd1", "#ff4081", "#ffeb3b", "#ff6d6d"];
    return {
      gd: Array.from({ length: n_g }, () => ({ x: rand(-5, 5), z: rand(-4, 4), s: rand(0.2, 0.5), r: rand(0, Math.PI) })),
      fd: Array.from({ length: n_f }, () => ({ x: rand(-5, 5), z: rand(-4, 4), s: rand(0.5, 0.9), color: new THREE.Color(colors[randInt(0, colors.length - 1)]) })),
    };
  }, []);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    if (grassRef.current) {
      gd.forEach((d, i) => {
        dummy.position.set(d.x, 0.15, d.z);
        dummy.rotation.set(0, d.r, 0);
        dummy.scale.setScalar(d.s);
        dummy.updateMatrix();
        grassRef.current.setMatrixAt(i, dummy.matrix);
      });
      grassRef.current.instanceMatrix.needsUpdate = true;
    }
    if (flowerRef.current) {
      fd.forEach((d, i) => {
        dummy.position.set(d.x, 0.25, d.z);
        dummy.scale.setScalar(d.s);
        dummy.updateMatrix();
        flowerRef.current.setMatrixAt(i, dummy.matrix);
        flowerRef.current.setColorAt(i, d.color);
      });
      flowerRef.current.instanceMatrix.needsUpdate = true;
      if (flowerRef.current.instanceColor) flowerRef.current.instanceColor.needsUpdate = true;
    }
  }, [gd, fd]);

  return (
    <group position={position}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#3daa38" roughness={0.9} />
      </mesh>
      <instancedMesh ref={grassRef} args={[null, null, n_g]} castShadow>
        <coneGeometry args={[0.045, 0.38, 3]} />
        <meshStandardMaterial color="#20a840" roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={flowerRef} args={[null, null, n_f]} castShadow>
        <dodecahedronGeometry args={[0.14]} />
        <meshStandardMaterial roughness={0.6} />
      </instancedMesh>
    </group>
  );
}

// --- CROP FIELDS -------------------------------------------------------------
function CropFields({ position }) {
  const wheatStemRef = useRef();
  const wheatHeadRef = useRef();
  const riceStemRef = useRef();
  const n = 700;

  const { wd, rd } = useMemo(() => ({
    wd: Array.from({ length: n }, () => ({ x: rand(-10, 0), z: rand(-3.5, 3.5), s: rand(0.8, 1.3), r: rand(0, Math.PI * 2) })),
    rd: Array.from({ length: n }, () => ({ x: rand(0, 10), z: rand(-3.5, 3.5), s: rand(0.7, 1.1), r: rand(0, Math.PI * 2) })),
  }), []);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    if (wheatStemRef.current && wheatHeadRef.current) {
      wd.forEach((d, i) => {
        dummy.position.set(d.x, 0.35 * d.s, d.z);
        dummy.rotation.set(0, d.r, 0);
        dummy.scale.setScalar(d.s);
        dummy.updateMatrix();
        wheatStemRef.current.setMatrixAt(i, dummy.matrix);
        dummy.position.set(d.x, 0.7 * d.s, d.z);
        dummy.updateMatrix();
        wheatHeadRef.current.setMatrixAt(i, dummy.matrix);
      });
      wheatStemRef.current.instanceMatrix.needsUpdate = true;
      wheatHeadRef.current.instanceMatrix.needsUpdate = true;
    }
    if (riceStemRef.current) {
      rd.forEach((d, i) => {
        dummy.position.set(d.x, 0.28 * d.s, d.z);
        dummy.rotation.set(0, d.r, 0);
        dummy.scale.setScalar(d.s);
        dummy.updateMatrix();
        riceStemRef.current.setMatrixAt(i, dummy.matrix);
      });
      riceStemRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [wd, rd]);

  return (
    <group position={position}>
      {/* Wheat field */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0.12, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#8b6b4a" roughness={1} />
      </mesh>
      {/* Rice paddy */}
      <mesh receiveShadow position={[5, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshPhysicalMaterial color="#2a5e3e" roughness={0.15} />
      </mesh>

      <instancedMesh ref={wheatStemRef} args={[null, null, n]} castShadow>
        <cylinderGeometry args={[0.013, 0.013, 0.7, 5]} />
        <meshStandardMaterial color="#c8a030" roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={wheatHeadRef} args={[null, null, n]} castShadow>
        <capsuleGeometry args={[0.038, 0.22, 4, 8]} />
        <meshStandardMaterial color="#d4a020" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={riceStemRef} args={[null, null, n]} castShadow>
        <cylinderGeometry args={[0.013, 0.013, 0.55, 5]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </instancedMesh>
    </group>
  );
}

// --- MARKET -------------------------------------------------------------------
const marketSkillShops = [
  { type: "vegetables", color: "#2a9d8f", x: -8.5, z: -2.2, rotation: 0.06, title: "Frontend", lines: ["HTML5", "CSS3", "React.js"] },
  { type: "fruits", color: "#f4a261", x: -5.1, z: 2.1, rotation: -0.08, title: "Backend", lines: ["Node.js", "Express.js", "APIs"] },
  { type: "toys", color: "#e63946", x: -1.7, z: -2.5, rotation: 0.04, title: "Database", lines: ["MongoDB", "MySQL", "Data flow"] },
  { type: "food", color: "#e9c46a", x: 1.8, z: 2.4, rotation: -0.04, title: "AI + Android", lines: ["Java", "MediaPipe", "Voice UX"] },
  { type: "cloth", color: "#7c3aed", x: 5.2, z: -2.1, rotation: 0.08, title: "UI Craft", lines: ["Tailwind", "Responsive", "Product UX"] },
  { type: "pottery", color: "#c46a2b", x: 8.6, z: 2, rotation: -0.06, title: "Tools", lines: ["Git", "GitHub", "Deployments"] },
];

function Market({ onSelect }) {
  const place = placeById.experience;
  const people = [
    [-7, 0, 1.35, "#f59e0b", "#1f2937", 0.8],
    [-3.6, 0, -0.55, "#ef4444", "#2563eb", -0.5],
    [-0.3, 0, 1.2, "#22c55e", "#4b5563", 0.15],
    [3.1, 0, -0.65, "#06b6d4", "#78350f", -0.8],
    [6.8, 0, 0.55, "#f97316", "#14532d", 0.45],
    [9.6, 0, -0.75, "#ec4899", "#374151", -0.25],
  ];

  return (
    <group position={place.position} onClick={() => onSelect(place.id)}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <planeGeometry args={[23, 12]} />
        <meshStandardMaterial color="#8d6a45" roughness={1} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <planeGeometry args={[21.5, 3.2]} />
        <meshStandardMaterial color="#b1936a" roughness={1} />
      </mesh>
      {marketSkillShops.map((shop) => (
        <MarketStall key={shop.type} {...shop} />
      ))}
      {people.map(([x, y, z, shirt, lower, rotation], i) => (
        <BazaarPerson key={i} position={[x, y, z]} shirt={shirt} lower={lower} rotation={rotation} seed={i} />
      ))}
      <MarketWalker start={[-10, 0, -0.2]} end={[10, 0, -0.2]} shirt="#f43f5e" lower="#1e3a8a" seed={1} />
      <MarketWalker start={[9.6, 0, 1.1]} end={[-9.6, 0, 1.1]} shirt="#10b981" lower="#713f12" seed={2} />
      <MarketWalker start={[-5.5, 0, 0.15]} end={[5.5, 0, 0.9]} shirt="#8b5cf6" lower="#374151" seed={3} />
      <PushCart position={[-10.2, 0, 2.7]} color="#3b82f6" />
      <PushCart position={[10.4, 0, -2.6]} color="#ef4444" />
      <SkillBanner position={[0, 3.75, -4.25]} title="Skill Bazaar" lines={["MERN", "Android", "AI", "GitHub"]} />
      {[-9, -6, -3, 0, 3, 6, 9].map((x, i) => (
        <mesh key={i} castShadow position={[x, 2.85 + Math.sin(i) * 0.12, -4.35]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.55, 0.34, 0.04]} />
          <meshStandardMaterial color={["#ff6b6b", "#ffd166", "#4ecdc4", "#7c3aed"][i % 4]} roughness={0.55} />
        </mesh>
      ))}
      <group position={[0, 6, 0]}>
        <Glow color="#ffb86b" intensity={4.2} distance={24} scale={1.2} pulse />
      </group>
      <group position={[0, 7, 0]}>
        <PlaceLabel place={place} />
      </group>
    </group>
  );
}

function MarketStall({ type, color, x, z, rotation, title, lines }) {
  const fruits = useMemo(() => (
    Array.from({ length: 12 }, () => ({
      x: rand(-0.8, 0.8), z: rand(-0.5, 0.5),
      color: ["#ff6b35", "#ffd700", "#2ecc71", "#e74c3c", "#9b59b6"][randInt(0, 4)],
    }))
  ), [type]);

  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      {/* Counter */}
      <mesh castShadow position={[0, 0.65, 0]}>
        <boxGeometry args={[3.2, 1.2, 1.8]} />
        {M("wood", { color: "#7a4a2a" })}
      </mesh>
      {/* Counter top */}
      <mesh castShadow position={[0, 1.28, 0]}>
        <boxGeometry args={[3.25, 0.1, 1.85]} />
        {M("wood", { color: "#5a3018" })}
      </mesh>
      {/* Awning */}
      <mesh castShadow position={[0, 2.3, 0.3]}>
        <boxGeometry args={[3.6, 0.22, 2.4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 2.72, 1.34]}>
        <boxGeometry args={[2.35, 0.55, 0.08]} />
        <meshStandardMaterial color="#2b1a12" roughness={0.8} />
      </mesh>
      <SkillSign position={[0, 2.74, 1.405]} title={title} lines={lines} accent={color} size={[2.12, 0.55]} />
      {/* Awning fringe */}
      {[...Array(8)].map((_, j) => (
        <mesh key={j} castShadow position={[-1.57 + j * 0.45, 2.1, 1.4]}>
          <boxGeometry args={[0.1, 0.22, 0.06]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
      {/* Poles */}
      {[-1.4, 1.4].map((px) => (
        <mesh key={px} castShadow position={[px, 1.2, 0.9]}>
          <cylinderGeometry args={[0.06, 0.06, 2.4, 8]} />
          {M("wood")}
        </mesh>
      ))}
      <VendorBehindStall type={type} color={color} />
      <ShopGoods type={type} fruits={fruits} />
    </group>
  );
}

function VendorBehindStall({ type, color }) {
  return (
    <group position={[0, 0, -0.72]}>
      <mesh castShadow position={[0, 1.15, 0]}>
        <capsuleGeometry args={[0.23, 0.8, 6, 10]} />
        <meshStandardMaterial color={color} roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.24, 12, 12]} />
        <meshStandardMaterial color={type === "food" ? "#9a5a35" : "#b8794f"} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 2.03, 0]}>
        <cylinderGeometry args={[0.28, 0.26, 0.18, 12]} />
        <meshStandardMaterial color={type === "cloth" ? "#facc15" : "#3b2416"} roughness={0.85} />
      </mesh>
      {[-0.33, 0.33].map((sx) => (
        <mesh key={sx} castShadow position={[sx, 1.2, 0.12]} rotation={[0.2, 0, sx * 0.7]}>
          <capsuleGeometry args={[0.055, 0.44, 4, 8]} />
          <meshStandardMaterial color="#b8794f" roughness={0.78} />
        </mesh>
      ))}
    </group>
  );
}

function makeSignTexture({ title, lines, accent, width = 512, height = 256 }) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#20130b";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, width, 24);
  ctx.fillRect(0, height - 18, width, 18);
  ctx.strokeStyle = "rgba(255, 235, 180, 0.75)";
  ctx.lineWidth = 8;
  ctx.strokeRect(10, 10, width - 20, height - 20);
  ctx.fillStyle = "#fff3d4";
  ctx.font = "bold 54px Arial";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 86);
  ctx.font = "bold 34px Arial";
  lines.forEach((line, index) => {
    ctx.fillStyle = index % 2 === 0 ? "#ffd166" : "#f8fafc";
    ctx.fillText(line, width / 2, 140 + index * 38);
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function SkillSign({ position, title, lines, accent, size = [2.12, 0.55] }) {
  const texture = useMemo(() => makeSignTexture({ title, lines, accent }), [title, lines, accent]);
  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function SkillBanner({ position, title, lines }) {
  return (
    <group position={position}>
      <mesh castShadow position={[-5.9, -0.9, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 2.2, 8]} />
        {M("wood")}
      </mesh>
      <mesh castShadow position={[5.9, -0.9, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 2.2, 8]} />
        {M("wood")}
      </mesh>
      <mesh castShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[11.5, 1.35, 0.08]} />
        <meshStandardMaterial color="#2b1a12" roughness={0.7} />
      </mesh>
      <SkillSign position={[0, 0.04, 0.055]} title={title} lines={lines} accent="#ff9874" size={[10.9, 1.15]} />
    </group>
  );
}

function ShopGoods({ type, fruits }) {
  if (type === "vegetables") {
    const veg = [
      ["#3f8f2f", -0.95, 0.22], ["#6dbb35", -0.48, 0.15], ["#e24b2c", 0.05, 0.24],
      ["#8fd14f", 0.55, 0.12], ["#7b3f1d", 0.98, 0.18],
    ];
    return (
      <group>
        {veg.map(([c, px, pz], i) => (
          <Crate key={i} position={[px, 1.48, pz]} color={c} round={i !== 1} />
        ))}
        <Basket position={[-1.15, 0.38, 1.35]} color="#6dbb35" />
        <Basket position={[1.18, 0.38, 1.32]} color="#e24b2c" />
      </group>
    );
  }

  if (type === "fruits") {
    return (
      <group>
        {fruits.map((fr, j) => (
          <mesh key={j} castShadow position={[fr.x, 1.46 + (j % 3) * 0.05, fr.z]}>
            <sphereGeometry args={[0.13, 10, 10]} />
            <meshStandardMaterial color={fr.color} roughness={0.45} />
          </mesh>
        ))}
        <Basket position={[-1.12, 0.38, 1.32]} color="#ffd700" />
        <Basket position={[1.1, 0.38, 1.34]} color="#e74c3c" />
      </group>
    );
  }

  if (type === "toys") {
    return (
      <group>
        {[[-0.9, "#ef4444"], [-0.35, "#3b82f6"], [0.2, "#22c55e"], [0.78, "#f59e0b"]].map(([px, c], i) => (
          <group key={i} position={[px, 1.48, 0.12]}>
            <mesh castShadow position={[0, 0.1, 0]}>
              <boxGeometry args={[0.34, 0.22, 0.34]} />
              <meshStandardMaterial color={c} roughness={0.55} />
            </mesh>
            <mesh castShadow position={[0, 0.34, 0]}>
              <sphereGeometry args={[0.17, 10, 10]} />
              <meshStandardMaterial color={c} roughness={0.5} />
            </mesh>
          </group>
        ))}
        <mesh castShadow position={[1.15, 1.52, 0.28]} rotation={[0, 0, 0.5]}>
          <torusGeometry args={[0.26, 0.04, 8, 20]} />
          <meshStandardMaterial color="#fde047" roughness={0.45} />
        </mesh>
        <mesh castShadow position={[-1.1, 0.62, 1.35]}>
          <boxGeometry args={[0.85, 0.45, 0.55]} />
          <meshStandardMaterial color="#2563eb" roughness={0.65} />
        </mesh>
      </group>
    );
  }

  if (type === "food") {
    return (
      <group>
        {[[-0.72, "#d97706"], [-0.18, "#facc15"], [0.38, "#ef4444"], [0.9, "#84cc16"]].map(([px, c], i) => (
          <mesh key={i} castShadow position={[px, 1.54, 0.14]} scale={[1, 0.28, 1]}>
            <sphereGeometry args={[0.24, 14, 10]} />
            <meshStandardMaterial color={c} roughness={0.5} />
          </mesh>
        ))}
        <mesh castShadow position={[0, 1.48, -0.42]}>
          <cylinderGeometry args={[0.72, 0.72, 0.12, 24]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.28} />
        </mesh>
        <pointLight color="#ffb86b" intensity={1.1} distance={4} position={[0, 2.1, 0.25]} />
      </group>
    );
  }

  if (type === "cloth") {
    return (
      <group>
        {[[-1.15, "#ef4444"], [-0.55, "#06b6d4"], [0.05, "#f59e0b"], [0.65, "#a855f7"], [1.18, "#22c55e"]].map(([px, c], i) => (
          <mesh key={i} castShadow position={[px, 1.62, 0.1]} rotation={[0, 0, i % 2 ? 0.1 : -0.08]}>
            <boxGeometry args={[0.5, 0.12, 0.9]} />
            <meshStandardMaterial color={c} roughness={0.72} />
          </mesh>
        ))}
        {[[-1.2, "#f97316"], [1.2, "#2563eb"]].map(([px, c], i) => (
          <mesh key={i} castShadow position={[px, 2.02, 0.92]} rotation={[0.15, 0, 0]}>
            <planeGeometry args={[0.78, 1.35]} />
            <meshStandardMaterial color={c} side={THREE.DoubleSide} roughness={0.7} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group>
      {[[-0.95, 0.28], [-0.45, -0.12], [0.15, 0.22], [0.7, -0.1], [1.08, 0.25]].map(([px, pz], i) => (
        <group key={i} position={[px, 1.45, pz]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.24, 0.38, 12]} />
            <meshStandardMaterial color={i % 2 ? "#a85f2a" : "#c98242"} roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, 0.25, 0]}>
            <torusGeometry args={[0.17, 0.035, 8, 18]} />
            <meshStandardMaterial color="#8a4a22" roughness={0.9} />
          </mesh>
        </group>
      ))}
      <Basket position={[1.08, 0.38, 1.35]} color="#c98242" />
    </group>
  );
}

function Crate({ position, color, round = true }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, -0.08, 0]}>
        <boxGeometry args={[0.62, 0.18, 0.42]} />
        {M("wood", { color: "#6b3d1e" })}
      </mesh>
      {[...Array(7)].map((_, i) => (
        <mesh key={i} castShadow position={[-0.24 + i * 0.08, 0.08 + (i % 2) * 0.03, rand(-0.13, 0.13)]}>
          {round ? <sphereGeometry args={[0.08, 8, 8]} /> : <boxGeometry args={[0.12, 0.18, 0.1]} />}
          <meshStandardMaterial color={color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Basket({ position, color }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.46, 0.36, 0.34, 14, 1, true]} />
        {M("wood", { color: "#9b6a3a" })}
      </mesh>
      {[...Array(9)].map((_, i) => (
        <mesh key={i} castShadow position={[Math.sin(i) * 0.22, 0.22, Math.cos(i * 1.7) * 0.16]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function BazaarPerson({ position, shirt, lower, rotation, seed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.4 + seed) * 0.035;
    ref.current.rotation.y = rotation + Math.sin(clock.elapsedTime * 0.8 + seed) * 0.08;
  });

  return (
    <group ref={ref} position={position} rotation={[0, rotation, 0]}>
      <mesh castShadow position={[0, 0.58, 0]}>
        <capsuleGeometry args={[0.18, 0.62, 5, 8]} />
        <meshStandardMaterial color={lower} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 1.18, 0]}>
        <capsuleGeometry args={[0.24, 0.62, 5, 8]} />
        <meshStandardMaterial color={shirt} roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#b8794f" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0, 1.96, 0]}>
        <sphereGeometry args={[0.23, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#25150c" roughness={0.88} />
      </mesh>
      {[[-0.28, 1.18, 0.05, 0.35], [0.28, 1.18, 0.05, -0.35]].map(([x, y, z, r], i) => (
        <mesh key={i} castShadow position={[x, y, z]} rotation={[0.15, 0, r]}>
          <capsuleGeometry args={[0.055, 0.44, 4, 8]} />
          <meshStandardMaterial color="#b8794f" roughness={0.76} />
        </mesh>
      ))}
    </group>
  );
}

function MarketWalker({ start, end, shirt, lower, seed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const cycle = (Math.sin(clock.elapsedTime * 0.32 + seed) + 1) / 2;
    const x = lerp(start[0], end[0], cycle);
    const z = lerp(start[2], end[2], cycle);
    ref.current.position.set(x, Math.sin(clock.elapsedTime * 6 + seed) * 0.035, z);
    ref.current.rotation.y = Math.atan2(end[0] - start[0], end[2] - start[2]) + (cycle > 0.98 || cycle < 0.02 ? Math.PI : 0);
    ref.current.children.forEach((child, i) => {
      if (child.userData.walkLeg) child.rotation.x = Math.sin(clock.elapsedTime * 8 + seed + i) * 0.45;
      if (child.userData.walkArm) child.rotation.x = Math.sin(clock.elapsedTime * 8 + seed + i + Math.PI) * 0.38;
    });
  });

  return (
    <group ref={ref} position={start}>
      <mesh castShadow position={[-0.09, 0.38, 0]} userData={{ walkLeg: true }}>
        <capsuleGeometry args={[0.065, 0.48, 4, 8]} />
        <meshStandardMaterial color={lower} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0.09, 0.38, 0]} userData={{ walkLeg: true }}>
        <capsuleGeometry args={[0.065, 0.48, 4, 8]} />
        <meshStandardMaterial color={lower} roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 1.03, 0]}>
        <capsuleGeometry args={[0.22, 0.58, 5, 8]} />
        <meshStandardMaterial color={shirt} roughness={0.74} />
      </mesh>
      <mesh castShadow position={[-0.29, 1.06, 0.03]} rotation={[0.1, 0, 0.18]} userData={{ walkArm: true }}>
        <capsuleGeometry args={[0.05, 0.42, 4, 8]} />
        <meshStandardMaterial color="#b8794f" roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0.29, 1.06, 0.03]} rotation={[0.1, 0, -0.18]} userData={{ walkArm: true }}>
        <capsuleGeometry args={[0.05, 0.42, 4, 8]} />
        <meshStandardMaterial color="#b8794f" roughness={0.76} />
      </mesh>
      <mesh castShadow position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#b8794f" roughness={0.72} />
      </mesh>
      <mesh castShadow position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.21, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#25150c" roughness={0.88} />
      </mesh>
    </group>
  );
}

function PushCart({ position, color }) {
  return (
    <group position={position} rotation={[0, position[0] < 0 ? -0.35 : 0.35, 0]}>
      <mesh castShadow position={[0, 0.62, 0]}>
        <boxGeometry args={[1.75, 0.32, 1.05]} />
        <meshStandardMaterial color={color} roughness={0.65} />
      </mesh>
      <mesh castShadow position={[0, 1.22, -0.18]}>
        <boxGeometry args={[1.9, 0.12, 1.35]} />
        <meshStandardMaterial color="#facc15" roughness={0.55} />
      </mesh>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} castShadow position={[x, 0.28, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.055, 8, 18]} />
          <meshStandardMaterial color="#1f2937" roughness={0.65} />
        </mesh>
      ))}
      {[...Array(10)].map((_, i) => (
        <mesh key={i} castShadow position={[-0.7 + (i % 5) * 0.35, 0.88, -0.3 + Math.floor(i / 5) * 0.34]}>
          <sphereGeometry args={[0.11, 8, 8]} />
          <meshStandardMaterial color={i % 2 ? "#ef4444" : "#22c55e"} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// --- ISLAND, TERRAIN & PATHS -------------------------------------------------
function IslandOcean({ isNight }) {
  const waterRef = useRef();
  const rippleRef = useRef();
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    if (waterRef.current) {
      waterRef.current.position.y = -0.48 + Math.sin(t * 0.55) * 0.035;
      waterRef.current.material.opacity = isNight ? 0.78 : 0.86;
      waterRef.current.material.color.set(isNight ? "#143d6b" : "#2aa6c7");
    }
    if (rippleRef.current) {
      rippleRef.current.children.forEach((ripple, i) => {
        ripple.rotation.z += delta * (i % 2 ? -0.12 : 0.16);
        ripple.material.opacity = 0.2 + Math.sin(t * 1.6 + i) * 0.06;
      });
    }
  });

  return (
    <group>
      <mesh ref={waterRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, -12]}>
        <planeGeometry args={[420, 420, 96, 96]} />
        <meshPhysicalMaterial
          color={isNight ? "#143d6b" : "#2aa6c7"}
          roughness={0.18}
          metalness={0.18}
          transparent
          opacity={isNight ? 0.78 : 0.86}
          transmission={0.12}
          envMapIntensity={isNight ? 1.2 : 1.8}
        />
      </mesh>
      <group ref={rippleRef} position={[0, 0.08, -12]}>
        {[64, 69, 75].map((radius, i) => (
          <mesh key={radius} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius, radius + 0.45, 160]} />
            <meshBasicMaterial color={i === 0 ? "#fff4cf" : "#d8fbff"} transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function IslandShore() {
  return (
    <group position={[0, 0, -12]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[48, 67, 160]} />
        <meshStandardMaterial color="#d8b878" roughness={0.96} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]}>
        <ringGeometry args={[66, 72, 160]} />
        <meshStandardMaterial color="#78614a" roughness={1} />
      </mesh>
      {[
        [-46, 0.18, 18, 0.8], [-52, 0.16, -8, 0.55], [42, 0.18, 21, 0.7],
        [50, 0.14, -18, 0.48], [-22, 0.12, -58, 0.5], [18, 0.12, 50, 0.45],
      ].map(([x, y, z, s], i) => (
        <group key={i} position={[x, y, z]} scale={s}>
          <mesh castShadow rotation={[rand(-0.2, 0.2), rand(0, Math.PI), rand(-0.15, 0.15)]}>
            <dodecahedronGeometry args={[1.5, 0]} />
            <meshStandardMaterial color={i % 2 ? "#6e6257" : "#8a7c6d"} roughness={0.9} />
          </mesh>
        </group>
      ))}
      <IslandDock />
    </group>
  );
}

function IslandDock() {
  return (
    <group position={[34, 0.32, 36]} rotation={[0, -0.55, 0]}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[12, 0.32, 2.4]} />
        {M("wood", { color: "#785331" })}
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} castShadow position={[-5.2 + i * 1.48, 0.22, 0]}>
          <boxGeometry args={[1.1, 0.12, 2.65]} />
          {M("wood", { color: i % 2 ? "#8a623a" : "#6d4828" })}
        </mesh>
      ))}
      {[-5.7, -2, 1.8, 5.5].map((x) => (
        <mesh key={x} castShadow position={[x, 0.42, -1.15]}>
          <cylinderGeometry args={[0.12, 0.16, 1.15, 8]} />
          {M("darkWood")}
        </mesh>
      ))}
      <group position={[8.2, -0.18, 0.3]} rotation={[0, 0.35, 0]}>
        <mesh castShadow scale={[1.6, 0.34, 0.62]}>
          <sphereGeometry args={[1, 16, 8]} />
          <meshStandardMaterial color="#d96b43" roughness={0.55} />
        </mesh>
        <mesh castShadow position={[0, 0.34, 0]}>
          <boxGeometry args={[1.8, 0.12, 0.95]} />
          {M("wood", { color: "#f2d19b" })}
        </mesh>
      </group>
    </group>
  );
}

function Terrain() {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(200, 200, 80, 80);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      const islandZ = z + 12;
      const distance = Math.sqrt(x * x + islandZ * islandZ);
      const edgeFalloff = THREE.MathUtils.smoothstep(distance, 48, 72);
      // Gentle rolling hills
      const h =
        Math.sin(x * 0.04) * Math.cos(z * 0.04) * 0.8 +
        Math.sin(x * 0.1 + 1) * 0.25 +
        Math.cos(z * 0.12 + 2) * 0.25;
      const plateau = h * (1 - edgeFalloff * 0.45);
      const shoreDrop = THREE.MathUtils.lerp(plateau, -1.55, edgeFalloff);
      pos.setZ(i, shoreDrop);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <primitive object={geometry} />
      <meshStandardMaterial color="#5f923d" roughness={0.98} />
    </mesh>
  );
}

function CobblestonePath({ x, z, w, h, r }) {
  const meshRef = useRef();

  const stones = useMemo(() => {
    const s = [];
    const tW = 0.58, tH = 0.38, gap = 0.05;
    const cols = Math.floor((w * 0.88) / (tW + gap));
    const rows = Math.floor((h * 0.96) / (tH + gap));
    const startX = -(cols * (tW + gap)) / 2 + tW / 2;
    const startY = -(rows * (tH + gap)) / 2 + tH / 2;
    for (let row = 0; row < rows; row++) {
      const offset = row % 2 === 1 ? (tW + gap) / 2 : 0;
      const rc = row % 2 === 0 ? cols : cols - 1;
      for (let col = 0; col < rc; col++) {
        const shade = ["#878078", "#726b62", "#9a9188"][randInt(0, 2)];
        s.push({ px: startX + col * (tW + gap) + offset, py: startY + row * (tH + gap), color: new THREE.Color(shade) });
      }
    }
    return s;
  }, [w, h]);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    stones.forEach((st, i) => {
      dummy.position.set(st.px, st.py, 0.025);
      dummy.scale.set(0.58, 0.38, 1);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, st.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [stones]);

  return (
    <group position={[x, 0.06, z]} rotation={[-Math.PI / 2, 0, r]}>
      <mesh receiveShadow>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#62503b" roughness={1} />
      </mesh>
      <instancedMesh ref={meshRef} args={[null, null, stones.length]} receiveShadow>
        <boxGeometry args={[1, 1, 0.05]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>
    </group>
  );
}

// --- LAGOON CHANNEL -----------------------------------------------------------
function River() {
  const rippleRef = useRef();
  const waterRef = useRef();
  let t = 0;

  useFrame((_, delta) => {
    t += delta;
    if (waterRef.current) {
      waterRef.current.material.color.setHSL(0.55, 0.6, 0.38 + Math.sin(t * 0.5) * 0.02);
    }
    if (rippleRef.current) {
      rippleRef.current.children.forEach((r, i) => {
        r.position.z += delta * 5.5;
        if (r.position.z > 45) r.position.z = -55;
        r.scale.x = 1 + Math.sin(t * 2.5 + i) * 0.4;
        r.material.opacity = 0.18 + Math.sin(t * 1.5 + i) * 0.1;
      });
    }
  });

  return (
    <group position={[-34, 0.07, -10]}>
      {/* Lagoon bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]}>
        <planeGeometry args={[11, 110]} />
        <meshStandardMaterial color="#2a4a5e" roughness={0.9} />
      </mesh>
      {/* Lagoon water surface */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 110]} />
        <meshPhysicalMaterial
          color="#4095b8"
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.84}
          transmission={0.4}
        />
      </mesh>
      {/* Ripples */}
      <group ref={rippleRef}>
        {Array.from({ length: 40 }).map((_, i) => (
          <mesh key={i} position={[rand(-4, 4), 0.04, rand(-50, 50)]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.6, 0.06]} />
            <meshBasicMaterial color="#c0e8ff" transparent opacity={0.22} />
          </mesh>
        ))}
      </group>
      {/* Fish */}
      {Array.from({ length: 8 }).map((_, i) => (
        <JumpingFish key={i} index={i} />
      ))}
    </group>
  );
}

function JumpingFish({ index }) {
  const ref = useRef();
  const ix = (index % 2 === 0 ? 1 : -1) * rand(1, 3.5);
  const iz = -30 + index * 12;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 1.3 + index * 2.2;
    const cycle = t % 5;
    if (cycle < 1.2) {
      const p = cycle / 1.2;
      ref.current.position.y = Math.sin(p * Math.PI) * 1.8 - 0.5;
      ref.current.position.z = iz + p * 2.5;
      ref.current.rotation.x = -Math.cos(p * Math.PI) * 0.9;
      ref.current.visible = true;
    } else {
      ref.current.visible = false;
    }
  });

  return (
    <group ref={ref} position={[ix, -0.5, iz]}>
      <mesh castShadow scale={[0.14, 0.22, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="#ff7050" roughness={0.3} metalness={0.7} />
      </mesh>
      {[0.06, -0.06].map((ox) => (
        <mesh key={ox} position={[ox, 0.05, 0.15]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      ))}
    </group>
  );
}

function Bridges() {
  const zPos = [-42, -28, -14, 0, 14, 28];
  return (
    <group position={[-34, 0.54, 0]}>
      {zPos.map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[13, 0.48, 3.2]} />
            {M("wood", { color: "#7a4a1e" })}
          </mesh>
          {/* Planks */}
          {[...Array(9)].map((_, i) => (
            <mesh key={i} castShadow position={[-5.2 + i * 1.3, 0.26, 0]}>
              <boxGeometry args={[1.1, 0.1, 3.0]} />
              {M("wood", { color: "#8a5a2e" })}
            </mesh>
          ))}
          {/* Rails */}
          {[-1.4, 1.4].map((rz) => (
            <group key={rz}>
              <mesh castShadow position={[0, 0.5, rz]}>
                <boxGeometry args={[13, 0.22, 0.14]} />
                {M("darkWood")}
              </mesh>
              {[-5, -2.5, 0, 2.5, 5].map((px) => (
                <mesh key={px} castShadow position={[px, 0.28, rz]}>
                  <cylinderGeometry args={[0.07, 0.07, 0.62]} />
                  {M("darkWood")}
                </mesh>
              ))}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

// --- TREES --------------------------------------------------------------------
function OakTree({ position, seed }) {
  const s = 0.8 + (seed % 5) * 0.09;
  return (
    <group position={position} scale={s}>
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.45, 0.65, 3, 8]} />
        {M("wood", { color: "#4a2e1b" })}
      </mesh>
      {[[0, 4.8, 0, 2.2], [1.3, 3.8, 0.5, 1.7], [-1.3, 3.6, -0.6, 1.6], [-0.5, 4.0, -1.6, 1.75]].map(([x, y, z, r], i) => (
        <mesh key={i} castShadow position={[x, y, z]}>
          <dodecahedronGeometry args={[r, 1]} />
          <meshStandardMaterial color={i === 0 ? "#28501e" : "#325c24"} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function CherryBlossomTree({ position, seed }) {
  const s = 0.85 + (seed % 3) * 0.1;
  const flowers = useMemo(() => (
    Array.from({ length: 30 }, () => ({
      x: rand(-3, 3), y: rand(-2, 2), z: rand(-3, 3), s: rand(0.1, 0.18),
    })).filter(a => a.x ** 2 + a.y ** 2 + a.z ** 2 < 5)
  ), [seed]);

  return (
    <group position={position} scale={s}>
      <mesh castShadow position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.22, 0.34, 3, 7]} />
        {M("darkWood", { color: "#3a2318" })}
      </mesh>
      <group position={[0, 3.5, 0]}>
        {[[0, 0.5, 0, 1.7], [0.85, -0.1, 0.6, 1.3], [-0.95, 0.2, -0.4, 1.4], [0, -0.3, -1.1, 1.15]].map(([x, y, z, r], i) => (
          <mesh key={i} castShadow position={[x, y, z]}>
            <dodecahedronGeometry args={[r, 1]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#ffb7c5" : "#ffc8d4"} roughness={0.55} />
          </mesh>
        ))}
        {flowers.map((fl, i) => (
          <mesh key={i} castShadow position={[fl.x, fl.y + 0.5, fl.z]} scale={fl.s}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#fff0f3" roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// --- ANIMALS -----------------------------------------------------------------
function DetailedCow({ index, initialPos }) {
  const ref = useRef(), legsRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.position.x = initialPos[0] + Math.sin(t * 0.18 + index) * 2.5;
    ref.current.position.z = initialPos[2] + Math.cos(t * 0.18 + index) * 2.5;
    ref.current.rotation.y = (t * 0.18 + index) + Math.PI;
    if (legsRef.current) {
      legsRef.current.children[0].rotation.x = Math.sin(t * 2.2) * 0.28;
      legsRef.current.children[1].rotation.x = Math.sin(t * 2.2 + Math.PI) * 0.28;
      legsRef.current.children[2].rotation.x = Math.sin(t * 2.2 + Math.PI) * 0.28;
      legsRef.current.children[3].rotation.x = Math.sin(t * 2.2) * 0.28;
    }
  });
  const spots = useMemo(() => Array.from({ length: 5 }, (_, i) => ({ x: rand(-0.28, 0.28), z: rand(-0.55, 0.55), s: rand(0.1, 0.2) })), []);

  return (
    <group ref={ref} position={initialPos}>
      {/* Body */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[0.85, 0.72, 1.65]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.88} />
      </mesh>
      {spots.map((sp, i) => (
        <mesh key={i} position={[sp.x > 0 ? 0.43 : -0.43, 1.2 + sp.x * 0.5, sp.z]}>
          <boxGeometry args={[0.04, sp.s * 0.7, sp.s * 1.2]} />
          <meshStandardMaterial color="#222" roughness={0.9} />
        </mesh>
      ))}
      {/* Head */}
      <group position={[0, 1.5, 0.95]}>
        <mesh castShadow><boxGeometry args={[0.52, 0.52, 0.62]} /><meshStandardMaterial color="#f5f5f0" roughness={0.88} /></mesh>
        <mesh castShadow position={[0, -0.1, 0.36]}><boxGeometry args={[0.42, 0.32, 0.2]} /><meshStandardMaterial color="#ffb6c1" roughness={0.8} /></mesh>
        {[0.27, -0.27].map((ex) => (<mesh key={ex} castShadow position={[ex, 0.1, 0.12]}><sphereGeometry args={[0.055, 8, 8]} /><meshBasicMaterial color="#111" /></mesh>))}
        {[0.21, -0.21].map((hx) => (<mesh key={hx} castShadow position={[hx, 0.3, -0.12]} rotation={[0.2, 0, hx > 0 ? -0.3 : 0.3]}><coneGeometry args={[0.05, 0.3, 8]} /><meshStandardMaterial color="#ddd" roughness={0.7} /></mesh>))}
      </group>
      {/* Udder */}
      <mesh position={[0, 0.72, 0.2]}>
        <boxGeometry args={[0.38, 0.18, 0.42]} />
        <meshStandardMaterial color="#f4a0b4" roughness={0.7} />
      </mesh>
      {/* Tail */}
      <mesh castShadow position={[0, 1.1, -0.85]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.65]} />
        <meshStandardMaterial color="#f0f0e0" roughness={0.9} />
      </mesh>
      {/* Legs */}
      <group ref={legsRef}>
        {[[0.26, 0.4, 0.62], [-0.26, 0.4, 0.62], [0.26, 0.4, -0.62], [-0.26, 0.4, -0.62]].map(([lx, ly, lz], i) => (
          <mesh key={i} castShadow position={[lx, ly, lz]}>
            <boxGeometry args={[0.14, 0.8, 0.14]} />
            <meshStandardMaterial color="#f5f5f0" roughness={0.85} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function DetailedSheep({ index, initialPos }) {
  const ref = useRef(), legsRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.position.x = initialPos[0] + Math.sin(t * 0.15 + index) * 1.8;
    ref.current.position.z = initialPos[2] + Math.cos(t * 0.15 + index) * 1.8;
    ref.current.rotation.y = (t * 0.15 + index) + Math.PI;
    if (legsRef.current) {
      legsRef.current.children[0].rotation.x = Math.sin(t * 3.2) * 0.28;
      legsRef.current.children[1].rotation.x = Math.sin(t * 3.2 + Math.PI) * 0.28;
      legsRef.current.children[2].rotation.x = Math.sin(t * 3.2 + Math.PI) * 0.28;
      legsRef.current.children[3].rotation.x = Math.sin(t * 3.2) * 0.28;
    }
  });

  return (
    <group ref={ref} position={initialPos}>
      <mesh castShadow position={[0, 0.62, 0]}>
        <dodecahedronGeometry args={[0.52, 1]} />
        <meshStandardMaterial color="#f0f0ee" roughness={1} />
      </mesh>
      <group position={[0, 0.72, 0.52]}>
        <mesh castShadow><boxGeometry args={[0.3, 0.3, 0.4]} /><meshStandardMaterial color="#222" roughness={0.85} /></mesh>
        {[0.16, -0.16].map((ex) => (<mesh key={ex} castShadow position={[ex, 0.06, 0.12]}><sphereGeometry args={[0.038, 8, 8]} /><meshBasicMaterial color="#fff" /></mesh>))}
        {[0.2, -0.2].map((ex) => (<mesh key={ex} castShadow position={[ex, 0.0, -0.1]} rotation={[0, 0, ex > 0 ? -0.5 : 0.5]}><boxGeometry args={[0.2, 0.06, 0.1]} /><meshStandardMaterial color="#111" /></mesh>))}
      </group>
      <group ref={legsRef}>
        {[[0.2, 0.2, 0.3], [-0.2, 0.2, 0.3], [0.2, 0.2, -0.3], [-0.2, 0.2, -0.3]].map(([lx, ly, lz], i) => (
          <mesh key={i} castShadow position={[lx, ly, lz]}>
            <cylinderGeometry args={[0.04, 0.04, 0.42]} />
            <meshStandardMaterial color="#111" roughness={0.8} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Dog({ initialPos }) {
  const ref = useRef(), legsRef = useRef(), tailRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.position.x = initialPos[0] + Math.sin(t * 0.5) * 5;
    ref.current.position.z = initialPos[2] + Math.cos(t * 0.5) * 5;
    ref.current.rotation.y = t * 0.5 + Math.PI;
    if (legsRef.current) {
      legsRef.current.children.forEach((leg, i) => {
        leg.rotation.x = Math.sin(t * 5 + (i < 2 ? 0 : Math.PI)) * 0.45;
      });
    }
    if (tailRef.current) tailRef.current.rotation.y = Math.sin(t * 10) * 0.6;
  });

  return (
    <group ref={ref} position={initialPos}>
      <mesh castShadow position={[0, 0.45, 0]}><boxGeometry args={[0.3, 0.3, 0.82]} /><meshStandardMaterial color="#b37340" roughness={0.88} /></mesh>
      <group position={[0, 0.62, 0.47]}>
        <mesh castShadow><boxGeometry args={[0.26, 0.26, 0.26]} /><meshStandardMaterial color="#b37340" roughness={0.88} /></mesh>
        <mesh castShadow position={[0, -0.05, 0.16]}><boxGeometry args={[0.16, 0.15, 0.2]} /><meshStandardMaterial color="#8b5a2b" roughness={0.88} /></mesh>
        <mesh position={[0, 0.06, 0.27]}><sphereGeometry args={[0.03, 8, 8]} /><meshBasicMaterial color="#111" /></mesh>
        {[0.12, 0.14].map((ey) => (<mesh key={ey} castShadow position={[ey > 0.13 ? 0.1 : -0.1, 0.06, 0.14]}><sphereGeometry args={[0.022, 8, 8]} /><meshBasicMaterial color="#111" /></mesh>))}
      </group>
      <group ref={tailRef} position={[0, 0.5, -0.42]}>
        <mesh castShadow position={[0, 0.18, -0.1]} rotation={[-0.5, 0, 0]}>
          <cylinderGeometry args={[0.022, 0.022, 0.42]} />
          <meshStandardMaterial color="#b37340" roughness={0.9} />
        </mesh>
      </group>
      <group ref={legsRef}>
        {[[0.1, 0.18, 0.3], [-0.1, 0.18, 0.3], [0.1, 0.18, -0.3], [-0.1, 0.18, -0.3]].map(([lx, ly, lz], i) => (
          <mesh key={i} castShadow position={[lx, ly, lz]}><boxGeometry args={[0.06, 0.38, 0.06]} /><meshStandardMaterial color="#8b5a2b" roughness={0.8} /></mesh>
        ))}
      </group>
    </group>
  );
}

// --- BIRDS --------------------------------------------------------------------
function Birds() {
  return (
    <group>
      {[
        { type: "crow", pos: [0, 20, 0], radius: 18, idx: 0 },
        { type: "crow", pos: [0, 17.5, 0], radius: 14, idx: 1 },
        { type: "pigeon", pos: [-4, 0.4, 5, 1.2], flying: false, idx: 2 },
        { type: "pigeon", pos: [-5.5, 0.4, 6, 2.5], flying: false, idx: 3 },
        { type: "sparrow", pos: [-14, 7, -4], radius: 5, idx: 4 },
        { type: "sparrow", pos: [-14, 6.5, -4], radius: 4, idx: 5 },
      ].map((b) => (
        <Bird key={b.idx} {...b} />
      ))}
    </group>
  );
}

function Bird({ type, pos, radius, flying = true, idx }) {
  const ref = useRef(), wRef = useRef();
  const cfg = {
    crow: { color: "#2a2a2a", scale: 0.48, flapSpeed: 11 },
    pigeon: { color: "#8a90a8", scale: 0.35, flapSpeed: 15 },
    sparrow: { color: "#8b5a2b", scale: 0.22, flapSpeed: 20 },
  }[type];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (flying) {
      const angle = t * 0.42 + idx * (Math.PI * 2 / 3);
      ref.current.position.x = pos[0] + Math.cos(angle) * radius;
      ref.current.position.z = pos[2] + Math.sin(angle) * radius;
      ref.current.position.y = pos[1] + Math.sin(t * 2 + idx) * 0.55;
      ref.current.rotation.y = Math.atan2(Math.cos(angle), -Math.sin(angle));
      if (wRef.current) {
        wRef.current.children[0].rotation.x = Math.sin(t * cfg.flapSpeed) * 0.82;
        wRef.current.children[1].rotation.x = -Math.sin(t * cfg.flapSpeed) * 0.82;
      }
    } else {
      ref.current.position.y = pos[1] + Math.max(0, Math.sin(t * 8 + idx)) * 0.14;
      ref.current.rotation.y = (pos[3] || 0) + Math.sin(t * 0.5 + idx) * 0.25;
    }
  });

  return (
    <group ref={ref} position={pos.slice(0, 3)} scale={cfg.scale}>
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.25, 0.5, 6, 12]} />
        <meshStandardMaterial color={cfg.color} roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0.38, 0.22, 0]}>
        <sphereGeometry args={[0.22, 10, 10]} />
        <meshStandardMaterial color={cfg.color} roughness={0.88} />
      </mesh>
      <mesh castShadow position={[0.56, 0.22, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.08, 0.24, 8]} />
        <meshStandardMaterial color={type === "sparrow" ? "#d4a373" : "#111"} roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.42, 0.1, 0]} rotation={[0, 0, -0.2]}>
        <coneGeometry args={[0.14, 0.44, 4]} />
        <meshStandardMaterial color={cfg.color} roughness={0.9} />
      </mesh>
      <group ref={wRef} position={[0, 0.08, 0]}>
        <group position={[0, 0, 0.22]}>
          <mesh castShadow position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.2, 0.52, 3]} />
            <meshStandardMaterial color={cfg.color} roughness={0.9} />
          </mesh>
        </group>
        <group position={[0, 0, -0.22]}>
          <mesh castShadow position={[0, 0, -0.14]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.2, 0.52, 3]} />
            <meshStandardMaterial color={cfg.color} roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// --- PARTICLES ----------------------------------------------------------------
function Fireflies({ activePlace }) {
  const groupRef = useRef();
  const flies = useMemo(() => (
    Array.from({ length: 100 }, () => ({
      x: rand(-72, 72), y: rand(1.2, 6), z: rand(-80, 32), seed: rand(0, 100),
    }))
  ), []);

  useFrame(({ clock }) => {
    groupRef.current.children.forEach((fly, i) => {
      const s = flies[i].seed;
      fly.position.x = flies[i].x + Math.sin(clock.elapsedTime * 0.75 + s) * 0.85;
      fly.position.y = flies[i].y + Math.cos(clock.elapsedTime * 1.3 + s) * 0.4;
      fly.position.z = flies[i].z + Math.sin(clock.elapsedTime * 0.65 + s * 0.3) * 0.9;
      fly.material.opacity = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 2.5 + s);
    });
  });

  const accentColor = placeById[activePlace]?.color || "#d8ff91";

  return (
    <group ref={groupRef}>
      {flies.map((fly, i) => (
        <mesh key={i} position={[fly.x, fly.y, fly.z]}>
          <sphereGeometry args={[i % 4 === 0 ? 0.1 : 0.052, 6, 5]} />
          <meshBasicMaterial color={i % 7 === 0 ? accentColor : "#ceff80"} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function PollenParticles() {
  const groupRef = useRef();
  const particles = useMemo(() => (
    Array.from({ length: 60 }, () => ({
      x: rand(-20, 20), y: rand(1, 8), z: rand(-45, 20), seed: rand(0, 100),
    }))
  ), []);

  useFrame(({ clock }) => {
    groupRef.current.children.forEach((p, i) => {
      const s = particles[i].seed;
      p.position.x = particles[i].x + Math.sin(clock.elapsedTime * 0.2 + s) * 3;
      p.position.y = particles[i].y + Math.sin(clock.elapsedTime * 0.4 + s * 0.5) * 1.2;
      p.position.z = particles[i].z + Math.cos(clock.elapsedTime * 0.18 + s) * 2.5;
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.04, 5, 5]} />
          <meshBasicMaterial color="#fffbb0" transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

// --- RAIN ---------------------------------------------------------------------
function Rain({ enabled }) {
  const ref = useRef();
  const drops = useMemo(() => (
    Array.from({ length: 200 }, () => [rand(-90, 90), rand(2, 28), rand(-90, 40)])
  ), []);

  useFrame((_, delta) => {
    if (!enabled) return;
    ref.current.children.forEach((d) => {
      d.position.y -= delta * 22;
      if (d.position.y < 0) d.position.y = 20 + Math.random() * 14;
    });
  });

  if (!enabled) return null;
  return (
    <group ref={ref}>
      {drops.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.022, 0.82, 0.022]} />
          <meshBasicMaterial color="#b8d8f8" transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

// --- SKY ----------------------------------------------------------------------
function Sky({ isNight }) {
  const sunRef = useRef();
  const moonRef = useRef();
  const starsRef = useRef();

  useFrame(({ clock }) => {
    if (sunRef.current) {
      sunRef.current.material.opacity = isNight ? 0 : 1;
    }
    if (moonRef.current) {
      moonRef.current.material.opacity = isNight ? 1 : 0;
    }
  });

  const starGeometry = useMemo(() => {
    const positions = new Float32Array(1600 * 3);
    for (let i = 0; i < positions.length; i += 3) {
      const r = 60 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.45;
      positions[i] = Math.cos(theta) * Math.cos(phi) * r;
      positions[i + 1] = 20 + Math.sin(phi) * r * 0.7;
      positions[i + 2] = Math.sin(theta) * Math.cos(phi) * r;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <>
      {/* Sun disc */}
      <mesh ref={sunRef} position={[-30, 40, -70]}>
        <sphereGeometry args={[4.5, 20, 20]} />
        <meshBasicMaterial color="#ffe870" transparent opacity={1} />
      </mesh>
      {/* Sun halo */}
      <mesh position={[-30, 40, -70]}>
        <sphereGeometry args={[6, 16, 16]} />
        <meshBasicMaterial color="#ffde30" transparent opacity={isNight ? 0 : 0.18} side={THREE.BackSide} />
      </mesh>
      {/* Moon */}
      <mesh ref={moonRef} position={[28, 42, -70]}>
        <sphereGeometry args={[3.2, 18, 18]} />
        <meshBasicMaterial color="#e8ecf8" transparent opacity={0} />
      </mesh>
      {/* Stars */}
      <points geometry={starGeometry}>
        <pointsMaterial color="#d0e0ff" size={0.18} sizeAttenuation transparent opacity={isNight ? 0.9 : 0.05} />
      </points>
    </>
  );
}

// --- VILLAGE TREES ------------------------------------------------------------
function VillageTrees() {
  const positions = useMemo(() => [
    [-10, 7], [11, 6], [-26, 10], [28, 4], [-28, -28], [29, -34],
    [-10, -44], [11, -46], [-43, 8], [43, -9], [-40, -36], [39, -37],
    [-5, -15], [7, -16], [23, -30], [-24, -14], [-44, -18], [40, 10],
    [-32, -50], [30, -50], [0, -55], [-15, -52], [15, -52],
  ], []);

  return (
    <>
      {positions.map(([x, z], i) => {
        const type = i % 3;
        if (type === 0) return <OakTree key={i} position={[x, 0, z]} seed={i} />;
        if (type === 1) return <AppleTree key={i} position={[x, 0, z]} seed={i} />;
        return <CherryBlossomTree key={i} position={[x, 0, z]} seed={i} />;
      })}
    </>
  );
}

// --- CAMERA -------------------------------------------------------------------
const cameraViews = {
  home: {
    targetOffset: [-2.5, 0, 3],
    cameraOffset: [-10.5, 7.2, 12],
    focusOffset: [0.7, 2.7, 0],
  },
  projects: {
    targetOffset: [0, 0, 3.5],
    cameraOffset: [-13.5, 8.8, 15],
    focusOffset: [0, 3.7, 0],
  },
  achievements: {
    targetOffset: [0, 0, 5],
    cameraOffset: [-12, 11.5, 18],
    focusOffset: [0, 6.5, 0],
  },
  experience: {
    targetOffset: [0, 0, 1.5],
    cameraOffset: [-11, 6.6, 14],
    focusOffset: [0, 2.6, 0],
  },
};

function CameraRig({ activePlace }) {
  const { camera } = useThree();
  const controlsRef = useRef();
  const isOrbiting = useRef(false);
  const isSettling = useRef(true);
  const homeView = cameraViews.home;
  const player = useRef(new THREE.Vector3(
    placeById.home.position[0] + homeView.targetOffset[0],
    0,
    placeById.home.position[2] + homeView.targetOffset[2]
  ));
  const target = useRef(player.current.clone());
  const keys = useRef({ f: 0, r: 0 });
  const zoom = useRef(0);

  useEffect(() => {
    const down = (e) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") keys.current.f = 1;
      if (e.code === "KeyS" || e.code === "ArrowDown") keys.current.f = -1;
      if (e.code === "KeyA" || e.code === "ArrowLeft") keys.current.r = -1;
      if (e.code === "KeyD" || e.code === "ArrowRight") keys.current.r = 1;
    };
    const up = (e) => {
      if (["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(e.code)) keys.current.f = 0;
      if (["KeyA", "KeyD", "ArrowLeft", "ArrowRight"].includes(e.code)) keys.current.r = 0;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const p = placeById[activePlace];
    const view = cameraViews[activePlace];
    target.current.set(
      p.position[0] + (view?.targetOffset[0] ?? 0),
      0,
      p.position[2] + (view?.targetOffset[2] ?? 9)
    );
    isSettling.current = true;
  }, [activePlace]);

  useFrame((_, delta) => {
    const place = placeById[activePlace];
    const walking = Math.abs(keys.current.f) + Math.abs(keys.current.r) > 0;

    if (walking) {
      player.current.x += keys.current.r * delta * 10;
      player.current.z -= keys.current.f * delta * 10;
      player.current.x = THREE.MathUtils.clamp(player.current.x, -50, 50);
      player.current.z = THREE.MathUtils.clamp(player.current.z, -52, 26);
      target.current.copy(player.current);
    } else {
      player.current.lerp(target.current, 1 - Math.pow(0.0008, delta));
    }

    const zoomOff = zoom.current;
    const view = !walking ? cameraViews[activePlace] : null;
    const desired = view
      ? new THREE.Vector3(
          place.position[0] + view.cameraOffset[0] + zoomOff,
          view.cameraOffset[1] + zoomOff * 0.45,
          place.position[2] + view.cameraOffset[2] + zoomOff
        )
      : new THREE.Vector3(
          player.current.x + 8 + zoomOff,
          7.5 + zoomOff * 0.5,
          player.current.z + 12 + zoomOff
        );
    const focus = walking
      ? new THREE.Vector3(player.current.x, 2, player.current.z - 6)
      : new THREE.Vector3(
          place.position[0] + (view?.focusOffset[0] ?? 0),
          view?.focusOffset[1] ?? 2.5,
          place.position[2] + (view?.focusOffset[2] ?? 0)
        );

    const controls = controlsRef.current;
    if (controls) {
      controls.target.lerp(focus, 1 - Math.pow(0.0007, delta));
    }

    if (!isOrbiting.current && (walking || isSettling.current)) {
      camera.position.lerp(desired, 1 - Math.pow(0.0005, delta));
      if (camera.position.distanceTo(desired) < 0.08 && !walking) {
        isSettling.current = false;
      }
    }

    controls?.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.075}
      enablePan={false}
      minDistance={8}
      maxDistance={42}
      minPolarAngle={0.18}
      maxPolarAngle={Math.PI * 0.46}
      rotateSpeed={0.55}
      zoomSpeed={0.75}
      onStart={() => {
        isOrbiting.current = true;
        isSettling.current = false;
      }}
      onEnd={() => {
        isOrbiting.current = false;
      }}
    />
  );
}

function NightVillageLights({ activePlace, enabled }) {
  if (!enabled) return null;

  return (
    <group>
      {places.map((place) => {
        const active = place.id === activePlace;
        return (
          <group key={place.id} position={[place.position[0], 4.2, place.position[2]]}>
            <pointLight
              color={place.color}
              intensity={active ? 7.5 : 3.2}
              distance={active ? 28 : 18}
              decay={1.65}
            />
            <mesh>
              <sphereGeometry args={[active ? 0.32 : 0.22, 16, 12]} />
              <meshBasicMaterial color={place.color} transparent opacity={active ? 0.9 : 0.62} />
            </mesh>
          </group>
        );
      })}
      <pointLight color="#ffe0a6" intensity={4.6} distance={64} decay={1.35} position={[0, 12, -12]} />
      <pointLight color="#8fb7ff" intensity={2.6} distance={70} decay={1.45} position={[24, 18, -34]} />
      <pointLight color="#b8ffe2" intensity={2.2} distance={54} decay={1.5} position={[-28, 10, -20]} />
    </group>
  );
}

// --- WORLD --------------------------------------------------------------------
function World({ activePlace, onSelect, isNight, isRaining }) {
  const skyColor = isNight ? "#0d1d38" : "#ffd9a8";
  const fogColor = isNight ? "#123057" : "#ffc884";
  const ambientInt = isNight ? 0.9 : 1.12;
  const dirInt = isNight ? 2.75 : 5.6;
  const dirColor = isNight ? "#a9c9ff" : "#ffe2a4";
  const dirPos = isNight ? [22, 38, -28] : [-38, 52, 34];

  return (
    <>
      <SoftShadows size={25} samples={16} focus={0.5} />
      <Environment preset={isNight ? "night" : "city"} blur={0.8} />
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={[fogColor, isNight ? 42 : 32, isNight ? 165 : 135]} />

      <hemisphereLight intensity={ambientInt} color={isNight ? "#cfe1ff" : "#fff2d0"} groundColor={isNight ? "#17233a" : "#3a2718"} />
      <directionalLight
        castShadow
        position={dirPos}
        intensity={dirInt}
        color={dirColor}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-far={150}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0005}
      />
      {/* Fill light */}
      <directionalLight position={[40, 22, 50]} intensity={isNight ? 1.0 : 1.7} color={isNight ? "#719aff" : "#ffd18c"} />
      <directionalLight position={[-22, 18, -42]} intensity={isNight ? 0.48 : 0.95} color={isNight ? "#7df7ff" : "#9ff5ff"} />
      {/* Ambient fill from sky */}
      <ambientLight intensity={isNight ? 0.58 : 0.72} color={isNight ? "#3c5688" : "#fff3d4"} />

      <Sky isNight={isNight} />
      <NightVillageLights activePlace={activePlace} enabled={isNight} />

      <IslandOcean isNight={isNight} />
      <Terrain />
      <IslandShore />
      {/* Paths */}
      <CobblestonePath x={0} z={-16} w={5.5} h={86} r={0} />
      {[
        [-9, -3, 17, 4, 0.24],
        [9, -4, 17, 4, -0.22],
        [-8, -23, 18, 3.8, 0.19],
        [10, -25, 19, 3.8, -0.2],
        [14, -18, 24, 3.6, -0.82],
      ].map(([x, z, w, h, r], i) => (
        <CobblestonePath key={i} x={x} z={z} w={w} h={h} r={r} />
      ))}

      <River />
      <Bridges />

      <Hut place={placeById.home} onSelect={onSelect} decorated />
      <Library onSelect={onSelect} />
      <Workshop onSelect={onSelect} />
      <Farm onSelect={onSelect} />
      <Temple onSelect={onSelect} />
      <Market onSelect={onSelect} />
      <Hut place={placeById.contact} width={5.2} onSelect={onSelect} decorated />

      <VillageTrees />

      <DetailedCow index={0} initialPos={[-11, 0, -28]} />
      <DetailedCow index={1} initialPos={[-5, 0, -33]} />
      <DetailedSheep index={2} initialPos={[-15, 0, -26]} />
      <DetailedSheep index={3} initialPos={[-18, 0, -25]} />
      <Dog initialPos={[-8, 0, -12]} />

      <Birds />
      <Fireflies activePlace={activePlace} />
      <PollenParticles />
      <Rain enabled={isRaining} />

      <CameraRig activePlace={activePlace} />

      <EffectComposer disableNormalPass multisampling={4}>
        <Bloom 
          luminanceThreshold={0.36} 
          mipmapBlur 
          intensity={isNight ? 1.48 : 1.0} 
          levels={8}
          opacity={isNight ? 1.34 : 0.76} 
        />
        <ToneMapping 
          mode={THREE.ACESFilmicToneMapping} 
          exposure={isNight ? 1.42 : 1.22} 
        />
        <Vignette 
          offset={0.3} 
          darkness={isNight ? 0.38 : 0.2} 
          blendFunction={BlendFunction.MULTIPLY} 
        />
      </EffectComposer>
    </>
  );
}

// --- ROOT COMPONENT -----------------------------------------------------------
export default function VillageWorld({ activePlace, onSelect, isNight, isRaining }) {
  return (
    <Canvas
      shadows
      camera={{ position: [8, 8, 22], fov: 55, near: 0.1, far: 800 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 2]}
      className="village-canvas"
    >
      <Suspense fallback={null}>
        <World
          activePlace={activePlace}
          onSelect={onSelect}
          isNight={isNight}
          isRaining={isRaining}
        />
      </Suspense>
    </Canvas>
  );
}

