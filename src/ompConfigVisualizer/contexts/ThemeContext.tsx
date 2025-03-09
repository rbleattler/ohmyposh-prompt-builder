import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define a type for the theme configuration
interface ThemeConfig {
  $schema?: string;
  version?: number;
  final_space?: boolean;
  blocks?: Block[];
  console_title_template?: string;
  [key: string]: any; // Allow for additional properties
}

// Define a type for blocks
interface Block {
  type: string;
  alignment?: 'left' | 'right';
  segments?: Segment[];
  newline?: boolean;
  [key: string]: any; // Allow for additional properties
}

// Define a type for segments
interface Segment {
  type: string;
  style?: 'plain' | 'diamond' | 'powerline';
  foreground?: string;
  background?: string;
  properties?: Record<string, any>;
  [key: string]: any; // Allow for additional properties
}

// Default theme template with minimal structure
const defaultTheme: ThemeConfig = {
  $schema: "https://raw.githubusercontent.com/JanDeDobbeleer/oh-my-posh/main/themes/schema.json",
  version: 2,
  final_space: true,
  blocks: [
    {
      type: "prompt",
      alignment: "left",
      segments: [
        {
          type: "path",
          style: "powerline",
          powerline_symbol: "\uE0B0",
          foreground: "#ffffff",
          background: "#61AFEF",
          properties: {
            style: "folder"
          }
        }
      ]
    }
  ]
};

// Define the context type
interface ThemeContextType {
  themeConfig: ThemeConfig;
  updateTheme: (newConfig: ThemeConfig) => void;
  addBlock: () => void;
  updateBlock: (blockIndex: number, updatedBlock: Block) => void;
  removeBlock: (blockIndex: number) => void;
  addSegment: (blockIndex: number, newSegment: Segment) => void;
}

// Create the context with undefined default
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for theme configuration
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(() => {
    // Try to load from localStorage first
    const savedTheme = localStorage.getItem('themeConfig');
    if (savedTheme) {
      try {
        return JSON.parse(savedTheme);
      } catch (e) {
        console.error('Failed to parse saved theme:', e);
      }
    }
    // Fall back to default theme
    return defaultTheme;
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    if (themeConfig) {
      localStorage.setItem('themeConfig', JSON.stringify(themeConfig));
    }
  }, [themeConfig]);

  // Update entire theme configuration
  const updateTheme = (newConfig: ThemeConfig) => {
    setThemeConfig(newConfig);
  };

  // Add a new block to the theme
  const addBlock = () => {
    setThemeConfig((prevConfig: ThemeConfig) => {
      const updatedBlocks = [...(prevConfig.blocks || []), {
        type: "prompt",
        alignment: "left",
        segments: []
      }];

      return { ...prevConfig, blocks: updatedBlocks };
    });
  };

  // Update a specific block
  const updateBlock = (blockIndex: number, updatedBlock: Block) => {
    setThemeConfig((prevConfig: ThemeConfig) => {
      const updatedBlocks = [...(prevConfig.blocks || [])];
      updatedBlocks[blockIndex] = updatedBlock;

      return { ...prevConfig, blocks: updatedBlocks };
    });
  };

  // Remove a block
  const removeBlock = (blockIndex: number) => {
    setThemeConfig((prevConfig: ThemeConfig) => {
      const updatedBlocks = [...(prevConfig.blocks || [])];
      updatedBlocks.splice(blockIndex, 1);

      return { ...prevConfig, blocks: updatedBlocks };
    });
  };

  // Add a new segment to a block
  const addSegment = (blockIndex: number, newSegment: Segment) => {
    setThemeConfig((prevConfig: ThemeConfig) => {
      const updatedBlocks = [...(prevConfig.blocks || [])];

      if (!updatedBlocks[blockIndex]) {
        console.error(`Block at index ${blockIndex} not found`);
        return prevConfig;
      }

      const updatedSegments = [...(updatedBlocks[blockIndex].segments || []), newSegment];
      updatedBlocks[blockIndex] = {
        ...updatedBlocks[blockIndex],
        segments: updatedSegments
      };

      return { ...prevConfig, blocks: updatedBlocks };
    });
  };

  // Context value
  const contextValue: ThemeContextType = {
    themeConfig,
    updateTheme,
    addBlock,
    updateBlock,
    removeBlock,
    addSegment
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
