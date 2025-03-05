import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch, faCodeCommit, faArrowUp, faArrowDown, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { SegmentProps } from '../types/SegmentProps';
import { styled } from '@mui/material/styles';

interface GitSegmentProps extends SegmentProps {
  config: {
    branch?: string;
    ahead?: number;
    behind?: number;
    dirty?: boolean;
    added?: number;
    modified?: number;
    deleted?: number;
    showStatus?: boolean;
    showAheadBehind?: boolean;
    showStashCount?: boolean;
    stashCount?: number;
  };
}

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
}));

const Status = styled('div')({
  display: 'flex',
  marginLeft: 8,
  gap: 4,
});

const StatusItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.85em',
});

export const GitSegment: React.FC<GitSegmentProps> = ({ config, foreground, background }) => {
  const {
    branch = 'main',
    ahead = 0,
    behind = 0,
    dirty = false,
    added = 0,
    modified = 0,
    deleted = 0,
    showStatus = true,
    showAheadBehind = true,
    showStashCount = false,
    stashCount = 0
  } = config;

  return (
    <Container style={{ color: foreground, backgroundColor: background }}>
      <FontAwesomeIcon icon={faCodeBranch} />
      <span style={{ marginLeft: 8 }}>{branch}</span>

      {dirty && <span style={{ marginLeft: 8, color: '#F1C40F' }}>●</span>}

      {showAheadBehind && (ahead > 0 || behind > 0) && (
        <Status>
          {ahead > 0 && (
            <StatusItem>
              <FontAwesomeIcon icon={faArrowUp} size="xs" />
              <span style={{ marginLeft: 2 }}>{ahead}</span>
            </StatusItem>
          )}
          {behind > 0 && (
            <StatusItem>
              <FontAwesomeIcon icon={faArrowDown} size="xs" />
              <span style={{ marginLeft: 2 }}>{behind}</span>
            </StatusItem>
          )}
        </Status>
      )}

      {showStatus && (added > 0 || modified > 0 || deleted > 0) && (
        <Status>
          {added > 0 && (
            <StatusItem style={{ color: '#2ECC71' }}>
              <FontAwesomeIcon icon={faPlus} size="xs" />
              <span style={{ marginLeft: 2 }}>{added}</span>
            </StatusItem>
          )}
          {modified > 0 && (
            <StatusItem style={{ color: '#F1C40F' }}>
              <FontAwesomeIcon icon={faCodeCommit} size="xs" />
              <span style={{ marginLeft: 2 }}>{modified}</span>
            </StatusItem>
          )}
          {deleted > 0 && (
            <StatusItem style={{ color: '#E74C3C' }}>
              <FontAwesomeIcon icon={faMinus} size="xs" />
              <span style={{ marginLeft: 2 }}>{deleted}</span>
            </StatusItem>
          )}
        </Status>
      )}

      {showStashCount && stashCount > 0 && (
        <StatusItem style={{ marginLeft: 8 }}>
          <span style={{ fontSize: '0.85em' }}>≡{stashCount}</span>
        </StatusItem>
      )}
    </Container>
  );
};

export default GitSegment;
