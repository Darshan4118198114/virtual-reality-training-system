import React, { useEffect, useState } from 'react'
import { Box, Cylinder, Sphere, Text } from '@react-three/drei'
import { Interactive, useInteraction } from '@react-three/xr'
import { useTrainingStore } from '../store/trainingStore'

const FIRE_SAFETY_STEPS = [
  { id: 'step_1', instruction: 'Identify and click the fire extinguisher.', targetObject: 'extinguisher', requiredAction: 'click' },
  { id: 'step_2', instruction: 'Pick up (grab) the extinguisher.', targetObject: 'extinguisher', requiredAction: 'grab' },
  { id: 'step_3', instruction: 'Remove the safety pin.', targetObject: 'pin', requiredAction: 'click' },
  { id: 'step_4', instruction: 'Aim at the fire and press the handle to extinguish.', targetObject: 'fire', requiredAction: 'click' }
];

export function FireSafetyScene() {
  const { setSteps, currentStepIndex, nextStep, recordMistake, completeTraining, steps, isComplete } = useTrainingStore()
  
  const [extinguisherGrabbed, setExtinguisherGrabbed] = useState(false)
  const [pinRemoved, setPinRemoved] = useState(false)
  const [fireExtinguished, setFireExtinguished] = useState(false)

  useEffect(() => {
    setSteps(FIRE_SAFETY_STEPS)
  }, [setSteps])

  const handleAction = (objectName: string, actionType: string) => {
    if (isComplete) return;

    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    if (currentStep.targetObject === objectName && currentStep.requiredAction === actionType) {
      // Success
      if (objectName === 'extinguisher' && actionType === 'grab') setExtinguisherGrabbed(true);
      if (objectName === 'pin' && actionType === 'click') setPinRemoved(true);
      if (objectName === 'fire' && actionType === 'click') setFireExtinguished(true);

      if (currentStepIndex === steps.length - 1) {
        completeTraining();
      } else {
        nextStep();
      }
    } else {
      // Mistake
      recordMistake();
    }
  }

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      {/* Fire Extinguisher */}
      <Interactive 
        onSelect={() => handleAction('extinguisher', 'click')}
        onSqueeze={() => handleAction('extinguisher', 'grab')}
      >
        <group position={extinguisherGrabbed ? [0, 0, -1] : [-2, -0.5, -3]}>
          <Cylinder args={[0.3, 0.3, 1]} onClick={() => handleAction('extinguisher', 'click')}>
            <meshStandardMaterial color="red" />
          </Cylinder>
          
          {/* Safety Pin */}
          {!pinRemoved && (
            <Interactive onSelect={() => handleAction('pin', 'click')}>
              <Sphere args={[0.1]} position={[0, 0.6, 0]} onClick={(e) => { e.stopPropagation(); handleAction('pin', 'click'); }}>
                <meshStandardMaterial color="yellow" />
              </Sphere>
            </Interactive>
          )}
        </group>
      </Interactive>

      {/* Fire */}
      {!fireExtinguished && (
        <Interactive onSelect={() => handleAction('fire', 'click')}>
          <Box args={[1, 1, 1]} position={[2, -1, -4]} onClick={() => handleAction('fire', 'click')}>
            <meshStandardMaterial color="orange" emissive="red" emissiveIntensity={2} />
          </Box>
        </Interactive>
      )}
      
      {fireExtinguished && (
        <Text position={[2, 0, -4]} color="green" fontSize={0.5}>
          Extinguished!
        </Text>
      )}
    </group>
  )
}
