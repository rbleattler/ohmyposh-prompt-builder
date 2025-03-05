import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBatteryFull,
  faBatteryThreeQuarters,
  faBatteryHalf,
  faBatteryQuarter,
  faBatteryEmpty,
  faBolt
} from '@fortawesome/free-solid-svg-icons';
import { SegmentProps } from '../types/SegmentProps';
import { styled } from '@mui/material/styles';

interface BatterySegmentProps extends SegmentProps {
  config: {
    percentage?: number;
    charging?: boolean;
    showPercentage?: boolean;
    lowThreshold?: number;
    colorByPercentage?: boolean;
  };
}

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
}));

const getBatteryIcon = (percentage: number) => {
  if (percentage >= 87) return faBatteryFull;
  if (percentage >= 62) return faBatteryThreeQuarters;
  if (percentage >= 37) return faBatteryHalf;
  if (percentage >= 12) return faBatteryQuarter;
  return faBatteryEmpty;
};

const getBatteryColor = (percentage: number, lowThreshold: number) => {
  if (percentage <= lowThreshold) return '#E74C3C'; // red for low battery
  if (percentage <= 30) return '#F39C12'; // orange for medium-low
  return undefined; // default color
};

export const BatterySegment: React.FC<BatterySegmentProps> = ({ config, foreground, background }) => {
  const {
    percentage = 100,
    charging = false,
    showPercentage = true,
    lowThreshold = 20,
    colorByPercentage = true
  } = config;

  const batteryColor = colorByPercentage ? getBatteryColor(percentage, lowThreshold) : undefined;

  return (
    <Container style={{ color: foreground, backgroundColor: background }}>
      <span style={{ color: batteryColor }}>
        <FontAwesomeIcon icon={getBatteryIcon(percentage)} />
        {charging && (
          <span style={{ marginLeft: 4 }}>
            <FontAwesomeIcon icon={faBolt} />
          </span>
        )}
      </span>
      {showPercentage && (
        <span style={{ marginLeft: 8, color: batteryColor }}>
          {percentage}%
        </span>
      )}
    </Container>
  );
};

export default BatterySegment;
