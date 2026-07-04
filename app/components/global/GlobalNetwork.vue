<template>
  <div 
    class="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden transition-opacity duration-700 ease-in-out"
    :class="{ 'opacity-50': activeSectionId && activeSectionId !== 'hero' }"
  >
    <canvas ref="canvasRef" class="w-full h-full block absolute top-0 left-0 pointer-events-auto"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { useReducedMotion } from '~/composables/useReducedMotion'

const props = defineProps({
  mode: {
    type: String,
    default: 'normal'
  },
  activeNodeIndex: {
    type: Number,
    default: 0
  },
  activeSectionId: {
    type: String,
    default: 'hero'
  }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { prefersReduced } = useReducedMotion()

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null

// Network elements
let nodesGroup: THREE.Group | null = null
let lineSegments: THREE.LineSegments | null = null

interface NodeData {
  basePos: THREE.Vector3;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  targetPos: THREE.Vector3;
  size: number;
  brightness: number;
  highlighted: boolean;
}

let nodesList: NodeData[] = []
const maxDistance = 3.5

// Mouse / Interaction fields
const mouse = new THREE.Vector2(-9999, -9999)
const targetMouse = new THREE.Vector2(-9999, -9999)
const clickPulse = ref(0)
let clickPos = new THREE.Vector3()

// Handle window resizing
const handleResize = () => {
  if (!camera || !renderer || !canvasRef.value) return
  const width = window.innerWidth
  const height = window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

const onPointerMove = (e: PointerEvent) => {
  // Normalize screen coordinates
  targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1
  targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1
}

const onPointerClick = (e: PointerEvent) => {
  if (!camera) return
  
  // Calculate click coordinates in 3D space
  const raycaster = new THREE.Raycaster()
  const mouseCoords = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  )
  raycaster.setFromCamera(mouseCoords, camera)
  
  // Intersect with plane at z=0
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const intersectPoint = new THREE.Vector3()
  raycaster.ray.intersectPlane(plane, intersectPoint)
  
  clickPos.copy(intersectPoint)
  clickPulse.value = 1.0 // Initialize pulse trigger
}

onMounted(() => {
  if (!canvasRef.value) return

  // Setup Scene, Camera, Renderer
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x080810, 0.08)

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 10

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x080810, 1)

  nodesGroup = new THREE.Group()
  scene.add(nodesGroup)

  // Build irregular network nodes
  const nodeCount = window.innerWidth < 768 ? 40 : 110
  const pointsGeometry = new THREE.BufferGeometry()
  const positions = new Float32Array(nodeCount * 3)
  const nodeColors = new Float32Array(nodeCount * 3)

  for (let i = 0; i < nodeCount; i++) {
    // Spatial positioning: span wider on X and Y coordinate grids to overflow window borders
    const isRightHeavy = Math.random() > 0.4
    const x = isRightHeavy 
      ? (Math.random() * 8 + 0.5) 
      : (Math.random() * -9.5 - 0.5)
    const y = (Math.random() * 12) - 6
    const z = (Math.random() * 6) - 3

    const base = new THREE.Vector3(x, y, z)
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    // Default color: soft purple (0x8B5CF6)
    nodeColors[i * 3]     = 0x8B / 255
    nodeColors[i * 3 + 1] = 0x5C / 255
    nodeColors[i * 3 + 2] = 0xF6 / 255

    nodesList.push({
      basePos: base.clone(),
      pos: base.clone(),
      vel: new THREE.Vector3(),
      targetPos: base.clone(),
      size: Math.random() * 0.2 + 0.1,
      brightness: 1.0,
      highlighted: false
    })
  }


  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pointsGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3))
  
  // Custom Node Material (per-vertex color with soft glow circle)
  const nodeMaterial = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: `
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 45.0 / -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, dist);
        gl_FragColor = vec4(vColor, alpha * 0.85);
      }
    `,
    transparent: true,
    depthWrite: false
  })

  const points = new THREE.Points(pointsGeometry, nodeMaterial)
  nodesGroup.add(points)

  // Connections Lines — vertexColors lets individual segments highlight
  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.125,
    blending: THREE.AdditiveBlending
  })
  
  const lineGeometry = new THREE.BufferGeometry()
  lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial)
  scene.add(lineSegments)

  // Event Listeners
  window.addEventListener('resize', handleResize)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('click', onPointerClick)

  // Simulation Loop
  const clock = new THREE.Clock()
  let animationFrameId: number

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)

    const delta = Math.min(clock.getDelta(), 0.1)

    // Smooth mouse coordinates integration
    mouse.lerp(targetMouse, 0.1)

    // Click repulsion pulse decay
    if (clickPulse.value > 0) {
      clickPulse.value -= delta * 1.5
      if (clickPulse.value < 0) clickPulse.value = 0
    }

    if (camera && scene && renderer && nodesGroup && lineSegments) {
      const positionsAttr = points.geometry.attributes.position as THREE.BufferAttribute
      const colorsAttr = points.geometry.attributes.color as THREE.BufferAttribute
      const linePositions: number[] = []
      const lineColors: number[] = []

      // Convert normal mouse into 3D ray target
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera)
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      const mouse3D = new THREE.Vector3()
      raycaster.ray.intersectPlane(plane, mouse3D)

      // Transform nodes based on mode
      const isMenu = props.mode === 'menu'
      
      for (let i = 0; i < nodesList.length; i++) {
        const node = nodesList[i]
        if (!node) continue

        // Calculate dynamic configuration target positions
        if (isMenu) {
          // System Map: Reorganize nodes into a larger concentric constellation
          const angle = (i / nodesList.length) * Math.PI * 2
          const radius = 5.5
          node.targetPos.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.7, -1)
        } else if (props.mode === 'project') {
          // Recede background, focus focus project
          node.targetPos.set(node.basePos.x * 1.2, node.basePos.y * 1.2, -4)
        } else {
          // Normal mode (floating drift)
          const time = clock.getElapsedTime()
          const driftX = Math.sin(time * 0.5 + i) * 0.3
          const driftY = Math.cos(time * 0.4 + i) * 0.3
          node.targetPos.copy(node.basePos).add(new THREE.Vector3(driftX, driftY, 0))
        }

        // Magnetic Attraction logic
        const distToMouse = node.pos.distanceTo(mouse3D)
        const attractionRange = 3.5 // Tight radius for a precise magnetic feel
        
        let magnetRatio = 0.0
        if (!prefersReduced.value && distToMouse < attractionRange && mouse.x > -9000) {
          magnetRatio = 1.0 - distToMouse / attractionRange
          // Steeper exponential curve — barely felt at range edge, intense snap up close
          const force = Math.pow(magnetRatio, 2.2) * 1.5
          const dir = new THREE.Vector3().subVectors(mouse3D, node.pos).normalize()
          node.targetPos.addScaledVector(dir, force * 4.0) // Strong pull toward cursor
          // Push nodes toward camera for a dramatic 3D depth effect
          node.targetPos.z += force * 2.5
        }

        // Smooth brightness transition toward target (highlight when magnetized)
        const targetBrightness = magnetRatio
        node.brightness += (targetBrightness - node.brightness) * 0.12

        // Interpolate node color: base purple -> bright white-violet on highlight
        const bPurple = { r: 0x8B / 255, g: 0x5C / 255, b: 0xF6 / 255 }
        const bHigh   = { r: 1.0, g: 0.92, b: 1.0 } // near-white with violet tint
        const t = Math.pow(node.brightness, 1.5)
        colorsAttr.setXYZ(
          i,
          bPurple.r + (bHigh.r - bPurple.r) * t,
          bPurple.g + (bHigh.g - bPurple.g) * t,
          bPurple.b + (bHigh.b - bPurple.b) * t
        )


        // Click Repulsion Pulse logic
        if (clickPulse.value > 0) {
          const distToClick = node.pos.distanceTo(clickPos)
          const pulseRange = 4.0
          if (distToClick < pulseRange) {
            const repulsionForce = (1.0 - distToClick / pulseRange) * clickPulse.value * 2.0
            const dir = new THREE.Vector3().subVectors(node.pos, clickPos).normalize()
            node.targetPos.addScaledVector(dir, repulsionForce)
          }
        }

        // Spring-like physics restoration
        const springK = 2.0
        const damping = 0.85
        
        const force = new THREE.Vector3().subVectors(node.targetPos, node.pos).multiplyScalar(springK)
        node.vel.add(force.multiplyScalar(delta))
        node.vel.multiplyScalar(damping)
        node.pos.addScaledVector(node.vel, delta)

        // Write positions back to BufferAttribute
        positionsAttr.setXYZ(i, node.pos.x, node.pos.y, node.pos.z)
      }

      positionsAttr.needsUpdate = true
      colorsAttr.needsUpdate = true

      // Generate connecting lines between close nodes
      if (!prefersReduced.value) {
        for (let i = 0; i < nodesList.length; i++) {
          const nodeA = nodesList[i]
          if (!nodeA) continue
          for (let j = i + 1; j < nodesList.length; j++) {
            const nodeB = nodesList[j]
            if (!nodeB) continue
            const dist = nodeA.pos.distanceTo(nodeB.pos)
            if (dist < maxDistance) {
              linePositions.push(
                nodeA.pos.x, nodeA.pos.y, nodeA.pos.z,
                nodeB.pos.x, nodeB.pos.y, nodeB.pos.z
              )
              // Line color: blend between dim base and bright highlight per endpoint
              const bA = nodeA.brightness
              const bB = nodeB.brightness
              const baseR = 0x8B / 255 * 0.5, baseG = 0x20 / 255 * 0.5, baseB_ = 0xF0 / 255 * 0.5
              const hiR = 0.85, hiG = 0.6, hiB_ = 1.0
              lineColors.push(
                baseR + (hiR - baseR) * bA, baseG + (hiG - baseG) * bA, baseB_ + (hiB_ - baseB_) * bA,
                baseR + (hiR - baseR) * bB, baseG + (hiG - baseG) * bB, baseB_ + (hiB_ - baseB_) * bB
              )
            }
          }
        }
      }

      lineSegments.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      )
      lineSegments.geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(lineColors, 3)
      )
      lineSegments.geometry.computeBoundingSphere()

      renderer.render(scene, camera)
    }
  }

  animate()

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('click', onPointerClick)

    // Properly dispose ThreeJS structures
    if (renderer) renderer.dispose()
    if (pointsGeometry) pointsGeometry.dispose()
    if (nodeMaterial) nodeMaterial.dispose()
    if (lineMaterial) lineMaterial.dispose()
    if (lineGeometry) lineGeometry.dispose()
  })
})
</script>
