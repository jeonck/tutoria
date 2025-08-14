import React, { useState, useEffect, useMemo } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { TutorialCard } from './TutorialCard';
import { Tutorial } from '../types/tutorial';

interface VirtualizedTutorialGridProps {
  tutorials: Tutorial[];
  onEdit: (tutorial: Tutorial) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onView: (tutorial: Tutorial) => void;
  onDownloadMarkdown?: (tutorial: Tutorial) => void;
}

interface GridItemProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
  data: {
    tutorials: Tutorial[];
    columnsPerRow: number;
    onEdit: (tutorial: Tutorial) => void;
    onDelete: (id: number) => void;
    onToggleComplete: (id: number) => void;
    onToggleFavorite: (id: number) => void;
    onView: (tutorial: Tutorial) => void;
    onDownloadMarkdown?: (tutorial: Tutorial) => void;
  };
}

const GridItem: React.FC<GridItemProps> = ({ columnIndex, rowIndex, style, data }) => {
  const { tutorials, columnsPerRow, onEdit, onDelete, onToggleComplete, onToggleFavorite, onView, onDownloadMarkdown } = data;
  const index = rowIndex * columnsPerRow + columnIndex;
  const tutorial = tutorials[index];

  if (!tutorial) {
    return <div style={style} />;
  }

  return (
    <div style={{ ...style, padding: '12px' }}>
      <TutorialCard
        tutorial={tutorial}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
        onToggleFavorite={onToggleFavorite}
        onView={onView}
        onDownloadMarkdown={onDownloadMarkdown}
      />
    </div>
  );
};

export const VirtualizedTutorialGrid: React.FC<VirtualizedTutorialGridProps> = ({
  tutorials,
  onEdit,
  onDelete,
  onToggleComplete,
  onToggleFavorite,
  onView,
  onDownloadMarkdown
}) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      const container = document.getElementById('tutorial-grid-container');
      if (container) {
        setContainerSize({
          width: container.clientWidth,
          height: Math.min(container.clientHeight, 800) // Max height for better UX
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const { columnsPerRow, columnWidth, rowHeight, rowCount } = useMemo(() => {
    const minColumnWidth = 350; // Minimum width for tutorial cards
    const gap = 24; // Gap between cards
    const availableWidth = containerSize.width - gap;
    
    const cols = Math.max(1, Math.floor(availableWidth / (minColumnWidth + gap)));
    const colWidth = Math.floor((availableWidth - (gap * (cols - 1))) / cols);
    const cardHeight = 320; // Approximate height of tutorial card
    const rows = Math.ceil(tutorials.length / cols);

    return {
      columnsPerRow: cols,
      columnWidth: colWidth,
      rowHeight: cardHeight + gap,
      rowCount: rows
    };
  }, [containerSize.width, tutorials.length]);

  const itemData = {
    tutorials,
    columnsPerRow,
    onEdit,
    onDelete,
    onToggleComplete,
    onToggleFavorite,
    onView,
    onDownloadMarkdown
  };

  if (containerSize.width === 0 || containerSize.height === 0) {
    return (
      <div 
        id="tutorial-grid-container" 
        className="w-full h-96 flex items-center justify-center"
      >
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // For small numbers of tutorials, use regular grid
  if (tutorials.length <= 20) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map(tutorial => (
          <TutorialCard
            key={tutorial.id}
            tutorial={tutorial}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
            onToggleFavorite={onToggleFavorite}
            onView={onView}
            onDownloadMarkdown={onDownloadMarkdown}
          />
        ))}
      </div>
    );
  }

  return (
    <div id="tutorial-grid-container" className="w-full" style={{ height: containerSize.height }}>
      <Grid
        columnCount={columnsPerRow}
        columnWidth={columnWidth}
        height={containerSize.height}
        rowCount={rowCount}
        rowHeight={rowHeight}
        width={containerSize.width}
        itemData={itemData}
      >
        {GridItem}
      </Grid>
    </div>
  );
};