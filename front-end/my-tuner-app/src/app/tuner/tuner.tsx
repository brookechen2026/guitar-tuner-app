'use client'
import React ,{ useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

import processAudioData from './algorithm'
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export default  function Tuner() {
  const [targetFrequency, setTargetFrequency] = useState(440)
  const [currentFrequency, setCurrentFrequency] = useState(440)
  const [selectedNote, setSelectedNote] = useState('A')
  const [pitchDifference, setPitchDifference] = useState<'higher' | 'lower' | 'match'>('match')

  useEffect(() => {
    comparePitch()
  }, [currentFrequency, targetFrequency])


  const handleNoteClick = async (note: string) => {


    setSelectedNote(note)
    const noteIndex = notes.indexOf(note)
    const newFrequency = 440 * Math.pow(2, (noteIndex - 9) / 12)
    setTargetFrequency(Math.round(newFrequency * 100) / 100)

    // Access user microphone
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new (window.AudioContext || window.AudioContext)()
      const source = audioContext.createMediaStreamSource(stream)

      // Call the processAudioData function in algorithm.tsx and get the frequency
      const frequency = await processAudioData(source, audioContext)
      console.log('count: %s', frequency);
      setCurrentFrequency(frequency)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const handleCurrentFrequencyChange = (newFrequency: number[]) => {
    setCurrentFrequency(newFrequency[0])
  }

  const comparePitch = () => {
    const difference = currentFrequency - targetFrequency
    if (Math.abs(difference) < 0.5) {
      setPitchDifference('match')
    } else if (difference > 0) {
      setPitchDifference('higher')
    } else {
      setPitchDifference('lower')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center">Online Tuner UI</h1>
      <div className="grid grid-cols-6 gap-2">
        {notes.map((note) => (
          <Button
            key={note}
            onClick={() => handleNoteClick(note)}
            variant={note === selectedNote ? "default" : "outline"}
            className="w-full"
          >
            {note}
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Target: {targetFrequency.toFixed(2)} Hz</span>
          <span className="text-sm font-medium">Selected Note: {selectedNote}</span>
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium">Current Frequency: {currentFrequency.toFixed(2)} Hz</span>
          <Slider
            min={220}
            max={880}
            step={0.01}
            value={[currentFrequency]}
            onValueChange={handleCurrentFrequencyChange}
          />
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm font-medium">Pitch is:</span>
        {pitchDifference === 'higher' && (
          <div className="flex items-center text-red-500">
            <ArrowUp className="w-5 h-5 mr-1" />
            <span>Too High</span>
          </div>
        )}
        {pitchDifference === 'lower' && (
          <div className="flex items-center text-blue-500">
            <ArrowDown className="w-5 h-5 mr-1" />
            <span>Too Low</span>
          </div>
        )}
        {pitchDifference === 'match' && (
          <div className="flex items-center text-green-500">
            <Minus className="w-5 h-5 mr-1" />
            <span>In Tune</span>
          </div>
        )}
      </div>
    </div>
  )
}