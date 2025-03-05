import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faCloudSun,
  faCloud,
  faCloudRain,
  faCloudShowersHeavy,
  faSnowflake,
  faBolt,
  faSmog
} from '@fortawesome/free-solid-svg-icons';
import { SegmentProps } from '../types/SegmentProps';
import { styled } from '@mui/material/styles';

interface WeatherSegmentProps extends SegmentProps {
  config: {
    condition?: string;
    temperature?: number;
    unit?: 'C' | 'F';
    showCity?: boolean;
    city?: string;
    showCondition?: boolean;
  };
}

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
}));

const getWeatherIcon = (condition: string) => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) return faSun;
  if (lowerCondition.includes('partly cloudy')) return faCloudSun;
  if (lowerCondition.includes('cloud')) return faCloud;
  if (lowerCondition.includes('rain')) return faCloudRain;
  if (lowerCondition.includes('shower') || lowerCondition.includes('storm')) return faCloudShowersHeavy;
  if (lowerCondition.includes('snow') || lowerCondition.includes('ice')) return faSnowflake;
  if (lowerCondition.includes('thunder')) return faBolt;
  if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) return faSmog;
  return faSun; // default
};

export const WeatherSegment: React.FC<WeatherSegmentProps> = ({ config, foreground, background }) => {
  const {
    condition = 'Sunny',
    temperature = 22,
    unit = 'C',
    showCity = true,
    city = 'New York',
    showCondition = true
  } = config;

  const weatherIcon = getWeatherIcon(condition);

  return (
    <Container style={{ color: foreground, backgroundColor: background }}>
      <FontAwesomeIcon icon={weatherIcon} />

      <span style={{ marginLeft: 8 }}>
        {temperature}°{unit}
      </span>

      {showCondition && (
        <span style={{ marginLeft: 8, fontSize: '0.9em' }}>
          {condition}
        </span>
      )}

      {showCity && (
        <span style={{ marginLeft: 8, fontSize: '0.9em', opacity: 0.8 }}>
          in {city}
        </span>
      )}
    </Container>
  );
};

export default WeatherSegment;
