import React, { useEffect, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Ring, OrbitControls } from '@react-three/drei';
import { Interactive } from '@react-three/xr';
import * as THREE from 'three';
import { useTrainingStore } from '../store/trainingStore';
import { soundManager } from '../utils/audio';

const FIRE_SAFETY_STEPS = [
  { id: 'step_1', instruction: 'Identify and click the Fire Extinguisher on the workbench.', targetObject: 'extinguisher', requiredAction: 'click' },
  { id: 'step_2', instruction: 'Pick up (grab / click) the Fire Extinguisher.', targetObject: 'extinguisher', requiredAction: 'grab' },
  { id: 'step_3', instruction: 'Pull and remove the yellow Safety Pin.', targetObject: 'pin', requiredAction: 'click' },
  { id: 'step_4', instruction: 'Aim at the base of the fire and discharge the handle.', targetObject: 'fire', requiredAction: 'click' }
];

export function FireSafetyScene() {
  const { setSteps, currentStepIndex, nextStep, recordMistake, completeTraining, steps, isComplete } = useTrainingStore();
  
  const [extinguisherGrabbed, setExtinguisherGrabbed] = useState(false);
  const [pinRemoved, setPinRemoved] = useState(false);
  const [fireExtinguished, setFireExtinguished] = useState(false);
  const [isDischarging, setIsDischarging] = useState(false);

  const flameRef1 = useRef<THREE.Mesh>(null);
  const flameRef2 = useRef<THREE.Mesh>(null);
  const flameRef3 = useRef<THREE.Mesh>(null);
  const fireLightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    setSteps(FIRE_SAFETY_STEPS);
  }, [setSteps]);

  // Animate flames
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!fireExtinguished) {
      if (flameRef1.current) {
        flameRef1.current.scale.y = 1 + Math.sin(t * 12) * 0.2;
        flameRef1.current.rotation.y = t * 2;
      }
      if (flameRef2.current) {
        flameRef2.current.scale.y = 0.9 + Math.cos(t * 15) * 0.25;
        flameRef2.current.rotation.y = -t * 2.5;
      }
      if (flameRef3.current) {
        flameRef3.current.scale.x = 0.8 + Math.sin(t * 18) * 0.15;
      }
      if (fireLightRef.current) {
        fireLightRef.current.intensity = 2.5 + Math.sin(t * 20) * 0.8;
      }
    }
  });

  const handleAction = (objectName: string, actionType: string) => {
    if (isComplete) return;

    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    // Both 'grab' and 'click' satisfy the pickup step for desktop friendliness
    const isStepMatch =
      currentStep.targetObject === objectName &&
      (currentStep.requiredAction === actionType || (currentStep.requiredAction === 'grab' && actionType === 'click'));

    if (isStepMatch) {
      soundManager.playClick();

      if (objectName === 'extinguisher' && (actionType === 'grab' || actionType === 'click')) {
        setExtinguisherGrabbed(true);
      }
      if (objectName === 'pin' && actionType === 'click') {
        setPinRemoved(true);
      }
      if (objectName === 'fire' && actionType === 'click') {
        setIsDischarging(true);
        soundManager.playExtinguish();
        setTimeout(() => {
          setFireExtinguished(true);
          setIsDischarging(false);
          soundManager.playSuccess();
        }, 1200);
      }

      if (currentStepIndex === steps.length - 1) {
        setTimeout(() => {
          completeTraining();
        }, 1500);
      } else {
        nextStep();
      }
    } else {
      soundManager.playError();
      recordMistake();
    }
  };

  const activeTarget = steps[currentStepIndex]?.targetObject;

  return (
    <group>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />

      {/* Desktop Camera Orbit Controls */}
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.05} minDistance={1} maxDistance={10} target={[0, 0, -2]} />

      {/* TRAINING ROOM / WORKSHOP */}
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#2d3748" roughness={0.7} />
      </mesh>
      {/* Back Wall */}
      <mesh position={[0, 4.5, -8]}>
        <planeGeometry args={[24, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-8, 4.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[24, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Right Wall */}
      <mesh position={[8, 4.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[24, 12]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* SAFETY EXIT DOOR */}
      <group position={[6.5, 0.5, -7.9]}>
        <mesh>
          <boxGeometry args={[2.2, 4, 0.1]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
        <Text position={[0, 1.6, 0.08]} fontSize={0.28} color="white" anchorX="center" anchorY="middle">
          EMERGENCY EXIT
        </Text>
      </group>

      {/* SAFETY WARNING SIGN */}
      <group position={[-3, 2.5, -7.9]}>
        <mesh>
          <boxGeometry args={[3, 1.2, 0.05]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        <Text position={[0, 0.2, 0.04]} fontSize={0.25} color="#1e293b" anchorX="center" anchorY="middle">
          ⚠ SAFETY TRAINING ZONE
        </Text>
        <Text position={[0, -0.2, 0.04]} fontSize={0.16} color="#334155" anchorX="center" anchorY="middle">
          Follow Pass Protocol: Pull, Aim, Squeeze, Sweep
        </Text>
      </group>

      {/* WORKBENCH TABLE */}
      <group position={[-2.2, -0.9, -2.5]}>
        {/* Table Top */}
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[2.4, 0.12, 1.4]} />
          <meshStandardMaterial color="#854d0e" roughness={0.6} />
        </mesh>
        {/* Table Legs */}
        {[-1, 1].map((x) =>
          [-0.5, 0.5].map((z) => (
            <mesh key={`leg-${x}-${z}`} position={[x, -0.3, z]}>
              <cylinderGeometry args={[0.06, 0.06, 1.4]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* INTERACTIVE FIRE EXTINGUISHER */}
      <Interactive
        onSelect={() => handleAction('extinguisher', extinguisherGrabbed ? 'grab' : 'click')}
        onSqueeze={() => handleAction('extinguisher', 'grab')}
      >
        <group
          position={extinguisherGrabbed ? [0.6, -0.6, -1.4] : [-2.2, -0.05, -2.5]}
          rotation={extinguisherGrabbed ? [0.2, -0.4, 0] : [0, 0.3, 0]}
        >
          {/* Active Step Indicator Halo */}
          {activeTarget === 'extinguisher' && (
            <Float speed={3} rotationIntensity={0} floatIntensity={0.5}>
              <Ring args={[0.35, 0.42, 32]} position={[0, 1.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} />
              </Ring>
              <Text position={[0, 1.4, 0]} fontSize={0.2} color="#38bdf8" anchorX="center" anchorY="middle">
                ▼ SELECT
              </Text>
            </Float>
          )}

          {/* Main Red Cylinder */}
          <mesh
            position={[0, 0.35, 0]}
            onClick={(e) => {
              e.stopPropagation();
              handleAction('extinguisher', extinguisherGrabbed ? 'grab' : 'click');
            }}
          >
            <cylinderGeometry args={[0.22, 0.22, 0.85, 32]} />
            <meshStandardMaterial color="#dc2626" metalness={0.3} roughness={0.3} />
          </mesh>

          {/* Extinguisher Label */}
          <mesh position={[0, 0.35, 0.23]}>
            <planeGeometry args={[0.24, 0.45]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Text position={[0, 0.38, 0.235]} fontSize={0.07} color="#dc2626" anchorX="center" anchorY="middle">
            FIRE
          </Text>
          <Text position={[0, 0.28, 0.235]} fontSize={0.05} color="#000000" anchorX="center" anchorY="middle">
            EXTINGUISHER
          </Text>

          {/* Valve / Neck */}
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.07, 0.1, 0.15, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>

          {/* Pressure Gauge */}
          <mesh position={[0.1, 0.85, 0.08]} rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>

          {/* Operating Lever / Handle */}
          <mesh position={[0, 0.92, -0.05]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.06, 0.03, 0.28]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>

          {/* SAFETY PIN (Interactive) */}
          {!pinRemoved && (
            <Interactive onSelect={() => handleAction('pin', 'click')}>
              <group
                position={[-0.08, 0.86, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction('pin', 'click');
                }}
              >
                {activeTarget === 'pin' && (
                  <Float speed={4} floatIntensity={0.6}>
                    <Text position={[0, 0.3, 0]} fontSize={0.16} color="#facc15" anchorX="center" anchorY="middle">
                      ▼ PULL PIN
                    </Text>
                  </Float>
                )}
                {/* Pin Ring */}
                <mesh rotation={[0, Math.PI / 2, 0]}>
                  <torusGeometry args={[0.05, 0.015, 12, 24]} />
                  <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Pin shaft */}
                <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                  <meshStandardMaterial color="#facc15" />
                </mesh>
              </group>
            </Interactive>
          )}

          {/* Discharge Hose & Nozzle */}
          <mesh position={[-0.15, 0.45, 0.12]} rotation={[0.4, 0, -0.5]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 16]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
        </group>
      </Interactive>

      {/* DISCHARGE SPRAY EFFECT (When extinguishing) */}
      {isDischarging && (
        <group position={[0.4, -0.2, -1.8]}>
          <mesh rotation={[-0.4, 0.4, 0]}>
            <coneGeometry args={[0.5, 2.5, 16]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.65} />
          </mesh>
        </group>
      )}

      {/* FIRE HAZARD ZONE (Interactive Target) */}
      <group position={[2.5, -0.9, -3.5]}>
        {/* Burning Pallet / Trash Bin */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.55, 0.45, 0.7, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>

        {!fireExtinguished ? (
          <Interactive onSelect={() => handleAction('fire', 'click')}>
            <group
              position={[0, 0.3, 0]}
              onClick={(e) => {
                e.stopPropagation();
                handleAction('fire', 'click');
              }}
            >
              {activeTarget === 'fire' && (
                <Float speed={3} floatIntensity={0.5}>
                  <Text position={[0, 1.8, 0]} fontSize={0.22} color="#f97316" anchorX="center" anchorY="middle">
                    ▼ AIM & DISCHARGE HERE
                  </Text>
                </Float>
              )}

              {/* Flame Layer 1 */}
              <mesh ref={flameRef1} position={[0, 0.4, 0]}>
                <coneGeometry args={[0.45, 1.2, 16]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.85} />
              </mesh>
              {/* Flame Layer 2 */}
              <mesh ref={flameRef2} position={[0, 0.35, 0]}>
                <coneGeometry args={[0.35, 1.0, 16]} />
                <meshBasicMaterial color="#f97316" transparent opacity={0.9} />
              </mesh>
              {/* Flame Inner Core */}
              <mesh ref={flameRef3} position={[0, 0.25, 0]}>
                <coneGeometry args={[0.2, 0.6, 16]} />
                <meshBasicMaterial color="#fef08a" />
              </mesh>

              {/* Dynamic Fire Flicker Light */}
              <pointLight ref={fireLightRef} color="#ff6b00" intensity={3} distance={7} />
            </group>
          </Interactive>
        ) : (
          <group position={[0, 0.4, 0]}>
            {/* Extinguished Smoke / Ash */}
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial color="#475569" roughness={1} />
            </mesh>
            <Text position={[0, 1.0, 0]} fontSize={0.3} color="#22c55e" anchorX="center" anchorY="middle">
              ✓ FIRE EXTINGUISHED!
            </Text>
          </group>
        )}
      </group>
    </group>
  );
}
