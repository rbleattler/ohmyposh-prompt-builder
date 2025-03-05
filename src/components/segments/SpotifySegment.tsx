import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faPlay, faPause, faMusic } from '@fortawesome/free-solid-svg-icons'; // Fix: Import faMusic from solid icons
import { SegmentProps } from '../types/SegmentProps';
import { styled } from '@mui/material/styles';

interface SpotifySegmentProps extends SegmentProps {
  config: {
    songName?: string;
    artist?: string;
    playing?: boolean;
    maxLength?: number;
    showIcon?: boolean;
    showPlayingStatus?: boolean;
    showArtist?: boolean;
    spotifySpecific?: boolean;
  };
}

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
}));

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
};

export const SpotifySegment: React.FC<SpotifySegmentProps> = ({ config, foreground, background }) => {
  const {
    songName = 'Not playing',
    artist = 'No artist',
    playing = false,
    maxLength = 20,
    showIcon = true,
    showPlayingStatus = true,
    showArtist = true,
    spotifySpecific = true
  } = config;

  const spotifyGreen = '#1DB954';
  const truncatedSong = truncateText(songName, maxLength);
  const truncatedArtist = truncateText(artist, maxLength);

  return (
    <Container style={{ color: foreground, backgroundColor: background }}>
      {showIcon && (
        <span style={{ color: spotifySpecific ? spotifyGreen : undefined, marginRight: 8 }}>
          <FontAwesomeIcon icon={spotifySpecific ? faSpotify : faMusic} />
        </span>
      )}

      {showPlayingStatus && (
        <span style={{ marginRight: 8, fontSize: '0.8em' }}>
          <FontAwesomeIcon icon={playing ? faPlay : faPause} />
        </span>
      )}

      <span>{truncatedSong}</span>

      {showArtist && artist && (
        <span style={{ marginLeft: 8, opacity: 0.8, fontSize: '0.9em' }}>
          by {truncatedArtist}
        </span>
      )}
    </Container>
  );
};

export default SpotifySegment;
