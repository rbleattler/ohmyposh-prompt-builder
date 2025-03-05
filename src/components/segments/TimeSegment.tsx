import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import { SegmentProps } from '../types/SegmentProps';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';

interface TimeSegmentProps extends SegmentProps {
  config: {
    timeFormat?: string;
    dateFormat?: string;
    showDate?: boolean;
    showTime?: boolean;
    showIcons?: boolean;
    timezone?: string;
  };
}

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
}));

const Section = styled('div')({
  display: 'flex',
  alignItems: 'center',
  marginRight: 8,
});

export const TimeSegment: React.FC<TimeSegmentProps> = ({ config, foreground, background }) => {
  const {
    timeFormat = 'HH:mm:ss',
    dateFormat = 'MMM dd, yyyy',
    showDate = true,
    showTime = true,
    showIcons = true,
    timezone
  } = config;

  // In a real implementation, you would handle timezone properly
  const now = new Date();

  const formattedTime = format(now, timeFormat);
  const formattedDate = format(now, dateFormat);

  return (
    <Container style={{ color: foreground, backgroundColor: background }}>
      {showTime && (
        <Section>
          {showIcons && <FontAwesomeIcon icon={faClock} style={{ marginRight: 8 }} />}
          <span>{formattedTime}</span>
        </Section>
      )}

      {showDate && (
        <Section>
          {showIcons && <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: 8 }} />}
          <span>{formattedDate}</span>
        </Section>
      )}

      {timezone && (
        <span style={{ fontSize: '0.8em', opacity: 0.8 }}>
          {timezone}
        </span>
      )}
    </Container>
  );
};

export default TimeSegment;
