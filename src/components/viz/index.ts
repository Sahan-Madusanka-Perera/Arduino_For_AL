import type { ComponentType } from 'react'
import { IotLoopFigure, EnablersFigure } from './iot'
import {
  IpoFigure,
  McuChipFigure,
  MpuVsMcuFigure,
  ComparisonScaleFigure,
  HighLowFigure,
} from './embedded'
import { UnoBoardFigure, AdcFigure, PowerFigure } from './board'
import {
  BreadboardFigure,
  JumperFigure,
  LedFigure,
  ResistorBandsFigure,
  ServoFigure,
} from './components'
import {
  SensorChainFigure,
  UltrasonicFigure,
  Lm35Figure,
  DividerFigure,
  PullupFigure,
} from './sensors'
import {
  UploadPipelineFigure,
  SetupLoopFigure,
  VariableFigure,
  IfFlowFigure,
  ForLoopFigure,
  WhileVsDoFigure,
} from './programming'

/** Content names a figure by string; this is the only place that string
 *  becomes a component. Adding a figure means adding one line here. */
export const FIGURES: Record<string, ComponentType<{ description: string }>> = {
  IotLoopFigure,
  EnablersFigure,
  IpoFigure,
  McuChipFigure,
  MpuVsMcuFigure,
  ComparisonScaleFigure,
  UnoBoardFigure,
  HighLowFigure,
  AdcFigure,
  PowerFigure,
  BreadboardFigure,
  JumperFigure,
  LedFigure,
  ResistorBandsFigure,
  ServoFigure,
  SensorChainFigure,
  UltrasonicFigure,
  Lm35Figure,
  DividerFigure,
  PullupFigure,
  UploadPipelineFigure,
  SetupLoopFigure,
  VariableFigure,
  IfFlowFigure,
  ForLoopFigure,
  WhileVsDoFigure,
}

export { PartArt } from './parts'
export { FigureFrame, VizSlider, VizToggle, VizStepper } from './Frame'
